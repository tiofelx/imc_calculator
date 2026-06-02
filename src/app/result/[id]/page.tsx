import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import BMIGauge from '@/components/calculator/BMIGauge'
import { getBMIColor, getBMILabel } from '@/lib/bmi'
import type { SavedResult } from '@/types'

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
                  {Object.keys(MEAL_LABELS).map(key => (
                    <div key={key} className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-bold text-[#FF6B35] uppercase tracking-wide mb-1">
                        {MEAL_LABELS[key]}
                      </p>
                      <p className="text-sm text-[#1A1A2E]">{(diet.meals as unknown as Record<string, string>)[key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FF6B35]/5 rounded-xl p-5 border border-[#FF6B35]/20">
                <h3 className="font-bold text-[#1A1A2E] mb-3">Dicas</h3>
                <ul className="space-y-2">
                  {(diet.tips as string[]).map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#1A1A2E]">
                      <span className="text-[#FF6B35] font-bold shrink-0">{i + 1}.</span>
                      <span>{tip}</span>
                    </li>
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
