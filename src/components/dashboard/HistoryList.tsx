import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getBMILabel, getBMIColor } from '@/lib/bmi'
import type { BMIRecord } from '@/types'

interface Props { records: BMIRecord[] }

const GOAL_LABEL: Record<string, string> = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
}

export default function HistoryList({ records }: Props) {
  if (records.length === 0) {
    return (
      <p className="text-[#6B7280] text-sm py-8 text-center">
        Nenhum cálculo salvo ainda.{' '}
        <Link href="/calculator" className="text-indigo-600 font-semibold hover:underline">
          Calcular agora →
        </Link>
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-100" aria-label="Histórico de cálculos">
      {records.map(r => {
        const color = getBMIColor(r.bmi_category)
        const label = getBMILabel(r.bmi_category)
        return (
          <li key={r.id}>
            <Link
              href={`/result/${r.id}`}
              className="flex items-center gap-4 py-4 hover:bg-gray-50 rounded-xl px-2 transition-colors min-h-[44px]"
              aria-label={`Resultado de ${new Date(r.created_at).toLocaleDateString('pt-BR')}: IMC ${r.bmi_value}, ${label}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: color }}
              >
                {r.bmi_value.toFixed(1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1A1A2E] text-sm truncate">{label}</p>
                <p className="text-xs text-[#6B7280]">
                  {GOAL_LABEL[r.goal]} · {r.weight_kg} kg · {r.height_cm} cm
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[#6B7280]">
                  {new Date(r.created_at).toLocaleDateString('pt-BR')}
                </p>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto mt-1" />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
