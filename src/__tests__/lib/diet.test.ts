import { getDietPlan } from '@/lib/diet'

describe('getDietPlan', () => {
  it('returns meals and tips for every valid goal+category combination', () => {
    const goals      = ['lose_weight', 'gain_muscle'] as const
    const categories = ['underweight', 'normal', 'overweight', 'obese_1', 'obese_2', 'obese_3'] as const
    for (const goal of goals) {
      for (const category of categories) {
        const plan = getDietPlan(goal, category)
        expect(plan.meals.breakfast).toBeTruthy()
        expect(plan.meals.lunch).toBeTruthy()
        expect(plan.meals.snack).toBeTruthy()
        expect(plan.meals.dinner).toBeTruthy()
        expect(plan.tips.length).toBeGreaterThanOrEqual(3)
      }
    }
  })

  it('returns different plans for different goals at normal BMI', () => {
    const lose = getDietPlan('lose_weight', 'normal')
    const gain = getDietPlan('gain_muscle', 'normal')
    expect(lose.meals.breakfast).not.toBe(gain.meals.breakfast)
  })

  it('returns medical alert tips for obese_2 regardless of goal', () => {
    const loseObese2 = getDietPlan('lose_weight', 'obese_2')
    const gainObese2 = getDietPlan('gain_muscle', 'obese_2')
    expect(loseObese2.tips[0]).toContain('médico')
    expect(gainObese2.tips[0]).toContain('médico')
  })
})
