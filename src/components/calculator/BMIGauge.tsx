'use client'

import { motion } from 'framer-motion'

interface BMIGaugeProps {
  value: number
  color: string
  label: string
}

const CX            = 100
const CY            = 110
const RADIUS        = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_DEGREES   = 240
const ARC_LENGTH    = (ARC_DEGREES / 360) * CIRCUMFERENCE
const BMI_MIN       = 10
const BMI_MAX       = 45

function toProgress(bmi: number): number {
  return Math.max(0, Math.min(1, (bmi - BMI_MIN) / (BMI_MAX - BMI_MIN)))
}

export default function BMIGauge({ value, color, label }: BMIGaugeProps) {
  const progress     = toProgress(value)
  const filledLength = progress * ARC_LENGTH

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 200 210"
        className="w-full max-w-[220px]"
        role="img"
        aria-label={`IMC ${value.toFixed(1)}: ${label}`}
      >
        <circle
          cx={CX} cy={CY} r={RADIUS}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="16"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
          strokeLinecap="round"
          transform={`rotate(150 ${CX} ${CY})`}
        />
        <motion.circle
          cx={CX} cy={CY} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          transform={`rotate(150 ${CX} ${CY})`}
          initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
          animate={{ strokeDasharray: `${filledLength} ${CIRCUMFERENCE}` }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 60, damping: 12 }}
        />
        <text
          x={CX} y={CY - 6}
          textAnchor="middle"
          fontSize="32" fontWeight="800"
          fill={color} fontFamily="Inter, sans-serif"
        >
          {value.toFixed(1)}
        </text>
        <text
          x={CX} y={CY + 20}
          textAnchor="middle"
          fontSize="13" fill="#6B7280"
          fontFamily="Inter, sans-serif"
        >
          IMC
        </text>
      </svg>

      <span
        className="px-4 py-1 rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    </div>
  )
}
