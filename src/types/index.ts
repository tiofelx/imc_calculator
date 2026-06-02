export type Goal = 'lose_weight' | 'gain_muscle'

export type BMICategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese_1'
  | 'obese_2'
  | 'obese_3'

export interface Meal {
  breakfast: string
  lunch:     string
  snack:     string
  dinner:    string
}

export interface DietPlan {
  meals: Meal
  tips:  string[]
}

export interface BMIRecord {
  id:           string
  user_id:      string
  weight_kg:    number
  height_cm:    number
  bmi_value:    number
  bmi_category: BMICategory
  goal:         Goal
  created_at:   string
}

export interface SavedResult extends BMIRecord {
  diet_plans: {
    id:    string
    meals: Meal
    tips:  string[]
  }[]
}

export interface CalculatorState {
  step:        1 | 2 | 3
  goal:        Goal | null
  weightKg:    number | null
  heightCm:    number | null
  bmiValue:    number | null
  bmiCategory: BMICategory | null
  savedId:     string | null
}
