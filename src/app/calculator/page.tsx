'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import ProgressBar from '@/components/calculator/ProgressBar'
import GoalStep    from '@/components/calculator/GoalStep'
import DataStep    from '@/components/calculator/DataStep'
import ResultStep  from '@/components/calculator/ResultStep'
import { createClient } from '@/lib/supabase/client'
import { calculateBMI } from '@/lib/bmi'
import { getDietPlan }   from '@/lib/diet'
import type { CalculatorState, DietPlan, BMICategory } from '@/types'

const SLIDE = {
  initial:    { opacity: 0, x: 40 },
  animate:    { opacity: 1, x: 0 },
  exit:       { opacity: 0, x: -40 },
  transition: { duration: 0.3, ease: 'easeInOut' as const },
}

export default function CalculatorPage() {
  const router = useRouter()

  const [state, setState] = useState<CalculatorState>({
    step: 1, goal: null, weightKg: null, heightCm: null,
    bmiValue: null, bmiCategory: null, savedId: null,
  })
  const [dietPlan,    setDietPlan]    = useState<DietPlan | null>(null)
  const [calculating, setCalculating] = useState(false)

  function handleGoalSelect(goal: CalculatorState['goal']) {
    setState(prev => ({ ...prev, goal }))
    setTimeout(() => setState(prev => ({ ...prev, step: 2 })), 300)
  }

  async function handleDataSubmit(weightKg: number, heightCm: number) {
    if (!state.goal) return
    setCalculating(true)
    const bmi = calculateBMI(weightKg, heightCm)
    let plan: DietPlan

    try {
      const response = await fetch('/api/diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weightKg,
          heightCm,
          bmiValue: bmi.value,
          bmiCategory: bmi.category,
          goal: state.goal,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor.')
      }

      plan = await response.json()
    } catch (err) {
      console.error('[Diet API Client] Erro ao buscar dieta personalizada:', err)
      // Mostramos uma mensagem informativa apenas se a chave estiver configurada
      // Mas para o usuário comum, apenas garantimos que funciona silenciosamente ou com aviso simples
      plan = getDietPlan(state.goal, bmi.category)
    }

    setState(prev => ({
      ...prev, step: 3, weightKg, heightCm,
      bmiValue: bmi.value, bmiCategory: bmi.category,
    }))
    setDietPlan(plan)
    setCalculating(false)
    autoSave(weightKg, heightCm, bmi.value, bmi.category, state.goal, plan)
  }

  async function autoSave(
    weightKg: number, heightCm: number,
    bmiValue: number, bmiCategory: BMICategory,
    goal: NonNullable<CalculatorState['goal']>, plan: DietPlan,
  ) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: record, error: recErr } = await supabase
      .from('bmi_records')
      .insert({ user_id: user.id, weight_kg: weightKg, height_cm: heightCm, bmi_value: bmiValue, bmi_category: bmiCategory, goal })
      .select('id')
      .single()

    if (recErr || !record) {
      toast.error('Não foi possível salvar o cálculo. Tente novamente.')
      return
    }

    const { error: dietErr } = await supabase
      .from('diet_plans')
      .insert({ bmi_record_id: record.id, meals: plan.meals, tips: plan.tips })

    if (dietErr) {
      toast.error('Cálculo salvo, mas houve erro ao salvar o plano de dieta.')
    } else {
      toast.success('Resultado salvo no seu histórico!')
      setState(prev => ({ ...prev, savedId: record.id }))
    }
  }

  async function handleSave() {
    if (!state.goal || !state.bmiValue || !state.bmiCategory || !dietPlan) return
    await autoSave(state.weightKg!, state.heightCm!, state.bmiValue, state.bmiCategory, state.goal, dietPlan)
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-[800px]">
        <div className="mb-10">
          <ProgressBar currentStep={state.step} />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          <AnimatePresence mode="wait">
            {state.step === 1 && (
              <motion.div key="step1" {...SLIDE}>
                <GoalStep selected={state.goal} onSelect={handleGoalSelect} />
              </motion.div>
            )}
            {state.step === 2 && (
              <motion.div key="step2" {...SLIDE}>
                <DataStep
                  defaultWeight={state.weightKg}
                  defaultHeight={state.heightCm}
                  onSubmit={handleDataSubmit}
                  loading={calculating}
                />
              </motion.div>
            )}
            {state.step === 3 && state.bmiValue && state.bmiCategory && state.goal && dietPlan && (
              <motion.div key="step3" {...SLIDE}>
                <ResultStep
                  bmiValue={state.bmiValue}
                  bmiCategory={state.bmiCategory}
                  goal={state.goal}
                  dietPlan={dietPlan}
                  onSave={handleSave}
                  savedId={state.savedId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {state.step === 2 && (
          <button
            onClick={() => setState(prev => ({ ...prev, step: 1 }))}
            className="mt-4 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors min-h-[44px] px-2"
          >
            ← Voltar ao objetivo
          </button>
        )}
      </div>
    </main>
  )
}
