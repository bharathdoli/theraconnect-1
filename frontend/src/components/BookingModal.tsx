import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import { parentAPI, bookingAPI } from '../lib/api'
import { X, Calendar, Clock, User, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

interface BookingModalProps {
  onClose: () => void
  onSuccess: () => void
  therapistId: string
  therapistName: string
  therapistSpecialization: string
  therapistFee: number
}

interface Child {
  id: string
  name: string
  age: number
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

interface BookingFormData {
  childId: string
  timeSlotId: string
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  onClose, 
  onSuccess, 
  therapistId, 
  therapistName, 
  therapistSpecialization, 
  therapistFee 
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingFormData>()
  
  const selectedTimeSlotId = watch('timeSlotId')

  const { data: children = [] } = useQuery(
    'children',
    parentAPI.getChildren,
    { select: (response) => response.data }
  )

  const fetchAvailableSlots = async (date: string) => {
    if (!date) return
    
    setLoadingSlots(true)
    try {
      console.log('Fetching slots for:', { therapistId, date })
      const response = await bookingAPI.getAvailableSlots(therapistId, date)
      console.log('Slots response:', response.data)
      setAvailableSlots(response.data)
    } catch (error: any) {
      console.error('Fetch slots error:', error)
      toast.error('Failed to fetch available slots')
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateChange = (date: string) => {
    const isoYMD = /^\d{4}-\d{2}-\d{2}$/
    if (!isoYMD.test(date)) {
      setSelectedDate('')
      setAvailableSlots([])
      return
    }
    
    setSelectedDate(date)
    fetchAvailableSlots(date)
  }

  const bookSlotMutation = useMutation(
    ({ timeSlotId, childId }: { timeSlotId: string; childId: string }) =>
      bookingAPI.createBooking({ timeSlotId, childId }),
    {
      onSuccess: () => {
        toast.success('Session booked successfully!')
        onSuccess()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to book session')
      },
    }
  )

  const onSubmit = (data: BookingFormData) => {
    if (!data.timeSlotId) {
      toast.error('Please select a time slot before booking')
      return
    }
    bookSlotMutation.mutate({
      timeSlotId: data.timeSlotId,
      childId: data.childId,
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    return Math.round((end.getTime() - start.getTime()) / 60000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Book Therapy Session</h2>
              <p className="text-sm text-gray-600">{therapistName} - {therapistSpecialization}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Select Child */}
              <div>
                <label htmlFor="childId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Child *
                </label>
                <select
                  {...register('childId', { required: 'Please select a child' })}
                  className="input w-full"
                >
                  <option value="">Choose a child</option>
                  {children.map((child: Child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} (Age: {child.age})
                    </option>
                  ))}
                </select>
                {errors.childId && (
                  <p className="mt-1 text-sm text-red-600">{errors.childId.message}</p>
                )}
              </div>

              {/* Select Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="input w-full"
                />
              </div>

              {/* Session Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Session Details
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Therapist:</strong> {therapistName}</p>
                  <p><strong>Specialization:</strong> {therapistSpecialization}</p>
                  <p className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <strong>Cost:</strong> ${therapistFee}/session
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Time Slots Calendar */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Available Time Slots
              </h3>
              
              {!selectedDate ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Please select a date to view available slots</p>
                </div>
              ) : loadingSlots ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading available slots...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No available slots for this date</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }) === 'Saturday' || 
                     new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }) === 'Sunday' 
                      ? 'Weekends are not available for booking'
                      : 'All slots may be booked or therapist is not available'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => (
                    <label 
                      key={slot.id} 
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTimeSlotId === slot.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        {...register('timeSlotId', { required: 'Please select a time slot' })}
                        type="radio"
                        value={slot.id}
                        className="text-primary-600"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(slot.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Duration: {getDuration(slot.startTime, slot.endTime)} min
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {errors.timeSlotId && (
                <p className="mt-2 text-sm text-red-600">{errors.timeSlotId.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookSlotMutation.isLoading || !selectedDate || !selectedTimeSlotId}
              className="btn btn-primary flex-1"
            >
              {bookSlotMutation.isLoading ? 'Booking...' : 'Book Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal
