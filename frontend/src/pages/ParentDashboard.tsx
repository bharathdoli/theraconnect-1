import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { parentAPI, bookingAPI } from '../lib/api'
import { Plus, Calendar, Users, Clock, Heart } from 'lucide-react'
import AddChildModal from '../components/AddChildModal'
import BookSessionModal from '../components/BookSessionModal'

interface Child {
  id: string
  name: string
  age: number
  address?: string
  condition?: string
  notes?: string
}

interface Booking {
  id: string
  status: string
  createdAt: string
  child: Child
  therapist: {
    name: string
    specialization: string
  }
  timeSlot: {
    startTime: string
    endTime: string
  }
}

const ParentDashboard: React.FC = () => {
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [showBookSessionModal, setShowBookSessionModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: children = [], isLoading: childrenLoading } = useQuery(
    'children',
    parentAPI.getChildren,
    {
      select: (response) => response.data,
    }
  )

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery(
    'parentBookings',
    bookingAPI.getMyBookings,
    {
      select: (response) => response.data,
    }
  )

  const upcomingBookings = bookings.filter((booking: Booking) => 
    new Date(booking.timeSlot.startTime) > new Date()
  ).slice(0, 3)

  const stats = [
    {
      name: 'Total Children',
      value: children.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Upcoming Sessions',
      value: upcomingBookings.length,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      name: 'Total Bookings',
      value: bookings.length,
      icon: Clock,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600">Manage your children and therapy sessions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddChildModal(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Child</span>
          </button>
          <button
            onClick={() => setShowBookSessionModal(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Heart className="h-4 w-4" />
            <span>Book Session</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Children */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="card-title">My Children</h3>
              <button
                onClick={() => setShowAddChildModal(true)}
                className="btn btn-outline btn-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="card-content">
            {childrenLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading children...</p>
              </div>
            ) : children.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No children added yet</p>
                <button
                  onClick={() => setShowAddChildModal(true)}
                  className="btn btn-primary btn-sm mt-4"
                >
                  Add Your First Child
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {children.map((child: Child) => (
                  <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{child.name}</h4>
                      <p className="text-sm text-gray-600">Age: {child.age}</p>
                      {child.condition && (
                        <p className="text-sm text-gray-500">{child.condition}</p>
                      )}
                    </div>
                    <button className="btn btn-outline btn-sm">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Sessions</h3>
          </div>
          <div className="card-content">
            {bookingsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading bookings...</p>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming sessions</p>
                <button
                  onClick={() => setShowBookSessionModal(true)}
                  className="btn btn-primary btn-sm mt-4"
                >
                  Book a Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking: Booking) => (
                  <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{booking.child.name}</h4>
                        <p className="text-sm text-gray-600">
                          with {booking.therapist.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.timeSlot.startTime).toLocaleDateString()} at{' '}
                          {new Date(booking.timeSlot.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'SCHEDULED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddChildModal && (
        <AddChildModal
          onClose={() => setShowAddChildModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries('children')
            setShowAddChildModal(false)
          }}
        />
      )}

      {showBookSessionModal && (
        <BookSessionModal
          onClose={() => setShowBookSessionModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries('parentBookings')
            setShowBookSessionModal(false)
          }}
        />
      )}
    </div>
  )
}

export default ParentDashboard
