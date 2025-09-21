import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import { parentAPI, slotsAPI } from '../lib/api'
import { X, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface BookSessionModalProps {
  onClose: () => void
  onSuccess: () => void
}

interface Child {
  id: string
  name: string
  age: number
}

interface Therapist {
  id: string
  name: string
  specialization: string
  baseCostPerSession: number
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

interface BookingFormData {
  childId: string
  therapistId: string
  date: string
  timeSlotId: string
}

const BookSessionModal: React.FC<BookSessionModalProps> = ({ onClose, onSuccess }) => {
  const [selectedTherapist, setSelectedTherapist] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>()

  const { data: children = [] } = useQuery(
    'children',
    parentAPI.getChildren,
    {
      select: (response) => response.data,
    }
  )

  // Mock therapists data - in a real app, this would come from an API
  const therapists: Therapist[] = [
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'Child Psychology', baseCostPerSession: 120 },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'Speech Therapy', baseCostPerSession: 100 },
    { id: '3', name: 'Dr. Emily Rodriguez', specialization: 'Occupational Therapy', baseCostPerSession: 110 },
  ]

  const fetchAvailableSlots = async (therapistId: string, date: string) => {
    if (!therapistId || !date) return
    
    setLoadingSlots(true)
    try {
      const response = await slotsAPI.getAvailableSlots(therapistId, date)
      setAvailableSlots(response.data)
    } catch (error: any) {
      toast.error('Failed to fetch available slots')
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleTherapistChange = (therapistId: string) => {
    setSelectedTherapist(therapistId)
    setAvailableSlots([])
    if (selectedDate) {
      fetchAvailableSlots(therapistId, selectedDate)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    if (selectedTherapist) {
      fetchAvailableSlots(selectedTherapist, date)
    }
  }

  const bookSlotMutation = useMutation(
    ({ timeSlotId, childId }: { timeSlotId: string; childId: string }) =>
      slotsAPI.bookSlot(timeSlotId, childId),
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
    bookSlotMutation.mutate({
      timeSlotId: data.timeSlotId,
      childId: data.childId,
    })
  }

  const selectedTherapistData = therapists.find(t => t.id === selectedTherapist)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Book Therapy Session</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Select Child */}
          <div>
            <label htmlFor="childId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Child *
            </label>
            <select
              {...register('childId', { required: 'Please select a child' })}
              className="input"
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

          {/* Select Therapist */}
          <div>
            <label htmlFor="therapistId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Therapist *
            </label>
            <select
              {...register('therapistId', { required: 'Please select a therapist' })}
              onChange={(e) => handleTherapistChange(e.target.value)}
              className="input"
            >
              <option value="">Choose a therapist</option>
              {therapists.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.name} - {therapist.specialization} (${therapist.baseCostPerSession}/session)
                </option>
              ))}
            </select>
            {errors.therapistId && (
              <p className="mt-1 text-sm text-red-600">{errors.therapistId.message}</p>
            )}
          </div>

          {/* Select Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date *
            </label>
            <input
              {...register('date', { required: 'Please select a date' })}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Available Time Slots */}
          {selectedTherapist && selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Time Slots *
              </label>
              {loadingSlots ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading available slots...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No available slots for this date</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot) => (
                    <label key={slot.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        {...register('timeSlotId', { required: 'Please select a time slot' })}
                        type="radio"
                        value={slot.id}
                        className="text-primary-600"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(slot.startTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Duration: {Math.round((new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) / 60000)} min
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {errors.timeSlotId && (
                <p className="mt-1 text-sm text-red-600">{errors.timeSlotId.message}</p>
              )}
            </div>
          )}

          {/* Session Summary */}
          {selectedTherapistData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Session Summary</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Therapist:</strong> {selectedTherapistData.name}</p>
                <p><strong>Specialization:</strong> {selectedTherapistData.specialization}</p>
                <p><strong>Cost:</strong> ${selectedTherapistData.baseCostPerSession}/session</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookSlotMutation.isLoading || !selectedTherapist || !selectedDate}
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

export default BookSessionModal
