<<<<<<< HEAD
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import { parentAPI, bookingAPI } from '../lib/api'
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
=======
import React, { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { X, Calendar, Clock, User, Star, Heart } from "lucide-react"
import { therapistAPI, bookingAPI } from "../lib/api"
>>>>>>> 3d1437e (final commit)

interface Therapist {
  id: string
  name: string
  specialization: string
<<<<<<< HEAD
  baseCostPerSession: number
=======
  experience: number
  baseCostPerSession: number
  averageRating: number
>>>>>>> 3d1437e (final commit)
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
<<<<<<< HEAD
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
    watch,
  } = useForm<BookingFormData>()
  const selectedTimeSlotId = watch('timeSlotId')

  const { data: children = [] } = useQuery(
    'children',
    parentAPI.getChildren,
    {
      select: (response) => response.data,
    }
  )

  // Load ACTIVE therapists from backend
  const { data: therapists = [], isLoading: loadingTherapists } = useQuery(
    'activeTherapists',
    parentAPI.getActiveTherapists,
    { select: (response) => response.data }
  )

  const fetchAvailableSlots = async (therapistId: string, date: string) => {
    if (!therapistId || !date) return
    
    setLoadingSlots(true)
    try {
      const response = await bookingAPI.getAvailableSlots(therapistId, date)
      setAvailableSlots(response.data)
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to fetch available slots'
      console.error('Fetch slots error:', error)
      toast.error(msg)
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
    // Normalize to strict YYYY-MM-DD without timezone conversion
    let normalized = date
    const isoYMD = /^\d{4}-\d{2}-\d{2}$/
    if (!isoYMD.test(normalized)) {
      if (date.includes('/')) {
        // Try dd/mm/yyyy -> yyyy-mm-dd
        const [a, b, c] = date.split('/')
        if (a && b && c) {
          // If first is >12 treat as DD/MM/YYYY
          if (parseInt(a, 10) > 12) normalized = `${c}-${b.padStart(2,'0')}-${a.padStart(2,'0')}`
          else normalized = `${c}-${a.padStart(2,'0')}-${b.padStart(2,'0')}`
        }
      }
    }
    setSelectedDate(normalized)
    if (selectedTherapist) {
      fetchAvailableSlots(selectedTherapist, normalized)
    }
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
=======
  isBooked: boolean
}

interface Child {
  id: string
  name: string
  age: number
  address?: string
  condition?: string
  notes?: string
}

interface BookSessionModalProps {
  isOpen: boolean
  onClose: () => void
  children: Child[]
  onSuccess?: () => void
}

const BookSessionModal: React.FC<BookSessionModalProps> = ({
  isOpen,
  onClose,
  children,
  onSuccess,
}) => {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const queryClient = useQueryClient()

  // Fetch therapists
  const { data: therapists = [], isLoading: therapistsLoading } = useQuery(
    "therapists",
    therapistAPI.getPublicList,
    {
      select: (response) => response.data,
      enabled: isOpen,
    }
  )

  // Fetch available time slots
  const { data: timeSlots = [], isLoading: slotsLoading } = useQuery(
    ["timeSlots", selectedTherapist?.id, selectedDate],
    () => bookingAPI.getAvailableSlots(selectedTherapist!.id, selectedDate),
    {
      select: (response) => response.data,
      enabled: !!(selectedTherapist && selectedDate),
    }
  )

  // Create booking mutation
  const createBookingMutation = useMutation(
    (data: { childId: string; timeSlotId: string }) =>
      bookingAPI.createBooking(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("parentBookings")
        onSuccess?.()
        onClose()
        resetForm()
>>>>>>> 3d1437e (final commit)
      },
    }
  )

<<<<<<< HEAD
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

  const selectedTherapistData = therapists.find((t: Therapist) => t.id === selectedTherapist)

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
=======
  const resetForm = () => {
    setSelectedTherapist(null)
    setSelectedChild(null)
    setSelectedDate("")
    setSelectedTimeSlot(null)
    setStep(1)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleTherapistSelect = (therapist: Therapist) => {
    setSelectedTherapist(therapist)
    setStep(2)
  }

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child)
    setStep(3)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleBookSession = () => {
    if (selectedChild && selectedTimeSlot) {
      createBookingMutation.mutate({
        childId: selectedChild.id,
        timeSlotId: selectedTimeSlot.id,
      })
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get next 7 days for date selection
  const getNext7Days = () => {
    const days = []
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date.toISOString().split("T")[0])
    }
    return days
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Book a Therapy Session
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
>>>>>>> 3d1437e (final commit)
          >
            <X className="h-6 w-6" />
          </button>
        </div>

<<<<<<< HEAD
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
              {loadingTherapists ? (
                <option value="" disabled>Loading therapists...</option>
              ) : (
                therapists.map((therapist: Therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.name} - {therapist.specialization} (${therapist.baseCostPerSession}/session)
                </option>
                ))
              )}
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
=======
        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                1
              </div>
              <span className="text-sm font-medium">Therapist</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`flex items-center space-x-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="text-sm font-medium">Child & Date</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`flex items-center space-x-2 ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                3
              </div>
              <span className="text-sm font-medium">Time Slot</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Step 1: Select Therapist */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose a Therapist
              </h3>
              {therapistsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading therapists...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {therapists.map((therapist) => (
                    <div
                      key={therapist.id}
                      onClick={() => handleTherapistSelect(therapist)}
                      className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer hover:border-blue-500"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {therapist.name}
                          </h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {therapist.specialization}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {therapist.experience} years experience
                          </p>
                          <div className="flex items-center mt-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                              {therapist.averageRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${therapist.baseCostPerSession}
                          </p>
                          <p className="text-xs text-gray-500">per session</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Child and Date */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Select Your Child
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      onClick={() => handleChildSelect(child)}
                      className={`p-4 border rounded-lg cursor-pointer transition ${
                        selectedChild?.id === child.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "hover:shadow-md hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {child.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Age: {child.age} years
                          </p>
                          {child.condition && (
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              {child.condition}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedChild && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Select Date
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
                    {getNext7Days().map((date) => (
                      <button
                        key={date}
                        onClick={() => handleDateSelect(date)}
                        className={`p-3 text-center border rounded-lg transition ${
                          selectedDate === date
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "hover:shadow-md hover:border-blue-300"
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                        <div className="text-lg font-bold">
                          {new Date(date).getDate()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(date).toLocaleDateString("en-US", { month: "short" })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedChild && selectedDate && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(3)}
                    className="btn btn-primary"
                    disabled={!selectedChild || !selectedDate}
                  >
                    Continue to Time Slots
                  </button>
                </div>
>>>>>>> 3d1437e (final commit)
              )}
            </div>
          )}

<<<<<<< HEAD
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
              disabled={bookSlotMutation.isLoading || !selectedTherapist || !selectedDate || !selectedTimeSlotId}
              className="btn btn-primary flex-1"
            >
              {bookSlotMutation.isLoading ? 'Booking...' : 'Book Session'}
            </button>
          </div>
        </form>
=======
          {/* Step 3: Select Time Slot */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Available Time Slots
                </h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Back
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{selectedChild?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span>{selectedDate && formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <span>{selectedTherapist?.name}</span>
                  </div>
                </div>
              </div>

              {slotsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading time slots...</p>
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No available time slots for this date.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                  >
                    Choose a different date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`p-3 text-center border rounded-lg transition ${
                        selectedTimeSlot?.id === slot.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                          : "hover:shadow-md hover:border-blue-300"
                      }`}
                    >
                      <div className="font-medium">
                        {formatTime(slot.startTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(slot.endTime)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedTimeSlot && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Session Summary
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedChild?.name} with {selectedTherapist?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedDate && formatDate(selectedDate)} at {formatTime(selectedTimeSlot.startTime)}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Cost: ${selectedTherapist?.baseCostPerSession}
                      </p>
                    </div>
                    <button
                      onClick={handleBookSession}
                      disabled={createBookingMutation.isLoading}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      {createBookingMutation.isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Heart className="h-4 w-4" />
                      )}
                      <span>
                        {createBookingMutation.isLoading ? "Booking..." : "Book Session"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
>>>>>>> 3d1437e (final commit)
      </div>
    </div>
  )
}

export default BookSessionModal
