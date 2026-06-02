'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BMIGauge from './BMIGauge'
import type { Goal, BMICategory, DietPlan } from '@/types'
import { getBMILabel, getBMIColor } from '@/lib/bmi'

const PDFDownloadButton = dynamic(
  () => import('@/components/pdf/PDFDownloadButton'),
  { ssr: false }
)

interface ResultStepProps {
  bmiValue:    number
  bmiCategory: BMICategory
  goal:        Goal
  dietPlan:    DietPlan
  onSave:      () => Promise<void>
  savedId:     string | null
}

const MEAL_LABELS = {
  breakfast: 'Café da manhã',
  lunch:     'Almoço',
  snack:     'Lanche',
  dinner:    'Jantar',
} as const

export default function ResultStep({
  bmiValue, bmiCategory, goal, dietPlan, onSave, savedId,
}: ResultStepProps) {
  const [saving, setSaving] = useState(false)
  const color = getBMIColor(bmiCategory)
  const label = getBMILabel(bmiCategory)

  async function handleSave() {
    setSaving(true)
    await onSave()
    setSaving(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-1">Seu resultado</h2>
        <p className="text-[#6B7280]">Confira sua classificação e as recomendações personalizadas.</p>
      </div>

      <BMIGauge value={bmiValue} color={color} label={label} />

      <div>
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#FF6B35]" />
          Plano alimentar sugerido
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(MEAL_LABELS) as Array<keyof typeof MEAL_LABELS>).map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-wide mb-1">
                {MEAL_LABELS[key]}
              </p>
              <p className="text-sm text-[#1A1A2E] leading-relaxed">{dietPlan.meals[key]}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[#FF6B35]/5 rounded-xl p-5 border border-[#FF6B35]/20">
        <h3 className="font-bold text-[#1A1A2E] mb-3">Dicas personalizadas</h3>
        <ul className="space-y-2">
          {dietPlan.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-[#1A1A2E]">
              <span className="text-[#FF6B35] font-bold shrink-0">{i + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <PDFDownloadButton
          bmiValue={bmiValue}
          bmiCategory={bmiCategory}
          goal={goal}
          dietPlan={dietPlan}
        />

        {!savedId ? (
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="outline"
            size="lg"
            className="flex-1 h-14 rounded-xl border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/5 font-bold"
          >
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando…</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Salvar no histórico</>
            )}
          </Button>
        ) : (
          <div className="flex-1 h-14 rounded-xl border-2 border-[#2ECC71] bg-[#2ECC71]/5 flex items-center justify-center text-[#2ECC71] font-bold text-sm">
            ✓ Salvo no histórico
          </div>
        )}
      </div>
    </div>
  )
}
