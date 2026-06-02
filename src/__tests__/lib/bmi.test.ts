import { calculateBMI, getBMILabel, getBMIColor } from '@/lib/bmi'

describe('calculateBMI', () => {
  it('calculates correctly for normal weight', () => {
    const result = calculateBMI(70, 175)
    expect(result.value).toBe(22.86)
    expect(result.category).toBe('normal')
    expect(result.label).toBe('Peso normal')
  })
  it('classifies underweight', () => {
    expect(calculateBMI(45, 170).category).toBe('underweight')
  })
  it('classifies normal at 18.5 boundary', () => {
    expect(calculateBMI(56.66, 175).category).toBe('normal')
  })
  it('classifies overweight', () => {
    expect(calculateBMI(85, 170).category).toBe('overweight')
  })
  it('classifies obese_1', () => {
    expect(calculateBMI(87, 170).category).toBe('obese_1')
  })
  it('classifies obese_2', () => {
    expect(calculateBMI(115, 170).category).toBe('obese_2')
  })
  it('classifies obese_3 at 40 or above', () => {
    expect(calculateBMI(130, 170).category).toBe('obese_3')
  })
})

describe('getBMILabel', () => {
  it('returns Portuguese label for each category', () => {
    expect(getBMILabel('underweight')).toBe('Abaixo do peso')
    expect(getBMILabel('normal')).toBe('Peso normal')
    expect(getBMILabel('overweight')).toBe('Sobrepeso')
    expect(getBMILabel('obese_1')).toBe('Obesidade Grau I')
    expect(getBMILabel('obese_2')).toBe('Obesidade Grau II')
    expect(getBMILabel('obese_3')).toBe('Obesidade Grau III')
  })
})

describe('getBMIColor', () => {
  it('returns green for normal', () => {
    expect(getBMIColor('normal')).toBe('#2ECC71')
  })
  it('returns warning orange for underweight and overweight', () => {
    expect(getBMIColor('underweight')).toBe('#F39C12')
    expect(getBMIColor('overweight')).toBe('#F39C12')
  })
  it('returns danger red for obesity classes', () => {
    expect(getBMIColor('obese_1')).toBe('#E74C3C')
    expect(getBMIColor('obese_2')).toBe('#E74C3C')
    expect(getBMIColor('obese_3')).toBe('#E74C3C')
  })
})
