import type { BMICategory } from '@/types'

export interface BMIResult {
  value:    number
  category: BMICategory
  label:    string
  color:    string
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  const heightM = heightCm / 100
  const raw     = weightKg / (heightM * heightM)
  const value   = Math.round(raw * 100) / 100
  const category = getBMICategory(value)
  return { value, category, label: getBMILabel(category), color: getBMIColor(category) }
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25)   return 'normal'
  if (bmi < 30)   return 'overweight'
  if (bmi < 35)   return 'obese_1'
  if (bmi < 40)   return 'obese_2'
  return 'obese_3'
}

export function getBMILabel(category: BMICategory): string {
  const labels: Record<BMICategory, string> = {
    underweight: 'Abaixo do peso',
    normal:      'Peso normal',
    overweight:  'Sobrepeso',
    obese_1:     'Obesidade Grau I',
    obese_2:     'Obesidade Grau II',
    obese_3:     'Obesidade Grau III',
  }
  return labels[category]
}

export function getBMIColor(category: BMICategory): string {
  const colors: Record<BMICategory, string> = {
    underweight: '#F39C12',
    normal:      '#2ECC71',
    overweight:  '#F39C12',
    obese_1:     '#E74C3C',
    obese_2:     '#E74C3C',
    obese_3:     '#E74C3C',
  }
  return colors[category]
}
