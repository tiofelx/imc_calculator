import type { Goal, BMICategory, DietPlan } from '@/types'

interface PDFDownloadButtonProps {
  bmiValue:    number
  bmiCategory: BMICategory
  goal:        Goal
  dietPlan:    DietPlan
}

export default function PDFDownloadButton(_props: PDFDownloadButtonProps) {
  return null
}
