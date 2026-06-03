'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Dumbbell } from 'lucide-react'
import type { Goal } from '@/types'

interface GoalStepProps {
  selected: Goal | null
  onSelect: (goal: Goal) => void
}

const GOALS = [
  {
    value:  'lose_weight' as Goal,
    icon:   TrendingDown,
    title:  'Perder Peso',
    desc:   'Reduzir gordura corporal com dieta balanceada e déficit calórico controlado.',
    color:  'text-[#F39C12]',
    border: 'border-[#F39C12]',
    bg:     'bg-[#F39C12]/5',
  },
  {
    value:  'gain_muscle' as Goal,
    icon:   Dumbbell,
    title:  'Ganhar Massa',
    desc:   'Aumentar massa muscular com superávit calórico e alta ingestão proteica.',
    color:  'text-[#2ECC71]',
    border: 'border-[#2ECC71]',
    bg:     'bg-[#2ECC71]/5',
  },
]

export default function GoalStep({ selected, onSelect }: GoalStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">Qual é o seu objetivo?</h2>
      <p className="text-[#6B7280] mb-8">
        Escolha o foco da sua jornada — o plano de dieta será personalizado para você.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOALS.map(({ value, icon: Icon, title, desc, color, border, bg }) => {
          const isSelected = selected === value
          return (
            <motion.button
              key={value}
              onClick={() => onSelect(value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={[
                'text-left rounded-2xl border-2 p-6 cursor-pointer transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2',
                'min-h-[44px]',
                isSelected
                  ? `${border} ${bg} shadow-md`
                  : 'border-gray-200 hover:border-gray-300 bg-white',
              ].join(' ')}
              aria-pressed={isSelected}
              aria-label={`Objetivo: ${title}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isSelected ? bg : 'bg-gray-100'}`}>
                <Icon className={`h-6 w-6 ${isSelected ? color : 'text-gray-400'}`} />
              </div>
              <h3 className="font-bold text-lg mb-1 text-[#1A1A2E]">{title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
