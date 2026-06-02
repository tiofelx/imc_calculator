'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Orange Gradient Background */}
      <div className="flex-1 relative bg-gradient-to-br from-[#FF6B35] via-[#FF8E53] to-orange-600">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold text-white">IMC Calculator</h2>
          <Link href="/login">
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
              Sign In
            </Button>
          </Link>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Calculate Your BMI
            <br />
            <span className="text-orange-100">Get Personalized Diet Plans</span>
          </h1>
          <p className="text-xl text-orange-50 mb-12 max-w-2xl">
            Discover your Body Mass Index and receive tailored nutrition recommendations based on your health profile. Start your wellness journey today.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Bottom Feature Cards */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12 max-w-7xl mx-auto w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white border border-white/20 hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Accurate Calculations</h3>
            <p className="text-orange-50">
              Get precise BMI metrics with health-based categories
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white border border-white/20 hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Custom Diet Plans</h3>
            <p className="text-orange-50">
              Receive personalized nutrition recommendations for your body
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white border border-white/20 hover:bg-white/20 transition">
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-orange-50">
              Monitor your health metrics and improvements over time
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2026 IMC Calculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
