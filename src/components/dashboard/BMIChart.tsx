'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { getBMILabel, getBMICategory } from '@/lib/bmi'
import type { BMIRecord } from '@/types'

interface Props { records: BMIRecord[] }

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const bmi = payload[0].value as number
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-md text-sm">
      <p className="font-semibold text-[#1A1A2E]">{label}</p>
      <p className="text-[#FF6B35] font-bold">IMC: {bmi.toFixed(1)}</p>
      <p className="text-[#6B7280]">{getBMILabel(getBMICategory(bmi))}</p>
    </div>
  )
}

export default function BMIChart({ records }: Props) {
  const data = [...records]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(r => ({
      date:  new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      value: r.bmi_value,
    }))

  if (data.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-[#6B7280] text-sm">
        Calcule pelo menos 2 vezes para ver a evolução do seu IMC.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <YAxis domain={[10, 45]} tick={{ fontSize: 11, fill: '#6B7280' }} width={32} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={18.5} stroke="#2ECC71" strokeDasharray="4 4" strokeWidth={1} />
        <ReferenceLine y={25}   stroke="#F39C12" strokeDasharray="4 4" strokeWidth={1} />
        <Line
          type="monotone" dataKey="value"
          stroke="#FF6B35" strokeWidth={3}
          dot={{ fill: '#FF6B35', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
