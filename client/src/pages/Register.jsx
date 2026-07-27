"use client"
import { useRef } from "react";

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "@/store/useAuth"
import {
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  Clock,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Circle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

function Register() {

  const fileInputRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1)
  const [image, setImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  // Time picker state
  const [timeData, setTimeData] = useState({
    hours: 9,
    minutes: 0,
    ampm: 'AM'
  })

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    profileImage: null,
    checkInLimit: "",
    role: "",
  })

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  // Format time for display
  const formatTime12Hour = (hours, minutes, ampm) => {
    const displayHours = hours === 0 ? 12 : hours
    const paddedMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${paddedMinutes} ${ampm}`
  }

  // Format time for backend (24-hour format)
  const formatTime24Hour = (hours, minutes, ampm) => {
    let hour24 = hours
    if (ampm === 'PM' && hours !== 12) hour24 += 12
    if (ampm === 'AM' && hours === 12) hour24 = 0
    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // Update time and sync with form data
  const updateTime = (newTimeData) => {
    setTimeData(newTimeData)
    const time24 = formatTime24Hour(newTimeData.hours, newTimeData.minutes, newTimeData.ampm)
    setData({ ...data, checkInLimit: time24 })
  }

  const incrementValue = (type) => {
    const newTimeData = { ...timeData }
    switch (type) {
      case 'hours':
        newTimeData.hours = newTimeData.hours === 12 ? 1 : newTimeData.hours + 1
        break
      case 'minutes':
        newTimeData.minutes = newTimeData.minutes === 59 ? 0 : newTimeData.minutes + 1
        break
      case 'ampm':
        newTimeData.ampm = newTimeData.ampm === 'AM' ? 'PM' : 'AM'
        break
    }
    updateTime(newTimeData)
  }

  const decrementValue = (type) => {
    const newTimeData = { ...timeData }
    switch (type) {
      case 'hours':
        newTimeData.hours = newTimeData.hours === 1 ? 12 : newTimeData.hours - 1
        break
      case 'minutes':
        newTimeData.minutes = newTimeData.minutes === 0 ? 59 : newTimeData.minutes - 1
        break
      case 'ampm':
        newTimeData.ampm = newTimeData.ampm === 'AM' ? 'PM' : 'AM'
        break
    }
    updateTime(newTimeData)
  }

  const { saveToken } = useAuth()
  const navigate = useNavigate()

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInput = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Step 1: Upload image to Cloudinary
      const formData = new FormData()
      formData.append("file", image)
      formData.append("upload_preset", "rawaha")
      formData.append("cloud_name", "dtx7n84vi")

      const res = await fetch("https://api.cloudinary.com/v1_1/dtx7n84vi/image/upload", {
        method: "POST",
        body: formData,
      })

      const cloudData = await res.json()
      console.log(cloudData);

      // Step 2: Send form to backend
      const finalData = {
        ...data,
        profileImage: cloudData.secure_url,
      }

      const response = await fetch("https://mern-projects-oj9w.onrender.com/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Registration successful")
        navigate("/login")
        saveToken(result.token)
      } else {
        toast.error(result.extraDetails?.message || result.message || "Registration failed")
      }
    } catch (error) {
      console.log(error)
      toast.error("An error occurred during registration")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = data.name && data.email && data.password && data.phoneNumber
  const isStep2Valid = data.role && data.checkInLimit && image

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-[#1a1a1a] rounded-3xl shadow-[0_0_60px_rgba(0,212,170,0.1)] border border-[#2a2a2a] overflow-hidden">

        <div className="bg-gradient-to-r from-[#1e1e1e] to-[#252525] p-8 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-2 h-16 bg-gradient-to-b from-[#00d4aa] to-[#00a884] rounded-full mr-6"></div>
              <div>
                <h1 className="text-3xl font-bold text-white">Employee Registration</h1>
                <p className="text-gray-400 text-lg mt-2">Create a new employee account</p>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {currentStep >= 1 ? (
                  <CheckCircle className="w-8 h-8 text-[#00d4aa]" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-500" />
                )}
                <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? "text-[#00d4aa]" : "text-gray-500"}`}>
                  Personal Info
                </span>
              </div>

              <div className="w-12 h-0.5 bg-gray-600"></div>

              <div className="flex items-center">
                {currentStep >= 2 ? (
                  <CheckCircle className="w-8 h-8 text-[#00d4aa]" />
                ) : (
                  <Circle className="w-8 h-8 text-gray-500" />
                )}
                <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? "text-[#00d4aa]" : "text-gray-500"}`}>
                  Work Details
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleInput}>
          <div className="p-8">
            {currentStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">Personal Information</h2>
                    <p className="text-gray-400">Please provide your basic details</p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                        <User size={20} />
                      </div>
                      <input
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>
                  </div>


                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                        <Mail size={20} />
                      </div>
                      <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={data.email}
                        required
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>
                  </div>
                </div>


                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">Security & Contact</h2>
                    <p className="text-gray-400">Set up your login credentials</p>
                  </div>


                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                        <Phone size={20} />
                      </div>
                      <input
                        name="phoneNumber"
                        type="tel"
                        placeholder="03XX-XXXXXXX"
                        value={data.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>
                  </div>


                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                        <Lock size={20} />
                      </div>
                      <input
                        name="password"
                        type="password"
                        placeholder="Create a secure password"
                        value={data.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}


            {currentStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">Work Information</h2>
                    <p className="text-gray-400">Configure your work profile</p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Role *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                        <Briefcase size={20} />
                      </div>
                      <input
                        name="role"
                        type="text"
                        placeholder="e.g., Manager, Developer, Designer"
                        value={data.role}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-200 text-lg"
                      />
                    </div>
                  </div>

                  {/* Time Picker */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Check-In Time *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 z-10">
                        <Clock size={20} />
                      </div>
                      <div
                        onClick={() => setShowTimePicker(!showTimePicker)}
                        className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent transition-all duration-200 text-lg cursor-pointer flex items-center justify-between"
                      >
                        <span className={data.checkInLimit ? 'text-white' : 'text-gray-500'}>
                          {data.checkInLimit ? formatTime12Hour(timeData.hours, timeData.minutes, timeData.ampm) : 'Select check-in time'}
                        </span>
                        <div className={`w-5 h-5 transition-transform duration-200 ${showTimePicker ? 'rotate-180' : ''}`}>⌄</div>
                      </div>

                      {showTimePicker && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-[#252525] border border-[#3a3a3a] rounded-xl p-4 shadow-2xl z-20">
    
    {/* Done Button Top */}
    <div className="flex justify-end mb-2">
      <button
        type="button"
        onClick={() => setShowTimePicker(false)}
        className="px-3 py-1 bg-[#00d4aa] text-white rounded-md hover:bg-[#00c7a0] transition-all duration-200 font-medium text-xs"
      >
        Done
      </button>
    </div>

    {/* Time Controls */}
    <div className="flex items-center justify-center space-x-4">
      {/* Hours */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => incrementValue('hours')}
          className="p-1 text-[#00d4aa] hover:bg-[#00d4aa] hover:text-white rounded"
        >
          <ChevronUp size={16} />
        </button>
        <div className="text-lg font-bold text-white py-1">{timeData.hours.toString().padStart(2, '0')}</div>
        <button
          type="button"
          onClick={() => decrementValue('hours')}
          className="p-1 text-[#00d4aa] hover:bg-[#00d4aa] hover:text-white rounded"
        >
          <ChevronDown size={16} />
        </button>
        <span className="text-gray-400 text-xs mt-1">Hours</span>
      </div>

      <div className="text-lg font-bold text-gray-400">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => incrementValue('minutes')}
          className="p-1 text-[#00d4aa] hover:bg-[#00d4aa] hover:text-white rounded"
        >
          <ChevronUp size={16} />
        </button>
        <div className="text-lg font-bold text-white py-1">{timeData.minutes.toString().padStart(2, '0')}</div>
        <button
          type="button"
          onClick={() => decrementValue('minutes')}
          className="p-1 text-[#00d4aa] hover:bg-[#00d4aa] hover:text-white rounded"
        >
          <ChevronDown size={16} />
        </button>
        <span className="text-gray-400 text-xs mt-1">Minutes</span>
      </div>

      {/* AM/PM */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => incrementValue('ampm')}
          className="p-1 text-[#00d4aa] hover:bg-[#00d4aa] hover:text-white rounded"
        >
          <ChevronUp size={16} />
        </button>
        <div className="text-lg font-bold text-white py-1">{timeData.ampm}</div>
        <button
          type="button"
          onClick={() => decrementValue('ampm')}
          className="p-1 text-[#00d4aa] hover:bg-[#00d4aa] hover:text-white rounded"
        >
          <ChevronDown size={16} />
        </button>
        <span className="text-gray-400 text-xs mt-1">Period</span>
      </div>
    </div>
  </div>
)}
                    </div>
                  </div>
                </div>


                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">Profile Setup</h2>
                    <p className="text-gray-400">Upload your profile picture</p>
                  </div>


                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Profile Picture *</label>
                    <div className="relative">
                      <label className="flex flex-col items-center justify-center w-full h-48 bg-[#252525] border-2 border-dashed border-[#3a3a3a] rounded-xl cursor-pointer hover:bg-[#2a2a2a] hover:border-[#00d4aa] transition-all duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload size={32} className="mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                          {image && (
                            <p className="mt-2 text-sm text-[#00d4aa] font-medium">✓ {image.name || "File selected"}</p>
                          )}
                        </div>
                        <input
                          name="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files[0])}
                          required
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}


            <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#2a2a2a]">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-3 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="flex items-center px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-[#00d4aa] to-[#00b392] hover:from-[#00c7a0] hover:to-[#00a889] focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    Next Step
                    <ArrowRight size={20} className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStep2Valid}
                    className="flex items-center px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-[#00d4aa] to-[#00b392] hover:from-[#00c7a0] hover:to-[#00a889] focus:outline-none focus:ring-2 focus:ring-[#00d4aa] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-[#1e1e1e] p-6 border-t border-[#2a2a2a] text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-[#00d4aa] hover:underline transition-all font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register