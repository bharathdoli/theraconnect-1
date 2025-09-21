import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { parentAPI } from '../lib/api'
import { X, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface AddChildModalProps {
  onClose: () => void
  onSuccess: () => void
}

interface ChildFormData {
  name: string
  age: number
  address?: string
  condition?: string
  notes?: string
}

const AddChildModal: React.FC<AddChildModalProps> = ({ onClose, onSuccess }) => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChildFormData>()

  const addChildMutation = useMutation(parentAPI.addChild, {
    onSuccess: () => {
      toast.success('Child added successfully!')
      onSuccess()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add child')
    },
  })

  const onSubmit = (data: ChildFormData) => {
    addChildMutation.mutate(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add Child</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Child's Name *
            </label>
            <input
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              type="text"
              className="input"
              placeholder="Enter child's name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              {...register('age', {
                required: 'Age is required',
                valueAsNumber: true,
                min: { value: 1, message: 'Age must be at least 1' },
                max: { value: 18, message: 'Age must be less than 18' },
              })}
              type="number"
              className="input"
              placeholder="Enter child's age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              {...register('address')}
              type="text"
              className="input"
              placeholder="Enter child's address (optional)"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition/Diagnosis
            </label>
            <input
              {...register('condition')}
              type="text"
              className="input"
              placeholder="Enter any medical condition (optional)"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input"
              placeholder="Any additional notes about the child (optional)"
            />
          </div>

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
              disabled={addChildMutation.isLoading}
              className="btn btn-primary flex-1"
            >
              {addChildMutation.isLoading ? 'Adding...' : 'Add Child'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddChildModal
