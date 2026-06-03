import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lightbulb } from 'lucide-react'
import TipIcon from '@/components/ui/TipIcon'
import { createClient } from '@/lib/supabase/server'
import BMIGauge from '@/components/calculator/BMIGauge'
import { getBMIColor, getBMILabel } from '@/lib/bmi'
import type { SavedResult } from '@/types'

function parseFoodItem(raw: string): { name: string; qty: string | null } {
  const text = raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1)
  const trailingQty = text.match(/^(.+?)\s+(\d+(?:[.,]\d+)?\s*(?:g|ml|kg|l|col\.\s*sopa|col\.\s*chá|dose|porção))\s*$/i)
  if (trailingQty) return { name: trailingQty[1].trim(), qty: trailingQty[2].trim() }
  const trailingParen = text.match(/^(.+?)\s+(\(\d+(?:\/\d+)?\))\s*$/)
  if (trailingParen) return { name: trailingParen[1].trim(), qty: trailingParen[2].trim() }
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

function DetailWithBadges({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:[.,]\d+)?(?:\s+(?:e|a|ou)\s+\d+(?:[.,]\d+)?)?\s*(?:calorias|g|ml|kg|minutos?|horas?|dias?|vezes?|sessões?|refeições?|semanas?)?)/gi)
  return (
    <span className="text-xs text-[#6B7280] leading-relaxed">
      {parts.map((part, i) => {
        const isQty = /^\d/.test(part) && part.trim().length > 0
        return isQty ? (
          <span key={i} className="inline-flex items-center mx-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px] leading-none">
            {part.trim()}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

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

interface Props { params: Promise<{ id: string }> }

const GOAL_LABEL: Record<string, string> = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  lunch:     'Almoço',
  snack:     'Lanche',
  dinner:    'Jantar',
}

export default async function ResultDetailPage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: record } = await supabase
    .from('bmi_records')
    .select('*, diet_plans(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!record) notFound()

  const typed = record as SavedResult
  const diet  = typed.diet_plans?.[0]
  const color = getBMIColor(typed.bmi_category)
  const label = getBMILabel(typed.bmi_category)

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-10">
      <div className="w-full max-w-[800px] mx-auto space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1A1A2E] transition-colors min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">
              {new Date(typed.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
            </p>
            <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Resultado do IMC</h1>
            <p className="text-[#6B7280] text-sm mt-1">
              Objetivo: <strong>{GOAL_LABEL[typed.goal]}</strong> · {typed.weight_kg} kg · {typed.height_cm} cm
            </p>
          </div>

          <BMIGauge value={typed.bmi_value} color={color} label={label} />

          {diet && (
            <>
              <div>
                <h2 className="text-lg font-bold text-[#1A1A2E] mb-4">Plano alimentar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(MEAL_LABELS).map(key => {
                    const mealText = (diet.meals as unknown as Record<string, string>)[key]
                    return (
                      <div key={key} className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">
                          {MEAL_LABELS[key]}
                        </p>
                        <ul className="space-y-0">
                          {mealText.split(' + ').map((item, idx) => (
                            <MealItem key={idx} raw={item} />
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Dicas
                </h3>
                <ul className="space-y-2">
                  {(diet.tips as string[]).map((tip, i) => (
                    <TipCard key={i} tip={tip} />
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
