'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import DietPDFTemplate from './DietPDFTemplate'
import { toast } from 'sonner'
import type { Goal, BMICategory, DietPlan } from '@/types'

interface Props {
  bmiValue:    number
  bmiCategory: BMICategory
  goal:        Goal
  dietPlan:    DietPlan
  userName?:   string
}

export default function PDFDownloadButton({ bmiValue, bmiCategory, goal, dietPlan, userName }: Props) {
  const [generating, setGenerating] = useState(false)

  async function handleDownload() {
    setGenerating(true)
    try {
      const blob = await pdf(
        <DietPDFTemplate
          bmiValue={bmiValue}
          bmiCategory={bmiCategory}
          goal={goal}
          dietPlan={dietPlan}
          userName={userName}
        />
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href    = url
      a.download = `dieta-imc-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Não foi possível gerar o PDF. Tente novamente.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={generating}
      size="lg"
      className="flex-1 h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white"
    >
      {generating ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando PDF…</>
      ) : (
        <><FileDown className="mr-2 h-4 w-4" />Baixar Dieta em PDF</>
      )}
    </Button>
  )
}
