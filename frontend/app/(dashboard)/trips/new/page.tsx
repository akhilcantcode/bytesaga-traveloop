'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCreateTrip } from '@/hooks/useTrips'
import { Button } from '@/components/ui/button'
import {
  PlaneTakeoff, Calendar, ArrowLeft, Globe2, MapPin,
  Compass, Sparkles, ArrowRight, Lock, Globe
} from 'lucide-react'
import Link from 'next/link'

const destinationImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop',
]

const steps = ['Trip Details', 'Dates', 'Visibility']

export default function CreateTripPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledCity = searchParams.get('city') || ''

  const [step, setStep] = useState(0)
  const [title, setTitle] = useState(prefilledCity ? `My trip to ${prefilledCity}` : '')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [bgImage, setBgImage] = useState(destinationImages[0])

  const createTrip = useCreateTrip()

  useEffect(() => {
    // Rotate background images
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % destinationImages.length
      setBgImage(destinationImages[i])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async () => {
    try {
      await createTrip.mutateAsync({
        title,
        description: description || null,
        start_date: startDate,
        end_date: endDate,
        is_public: isPublic,
      })
      router.push('/trips')
    } catch (error) {
      console.error('Failed to create trip', error)
    }
  }

  const canProceed = () => {
    if (step === 0) return title.trim().length > 0
    if (step === 1) return startDate && endDate && endDate >= startDate
    return true
  }

  return (
    <div className="min-h-screen flex items-stretch rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/40">
      {/* Left: Ambient Background Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-10 overflow-hidden">
        {/* Rotating Background */}
        <div
          className="absolute inset-0 transition-all duration-[3000ms] ease-in-out bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-indigo-900/70 to-blue-900/80 backdrop-blur-[2px]" />

        {/* Top logo */}
        <div className="relative z-10 flex items-center gap-2 text-white font-bold text-xl">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <PlaneTakeoff className="w-5 h-5" />
          </div>
          Traveloop
        </div>

        {/* Center text */}
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            Start your next adventure
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight drop-shadow-md">
            Every great journey<br />starts with a plan.
          </h2>
          <p className="text-sky-100/80 text-lg leading-relaxed max-w-xs">
            Build your itinerary, track your budget, and share your adventures — all in one place.
          </p>
        </div>

        {/* Bottom badges */}
        <div className="relative z-10 flex flex-wrap gap-3">
          {['Itinerary Builder', 'Budget Tracker', 'Packing Lists', 'Travel Notes'].map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white/80 text-xs font-semibold border border-white/20">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 bg-white/70 backdrop-blur-xl flex flex-col justify-between p-8 md:p-12 lg:p-14">
        {/* Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sky-700 font-medium hover:text-sky-900 transition-colors text-sm mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  i === step
                    ? 'bg-sky-600 text-white shadow-md'
                    : i < step
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <span>{i + 1}</span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px w-6 transition-colors ${i < step ? 'bg-sky-400' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col justify-center">

          {/* ── Step 0: Trip Details ─────────────────────── */}
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Name your adventure</h1>
                <p className="text-gray-500 mt-2">Give your trip a title and a short description.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-sky-500" />
                    Trip Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                    <input
                      id="title"
                      type="text"
                      placeholder='e.g. "Summer in Japan"'
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    Description <span className="text-gray-400 font-normal text-xs ml-1">Optional</span>
                  </label>
                  <textarea
                    placeholder="What are you most excited about? Where are you going? Any highlights..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all shadow-sm resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Dates ─────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">When are you going?</h1>
                <p className="text-gray-500 mt-2">Set your departure and return dates to plan the timeline.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    Departure Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="start_date"
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Return Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="end_date"
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all shadow-sm"
                  />
                </div>
              </div>

              {startDate && endDate && endDate >= startDate && (
                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-2xl border border-sky-100 animate-in fade-in duration-300">
                  <Calendar className="w-5 h-5 text-sky-500 flex-shrink-0" />
                  <p className="text-sky-800 text-sm font-medium">
                    Your trip is{' '}
                    <span className="font-bold text-sky-600">
                      {Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                    </span>{' '}
                    long ✈️
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Visibility ────────────────────────── */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Share or keep private?</h1>
                <p className="text-gray-500 mt-2">Choose who can see your itinerary in the Explore section.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 group ${
                    !isPublic
                      ? 'border-sky-500 bg-sky-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50/50'
                  }`}
                >
                  {!isPublic && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">Selected</span>
                  )}
                  <Lock className={`w-8 h-8 mb-3 transition-colors ${!isPublic ? 'text-sky-600' : 'text-gray-400 group-hover:text-sky-400'}`} />
                  <h3 className="font-bold text-gray-900 mb-1">Private</h3>
                  <p className="text-xs text-gray-500">Only you can see this trip. Great for personal planning.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 group ${
                    isPublic
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  {isPublic && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">Selected</span>
                  )}
                  <Globe className={`w-8 h-8 mb-3 transition-colors ${isPublic ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-400'}`} />
                  <h3 className="font-bold text-gray-900 mb-1">Public</h3>
                  <p className="text-xs text-gray-500">Share your itinerary with the community for inspiration.</p>
                </button>
              </div>

              {/* Trip summary */}
              <div className="p-5 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl border border-sky-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Trip Summary</h4>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Compass className="w-4 h-4 text-sky-500" />
                    <span className="font-semibold">{title}</span>
                  </div>
                  {description && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span className="line-clamp-1">{description}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <span>{startDate} → {endDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          <Button
            variant="ghost"
            type="button"
            onClick={() => step === 0 ? router.back() : setStep(s => s - 1)}
            className="text-gray-500 hover:text-gray-900 rounded-xl px-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>

          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-8 py-5 font-bold text-sm shadow-lg hover:shadow-sky-200 transition-all gap-2 disabled:opacity-40"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createTrip.isPending}
              className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl px-8 py-5 font-bold text-sm shadow-lg hover:shadow-indigo-200 transition-all gap-2"
            >
              <PlaneTakeoff className="w-4 h-4" />
              {createTrip.isPending ? 'Creating...' : 'Launch my Trip!'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
