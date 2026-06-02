interface ProgressBarProps {
  currentStep: 1 | 2 | 3
}

const STEPS = ['Objetivo', 'Dados', 'Resultado']

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const pct = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)

  return (
    <div className="w-full" aria-label="Progresso do cálculo">
      <div className="flex justify-between mb-2">
        {STEPS.map((label, i) => {
          const step  = (i + 1) as 1 | 2 | 3
          const active = step === currentStep
          const done   = step < currentStep
          return (
            <span
              key={label}
              className={[
                'text-xs font-semibold',
                active ? 'text-[#FF6B35]' : done ? 'text-[#2ECC71]' : 'text-[#6B7280]',
              ].join(' ')}
            >
              {label}
            </span>
          )
        })}
      </div>
      <div
        className="h-2 w-full rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-2 rounded-full bg-[#FF6B35] transition-all duration-300 ease-in-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
