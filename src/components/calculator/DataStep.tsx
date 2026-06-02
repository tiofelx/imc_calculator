'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  weightKg: z
    .number({ error: 'Informe o peso' })
    .min(20, 'Peso mínimo: 20 kg')
    .max(300, 'Peso máximo: 300 kg'),
  heightCm: z
    .number({ error: 'Informe a altura' })
    .min(50, 'Altura mínima: 50 cm')
    .max(250, 'Altura máxima: 250 cm'),
})

type FormData = z.infer<typeof schema>

interface DataStepProps {
  defaultWeight?: number | null
  defaultHeight?: number | null
  onSubmit: (weightKg: number, heightCm: number) => void
  loading?: boolean
}

export default function DataStep({ defaultWeight, defaultHeight, onSubmit, loading }: DataStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      weightKg: defaultWeight ?? undefined,
      heightCm: defaultHeight ?? undefined,
    },
  })

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">Informe seus dados</h2>
      <p className="text-[#6B7280] mb-8">
        Usaremos peso e altura para calcular seu IMC com precisão.
      </p>

      <form onSubmit={handleSubmit(d => onSubmit(d.weightKg, d.heightCm))} noValidate className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="weightKg" className="font-semibold text-[#1A1A2E]">Peso (kg)</Label>
          <Input
            id="weightKg"
            type="number"
            step="0.1"
            placeholder="ex: 70.5"
            className="h-14 text-lg rounded-xl"
            aria-describedby={errors.weightKg ? 'weightKg-error' : undefined}
            aria-invalid={!!errors.weightKg}
            {...register('weightKg', { valueAsNumber: true })}
          />
          {errors.weightKg && (
            <p id="weightKg-error" role="alert" className="text-sm text-[#E74C3C] font-medium">
              {errors.weightKg.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="heightCm" className="font-semibold text-[#1A1A2E]">Altura (cm)</Label>
          <Input
            id="heightCm"
            type="number"
            step="0.5"
            placeholder="ex: 175"
            className="h-14 text-lg rounded-xl"
            aria-describedby={errors.heightCm ? 'heightCm-error' : undefined}
            aria-invalid={!!errors.heightCm}
            {...register('heightCm', { valueAsNumber: true })}
          />
          {errors.heightCm && (
            <p id="heightCm-error" role="alert" className="text-sm text-[#E74C3C] font-medium">
              {errors.heightCm.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full h-14 text-base font-bold bg-[#FF6B35] hover:bg-[#FF8E53] rounded-xl"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Calculando…</>
          ) : (
            'Calcular meu IMC'
          )}
        </Button>
      </form>
    </div>
  )
}
