import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, UserPlus, Users, Stethoscope, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import ThemeToggle from '../components/ThemeToggle'

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name: string
  phone: string
  specialization?: string
  experience?: number
  baseCostPerSession?: number
}

interface RegisterTherapistData {
  email: string
  password: string
  name: string
  phone: string
  specialization: string
  experience: number
  baseCostPerSession: number
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<'parent' | 'therapist' | 'admin'>('parent')
  const { registerParent, registerTherapist, registerAdmin } = useAuth()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const { confirmPassword, ...registerData } = data
      
      if (userType === 'parent') {
        await registerParent(registerData)
      } else if (userType === 'therapist') {
        await registerTherapist(registerData as RegisterTherapistData)
      } else {
        await registerAdmin(registerData)
      }
      
      toast.success('Registration successful!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <UserPlus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Join TheraConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Create your account to get started
          </p>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Account Type</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setUserType('parent')}
              className={`btn ${userType === 'parent' ? 'btn-primary' : 'btn-outline'} btn-sm flex flex-col items-center py-3`}
            >
              <Users className="h-5 w-5 mb-1" />
              <span className="text-xs">Parent</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('therapist')}
              className={`btn ${userType === 'therapist' ? 'btn-primary' : 'btn-outline'} btn-sm flex flex-col items-center py-3`}
            >
              <Stethoscope className="h-5 w-5 mb-1" />
              <span className="text-xs">Therapist</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`btn ${userType === 'admin' ? 'btn-primary' : 'btn-outline'} btn-sm flex flex-col items-center py-3`}
            >
              <Shield className="h-5 w-5 mb-1" />
              <span className="text-xs">Admin</span>
            </button>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                type="text"
                className="input mt-1"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="input mt-1"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: { value: 10, message: 'Phone number must be at least 10 characters' },
                })}
                type="tel"
                className="input mt-1"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {userType === 'therapist' && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    {...register('specialization', {
                      required: 'Specialization is required',
                      minLength: { value: 3, message: 'Specialization must be at least 3 characters' },
                    })}
                    type="text"
                    className="input mt-1"
                    placeholder="e.g., Child Psychology, Speech Therapy"
                  />
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    {...register('experience', {
                      required: 'Experience is required',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Experience must be at least 1 year' },
                    })}
                    type="number"
                    className="input mt-1"
                    placeholder="Enter years of experience"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="baseCostPerSession" className="block text-sm font-medium text-gray-700">
                    Base Cost Per Session ($)
                  </label>
                  <input
                    {...register('baseCostPerSession', {
                      required: 'Base cost is required',
                      valueAsNumber: true,
                      min: { value: 0.01, message: 'Cost must be greater than 0' },
                    })}
                    type="number"
                    step="0.01"
                    className="input mt-1"
                    placeholder="Enter base cost per session"
                  />
                  {errors.baseCostPerSession && (
                    <p className="mt-1 text-sm text-red-600">{errors.baseCostPerSession.message}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-full"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
