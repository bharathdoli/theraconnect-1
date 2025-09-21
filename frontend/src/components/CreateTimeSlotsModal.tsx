import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { therapistAPI } from '../lib/api'
import { X, Calendar, Clock, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface CreateTimeSlotsModalProps {
  onClose: () => void
  onSuccess: () => void
}

interface TimeSlot {
  startTime: string
  endTime: string
}

interface TimeSlotsFormData {
  date: string
  slots: TimeSlot[]
}

const CreateTimeSlotsModal: React.FC<CreateTimeSlotsModalProps> = ({ onClose, onSuccess }) => {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TimeSlotsFormData>()

  const selectedDate = watch('date')

  const addSlot = () => {
    setSlots([...slots, { startTime: '', endTime: '' }])
  }

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updatedSlots = [...slots]
    updatedSlots[index][field] = value
    setSlots(updatedSlots)
  }

  const createSlotsMutation = useMutation(therapistAPI.createTimeSlots, {
    onSuccess: () => {
      toast.success('Time slots created successfully!')
      onSuccess()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create time slots')
    },
  })

  const onSubmit = (data: TimeSlotsFormData) => {
    if (slots.length === 0) {
      toast.error('Please add at least one time slot')
      return
    }

    // Validate slots
    const validSlots = slots.filter(slot => slot.startTime && slot.endTime)
    if (validSlots.length === 0) {
      toast.error('Please fill in all time slots')
      return
    }

    // Convert times to full datetime strings
    const formattedSlots = validSlots.map(slot => ({
      startTime: `${data.date}T${slot.startTime}:00.000Z`,
      endTime: `${data.date}T${slot.endTime}:00.000Z`,
    }))

    createSlotsMutation.mutate({
      date: data.date,
      slots: formattedSlots,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Time Slots</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Select Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date *
            </label>
            <input
              {...register('date', { required: 'Please select a date' })}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="input"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Time Slots *
              </label>
              <button
                type="button"
                onClick={addSlot}
                className="btn btn-outline btn-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Slot</span>
              </button>
            </div>

            {slots.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No time slots added yet</p>
                <button
                  type="button"
                  onClick={addSlot}
                  className="btn btn-primary btn-sm mt-3"
                >
                  Add Your First Slot
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {slots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                          className="input text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                          className="input text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {selectedDate && slots.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Preview</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Slots:</strong> {slots.filter(s => s.startTime && s.endTime).length}</p>
                <div className="mt-2">
                  {slots.filter(s => s.startTime && s.endTime).map((slot, index) => (
                    <div key={index} className="text-xs">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  ))}
                </div>
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
              disabled={createSlotsMutation.isLoading || slots.length === 0}
              className="btn btn-primary flex-1"
            >
              {createSlotsMutation.isLoading ? 'Creating...' : 'Create Slots'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTimeSlotsModal
