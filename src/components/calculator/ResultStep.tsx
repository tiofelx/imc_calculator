'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Lightbulb, Loader2, Save } from 'lucide-react'
import TipIcon from '@/components/ui/TipIcon'
import { Button } from '@/components/ui/button'
import BMIGauge from './BMIGauge'
import type { Goal, BMICategory, DietPlan } from '@/types'
import { getBMILabel, getBMIColor } from '@/lib/bmi'

/** Extrai a quantidade do final da string de alimento e retorna { name, qty }.
 *  Ex: "Carne bovina magra 200 g" → { name: "Carne bovina magra", qty: "200 g" }
 *  Ex: "Ovos mexidos (3)" → { name: "Ovos mexidos", qty: "(3)" }
 *  Ex: "2 Ovos" → { name: "Ovos", qty: "2" }
 */
function parseFoodItem(raw: string): { name: string; qty: string | null } {
  const text = raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1)

  // quantidade no final: "200 g", "180 g", "30 g", etc.
  const trailingQty = text.match(/^(.+?)\s+(\d+(?:[.,]\d+)?\s*(?:g|ml|kg|l|col\.\s*sopa|col\.\s*chá|dose|porção))\s*$/i)
  if (trailingQty) return { name: trailingQty[1].trim(), qty: trailingQty[2].trim() }

  // quantidade no final entre parênteses: "(3)", "(2)", "(1/2)"
  const trailingParen = text.match(/^(.+?)\s+(\(\d+(?:\/\d+)?\))\s*$/)
  if (trailingParen) return { name: trailingParen[1].trim(), qty: trailingParen[2].trim() }

  // quantidade no início: "2 Ovos", "1/2 Abacate"
  const leadingQty = text.match(/^(\d+(?:\/\d+)?)\s+(.+)$/)
  if (leadingQty) return { name: leadingQty[2].trim(), qty: leadingQty[1].trim() }

  return { name: text, qty: null }
}

function MealItem({ raw }: { raw: string }) {
  const { name, qty } = parseFoodItem(raw)
  return (
    <li className="flex items-center justify-between gap-2 py-1 border-b border-gray-100 last:border-0">
      <span className="flex items-center gap-1.5 text-sm text-[#1A1A2E]">
        <span className="text-indigo-400 shrink-0">•</span>
        {name}
      </span>
      {qty && (
        <span className="shrink-0 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5">
          {qty}
        </span>
      )}
    </li>
  )
}

/**
 * Quebra o detalhe da dica em partes, envolvendo números e unidades em badges.
 * Ex: "Coma 300 calorias a mais por dia" → ["Coma ", <badge>300 calorias</badge>, " a mais por dia"]
 */
function DetailWithBadges({ text }: { text: string }) {
  // Detecta padrões como "300 calorias", "1,8 e 2,2 g", "150 minutos", "7 a 9 horas", "35 ml", "0,5 kg"
  const parts = text.split(/(\d+(?:[.,]\d+)?(?:\s+(?:e|a|ou)\s+\d+(?:[.,]\d+)?)?\s*(?:calorias|g|ml|kg|minutos?|horas?|dias?|vezes?|sessões?|refeições?|semanas?)?)/gi)
  return (
    <span className="text-xs text-[#6B7280] leading-relaxed">
      {parts.map((part, i) => {
        const isQty = /^\d/.test(part) && part.trim().length > 0
        return isQty ? (
          <span
            key={i}
            className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px] leading-none"
          >
            {part.trim()}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

/** Renderiza uma dica no formato "emoji|Título|Detalhe". */
function TipCard({ tip }: { tip: string }) {
  const parts  = tip.split('|')
  const icon   = parts.length >= 3 ? parts[0].trim() : '💡'
  const title  = parts.length >= 3 ? parts[1].trim() : parts.length === 2 ? parts[0].trim() : tip
  const detail = parts.length >= 3 ? parts[2].trim() : parts.length === 2 ? parts[1].trim() : null

  return (
    <li className="flex gap-3 items-start bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
      <span className="shrink-0 w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
        <TipIcon emoji={icon} className="w-5 h-5" />
      </span>
      <span className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-[#1A1A2E] leading-snug">{title}</span>
        {detail && <DetailWithBadges text={detail} />}
      </span>
    </li>
  )
}


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
  const router = useRouter()
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
          <BookOpen className="h-5 w-5 text-indigo-600" />
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
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">
                {MEAL_LABELS[key]}
              </p>
              <ul className="space-y-0">
                {dietPlan.meals[key].split(' + ').map((item, idx) => (
                  <MealItem key={idx} raw={item} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Dicas personalizadas
        </h3>
        <ul className="space-y-2">
          {dietPlan.tips.map((tip, i) => (
            <TipCard key={i} tip={tip} />
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
            className="flex-1 h-14 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold"
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

      <div className="flex justify-center pt-2">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="ghost"
          className="text-[#6B7280] hover:text-[#1A1A2E] gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao dashboard
        </Button>
      </div>
    </div>
  )
}
