# IMC Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack BMI calculator web app where Google-authenticated users select a goal (lose weight or gain muscle), calculate their BMI, receive personalized diet recommendations, download the plan as PDF, and track their evolution on a dashboard.

**Architecture:** Next.js 15 App Router — Server Components for data fetching, Client Components for interactive UI. Supabase handles PostgreSQL (`bmi_records` + `diet_plans` tables with RLS) and Google OAuth via httpOnly cookies (Supabase SSR helpers). PDFs are generated client-side with `@react-pdf/renderer` and downloaded directly — no server storage.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase (`@supabase/ssr`), Framer Motion, Recharts, `@react-pdf/renderer`, React Hook Form + Zod, Lucide React, Vercel

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/types/index.ts` | Shared TypeScript interfaces and enums |
| `src/lib/bmi.ts` | BMI calculation + category classification + colors |
| `src/lib/diet.ts` | `getDietPlan(goal, category)` — full recommendation matrix |
| `src/lib/supabase/client.ts` | Browser Supabase client (Client Components) |
| `src/lib/supabase/server.ts` | Server Supabase client (Server Components, Route Handlers) |
| `src/middleware.ts` | Protect `/calculator` and `/dashboard`; refresh session cookies |
| `src/app/globals.css` | CSS custom properties (design tokens) |
| `src/app/layout.tsx` | Root layout — Inter font, Toaster |
| `src/app/page.tsx` | Landing page with CTA |
| `src/app/login/page.tsx` | Google login page |
| `src/app/auth/callback/route.ts` | OAuth PKCE callback handler |
| `src/app/auth/signout/route.ts` | Sign-out POST handler |
| `src/app/calculator/page.tsx` | Multi-step calculator (Client Component) |
| `src/app/dashboard/page.tsx` | BMI history dashboard (Server Component) |
| `src/app/result/[id]/page.tsx` | Saved result detail view (Server Component) |
| `src/components/calculator/ProgressBar.tsx` | Step 1/2/3 indicator with ARIA progressbar |
| `src/components/calculator/GoalStep.tsx` | Goal selection — two large cards |
| `src/components/calculator/DataStep.tsx` | Weight + height form (RHF + Zod) |
| `src/components/calculator/BMIGauge.tsx` | Animated SVG circular gauge |
| `src/components/calculator/ResultStep.tsx` | Gauge + classification badge + diet cards + save button |
| `src/components/dashboard/BMIChart.tsx` | Recharts line chart of BMI evolution |
| `src/components/dashboard/HistoryList.tsx` | List of past BMI records |
| `src/components/pdf/DietPDFTemplate.tsx` | `@react-pdf/renderer` A4 diet document |
| `src/components/pdf/PDFDownloadButton.tsx` | Client-only download trigger (dynamic imported) |
| `supabase/migrations/001_bmi_tables.sql` | DB schema + RLS policies |
| `src/__tests__/lib/bmi.test.ts` | Unit tests for BMI logic |
| `src/__tests__/lib/diet.test.ts` | Unit tests for diet recommendation logic |

---

## Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: root directory (run from `c:\Users\cruxSacra\Documents\imc_calculator`)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Initialise Next.js 15 app**

Run from `c:\Users\cruxSacra\Documents\`:
```bash
npx create-next-app@latest imc_calculator --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```
Expected: project scaffold created.

> **If the folder already exists and has files:** `cd imc_calculator && npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git`

- [ ] **Step 2: Install runtime dependencies**

```bash
cd imc_calculator
npm install @supabase/supabase-js @supabase/ssr
npm install framer-motion recharts
npm install @react-pdf/renderer
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
```

Expected: `added N packages` for each command, no peer-dependency errors.

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init --defaults
npx shadcn@latest add button card input label badge progress sonner
```

Expected: `components/ui/` populated, `components.json` created.

- [ ] **Step 4: Install test dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest @types/jest
```

- [ ] **Step 5: Create `jest.config.ts`**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 6: Create `jest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Add test script to `package.json`**

Inside `"scripts"` in `package.json`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 8: Update `next.config.ts` for `@react-pdf/renderer`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

export default nextConfig
```

- [ ] **Step 9: Verify setup**

```bash
npm run build
```
Expected: `Route (app)` table printed, no TypeScript errors.

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 project with all dependencies"
```

---

## Task 2: Design Tokens & Tailwind Config

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary:        #FF6B35;
  --color-primary-light:  #FF8E53;
  --color-secondary:      #F7C59F;
  --color-accent:         #2ECC71;
  --color-warning:        #F39C12;
  --color-danger:         #E74C3C;
  --color-dark:           #1A1A2E;
  --color-surface:        #FFFFFF;
  --color-background:     #F8F9FA;
  --color-text-primary:   #1A1A2E;
  --color-text-secondary: #6B7280;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
}
```

- [ ] **Step 2: Update `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:    { DEFAULT: '#FF6B35', light: '#FF8E53' },
        accent:     '#2ECC71',
        warning:    '#F39C12',
        danger:     '#E74C3C',
        dark:       '#1A1A2E',
        surface:    '#FFFFFF',
        background: '#F8F9FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        content: '800px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css tailwind.config.ts
git commit -m "feat: add design tokens and Tailwind config"
```

---

## Task 3: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create `src/types/index.ts`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 4: BMI Calculation Logic (TDD)

**Files:**
- Create: `src/__tests__/lib/bmi.test.ts`
- Create: `src/lib/bmi.ts`

- [ ] **Step 1: Write failing tests — `src/__tests__/lib/bmi.test.ts`**

```typescript
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
    // 56.66 / 1.75^2 ≈ 18.50
    expect(calculateBMI(56.66, 175).category).toBe('normal')
  })

  it('classifies overweight', () => {
    expect(calculateBMI(85, 170).category).toBe('overweight')
  })

  it('classifies obese_1', () => {
    // 87 / 1.70^2 = 87 / 2.89 ≈ 30.10
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- --testPathPattern=bmi
```
Expected: `FAIL src/__tests__/lib/bmi.test.ts` — module not found.

- [ ] **Step 3: Implement `src/lib/bmi.ts`**

```typescript
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
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- --testPathPattern=bmi
```
Expected: `PASS src/__tests__/lib/bmi.test.ts` — 10 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/__tests__/lib/bmi.test.ts src/lib/bmi.ts
git commit -m "feat: add BMI calculation logic with tests"
```

---

## Task 5: Diet Recommendation Logic (TDD)

**Files:**
- Create: `src/__tests__/lib/diet.test.ts`
- Create: `src/lib/diet.ts`

- [ ] **Step 1: Write failing tests — `src/__tests__/lib/diet.test.ts`**

```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- --testPathPattern=diet
```
Expected: `FAIL` — module not found.

- [ ] **Step 3: Implement `src/lib/diet.ts`**

```typescript
import type { Goal, BMICategory, DietPlan } from '@/types'

const MEDICAL_ALERT: DietPlan = {
  meals: {
    breakfast: 'Siga as orientações do seu médico e nutricionista',
    lunch:     'Siga as orientações do seu médico e nutricionista',
    snack:     'Siga as orientações do seu médico e nutricionista',
    dinner:    'Siga as orientações do seu médico e nutricionista',
  },
  tips: [
    '⚠️ Alerta médico: com IMC nesta faixa é obrigatório acompanhamento médico e nutricional profissional',
    'Não inicie dietas restritivas sem supervisão — há risco de complicações sérias',
    'Procure um endocrinologista ou clínico geral para avaliação completa',
    'O foco inicial deve ser saúde geral e qualidade de vida, não apenas a balança',
  ],
}

const PLANS: Record<Goal, Record<BMICategory, DietPlan>> = {
  lose_weight: {
    underweight: {
      meals: {
        breakfast: 'Aveia com banana e mel + 2 ovos mexidos + suco de laranja natural',
        lunch:     'Arroz integral + frango grelhado + salada verde + feijão',
        snack:     'Mix de castanhas + 1 fruta',
        dinner:    'Sopa de legumes com macarrão integral + queijo cottage',
      },
      tips: [
        'Consulte um nutricionista — perder peso com IMC abaixo do normal é perigoso',
        'Foque em nutrição de qualidade antes de criar qualquer déficit calórico',
        'Aumente gradualmente a ingestão calórica com alimentos nutritivos e variados',
        'Realize exames de sangue para descartar deficiências nutricionais',
      ],
    },
    normal: {
      meals: {
        breakfast: 'Iogurte grego + granola caseira + frutas vermelhas + café sem açúcar',
        lunch:     'Arroz integral + peixe assado + brócolis refogado + salada colorida',
        snack:     'Maçã + 2 col. sopa de pasta de amendoim integral',
        dinner:    'Omelete de claras com espinafre + 1 fatia de pão integral',
      },
      tips: [
        'Déficit calórico leve de 300 kcal/dia é suficiente — evite cortes drásticos',
        'Pratique 150 minutos/semana de cardio moderado (caminhada rápida, ciclismo)',
        'Mantenha proteína em 1,6–2 g/kg de peso corporal para preservar massa magra',
        'Hidrate-se com 35 ml de água por kg corporal ao longo do dia',
      ],
    },
    overweight: {
      meals: {
        breakfast: 'Vitamina de whey com leite de amêndoas + aveia + 1 fruta',
        lunch:     'Frango grelhado + quinoa + legumes no vapor + salada verde abundante',
        snack:     'Cenoura e pepino em palitos + hummus caseiro',
        dinner:    'Filé de peixe assado + batata-doce pequena + salada',
      },
      tips: [
        'Déficit calórico de 500 kcal/dia promove perda de ~0,5 kg/semana de forma sustentável',
        'Reduza carboidratos refinados (pão branco, açúcar, massas) e alimentos ultraprocessados',
        'Cardio 30 min 5x/semana + musculação 3x/semana para preservar massa muscular',
        'Registre sua alimentação por 7 dias para identificar padrões e excessos',
      ],
    },
    obese_1: {
      meals: {
        breakfast: 'Ovos cozidos (2) + 1 fatia de pão integral + 1 fruta + chá verde sem açúcar',
        lunch:     'Peito de frango grelhado + arroz integral (porção reduzida) + feijão + salada abundante',
        snack:     'Iogurte natural desnatado + canela',
        dinner:    'Sopa de legumes sem batata + proteína magra (atum ou frango desfiado)',
      },
      tips: [
        '⚠️ Consulte um médico antes de iniciar qualquer protocolo de dieta restritiva',
        'Alimentação anti-inflamatória: evite açúcar, excesso de glúten e frituras',
        'Déficit de 750–1000 kcal/dia deve ser feito apenas com acompanhamento profissional',
        'Registre tudo que come por 7 dias para identificar padrões e pontos de melhora',
      ],
    },
    obese_2: MEDICAL_ALERT,
    obese_3: MEDICAL_ALERT,
  },

  gain_muscle: {
    underweight: {
      meals: {
        breakfast: 'Shake de whey + aveia + banana + pasta de amendoim + leite integral',
        lunch:     'Arroz branco + feijão + carne bovina 200 g + 2 ovos + salada',
        snack:     'Pão integral + peito de frango + 1/2 abacate',
        dinner:    'Macarrão integral + atum + azeite + parmesão + salada',
      },
      tips: [
        'Superávit calórico de 500–700 kcal/dia para ganho efetivo de massa',
        'Proteína: 2–2,5 g/kg de peso corporal, distribuída em 4–5 refeições',
        'Treino de força progressivo 4x/semana — progressão de carga é obrigatória',
        'Priorize sono de qualidade: 7–9 h por noite para máxima recuperação muscular',
      ],
    },
    normal: {
      meals: {
        breakfast: 'Ovos mexidos (3) + aveia com leite + banana + café sem açúcar',
        lunch:     'Arroz + feijão + carne bovina magra 200 g + legumes refogados',
        snack:     'Shake de whey + 1 fruta + aveia',
        dinner:    'Frango grelhado 200 g + batata-doce + brócolis + azeite',
      },
      tips: [
        'Superávit calórico moderado de 300 kcal/dia (lean bulk) para minimizar ganho de gordura',
        'Proteína: 1,8–2,2 g/kg/dia distribuída em 4–5 refeições ao longo do dia',
        'Treino de força periodizado 3–5x/semana com progressão de carga consistente',
        'Carboidratos como fonte de energia: priorize pré e pós-treino para melhor desempenho',
      ],
    },
    overweight: {
      meals: {
        breakfast: 'Iogurte grego proteico + granola + frutas + 1 dose de whey',
        lunch:     'Frango grelhado 200 g + arroz integral + salada + feijão',
        snack:     'Queijo cottage + frutas vermelhas + nozes',
        dinner:    'Peixe assado 200 g + legumes no vapor + batata-doce pequena',
      },
      tips: [
        'Recomposição corporal: déficit leve de 200–300 kcal para perder gordura e ganhar músculo simultaneamente',
        'Proteína alta: 2–2,5 g/kg para preservar e construir músculo mesmo em déficit',
        'Musculação intensa 4x/semana com foco em exercícios compostos (agachamento, supino, remada)',
        'Cardio leve 2–3x/semana para saúde cardiovascular sem comprometer o ganho muscular',
      ],
    },
    obese_1: {
      meals: {
        breakfast: 'Ovos cozidos (2) + 1 fatia de pão integral + 1 fruta + chá sem açúcar',
        lunch:     'Frango grelhado 200 g + arroz integral (porção pequena) + salada abundante',
        snack:     'Iogurte grego proteico + castanhas (30 g)',
        dinner:    'Peixe assado 180 g + legumes no vapor',
      },
      tips: [
        '⚠️ Acompanhamento médico e nutricional OBRIGATÓRIO antes de iniciar protocolo de hipertrofia',
        'Foque primeiro em reduzir gordura corporal — é mais seguro e eficiente para ganho muscular a longo prazo',
        'Proteína: 1,6–2 g/kg para preservar e construir músculo gradualmente',
        'Evite suplementos sem orientação profissional nesta faixa de IMC',
      ],
    },
    obese_2: MEDICAL_ALERT,
    obese_3: MEDICAL_ALERT,
  },
}

export function getDietPlan(goal: Goal, category: BMICategory): DietPlan {
  return PLANS[goal][category]
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- --testPathPattern=diet
```
Expected: `PASS src/__tests__/lib/diet.test.ts` — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/__tests__/lib/diet.test.ts src/lib/diet.ts
git commit -m "feat: add diet recommendation matrix with tests"
```

---

## Task 6: Supabase Project Setup & Schema

**Files:**
- Create: `supabase/migrations/001_bmi_tables.sql`
- Create: `.env.local`

> **Pre-requisite:** Create a Supabase project at supabase.com, then go to **Project Settings → API** for your URL and anon key. Enable Google in **Authentication → Providers → Google** with your Google OAuth credentials.

- [ ] **Step 1: Create `.env.local`**

```bash
# .env.local  (never commit this file)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace placeholders with values from Supabase Dashboard → Project Settings → API.

- [ ] **Step 2: Confirm `.env.local` is in `.gitignore`**

```bash
grep ".env.local" .gitignore
```
Expected: `.env.local` printed. If not found, run: `echo ".env.local" >> .gitignore`

- [ ] **Step 3: Create `supabase/migrations/001_bmi_tables.sql`**

```sql
-- ================================================================
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ================================================================

CREATE TABLE IF NOT EXISTS bmi_records (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg    decimal(5,2) NOT NULL,
  height_cm    decimal(5,1) NOT NULL,
  bmi_value    decimal(5,2) NOT NULL,
  bmi_category text         NOT NULL,
  goal         text         NOT NULL,
  created_at   timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diet_plans (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  bmi_record_id uuid        NOT NULL REFERENCES bmi_records(id) ON DELETE CASCADE,
  meals         jsonb       NOT NULL,
  tips          text[]      NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bmi_records_user_id_created_at
  ON bmi_records (user_id, created_at DESC);

ALTER TABLE bmi_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own bmi_records" ON bmi_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own diet_plans" ON diet_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bmi_records
      WHERE bmi_records.id = diet_plans.bmi_record_id
        AND bmi_records.user_id = auth.uid()
    )
  );
```

- [ ] **Step 4: Run the migration**

Open Supabase Dashboard → SQL Editor → New Query → paste the contents of `001_bmi_tables.sql` → Run.
Expected: `Success. No rows returned.`

- [ ] **Step 5: Set Auth redirect URL in Supabase**

Dashboard → **Authentication → URL Configuration → Redirect URLs**, add:
```
http://localhost:3000/auth/callback
```

- [ ] **Step 6: Commit schema file**

```bash
git add supabase/ .gitignore
git commit -m "feat: add Supabase schema with RLS policies"
```

---

## Task 7: Supabase Client Setup

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`

- [ ] **Step 1: Create `src/lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create `src/lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component; cookie mutation is only possible
            // in middleware and Route Handlers — safe to ignore here.
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase/
git commit -m "feat: add Supabase browser and server clients"
```

---

## Task 8: Auth Callback Route & Middleware

**Files:**
- Create: `src/app/auth/callback/route.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create `src/app/auth/callback/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code      = searchParams.get('code')
  const returnUrl = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${returnUrl}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
```

- [ ] **Step 2: Create `src/middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Must be called on every request to keep the session fresh
  const { data: { user } } = await supabase.auth.getUser()

  const isProtected =
    request.nextUrl.pathname.startsWith('/calculator') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/result')

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/auth/ src/middleware.ts
git commit -m "feat: add OAuth callback route and auth middleware"
```

---

## Task 9: Root Layout & Landing Page

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'IMC Autocuidado',
  description: 'Calcule seu IMC e receba um plano de dieta personalizado',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
import Link from 'next/link'
import { Activity, ChevronRight, Target, FileDown, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  { icon: Target,    title: 'Defina seu objetivo',   desc: 'Perder peso ou ganhar massa — o plano se adapta ao seu foco.' },
  { icon: Activity,  title: 'Calcule seu IMC',        desc: 'Cálculo preciso com classificação e gauge visual animado.' },
  { icon: FileDown,  title: 'Baixe sua dieta em PDF', desc: 'Receba um plano de refeições personalizado para imprimir ou salvar.' },
  { icon: BarChart2, title: 'Acompanhe sua evolução', desc: 'Dashboard com histórico de cálculos e gráfico de progresso.' },
]

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero */}
      <section className="w-full bg-gradient-to-br from-primary to-primary-light py-24 px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Cuide-se com inteligência
        </h1>
        <p className="text-lg md:text-xl mb-10 opacity-90 max-w-xl mx-auto">
          Calcule seu IMC, receba recomendações de dieta personalizadas e baixe seu plano em PDF — em menos de 2 minutos.
        </p>
        <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 h-14 rounded-2xl shadow-lg">
          <Link href="/login">
            Começar agora <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Features */}
      <section className="w-full max-w-content mx-auto px-4 py-20 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-bold text-lg mb-2 text-dark">{title}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <section className="w-full bg-dark text-white text-center py-12 px-4">
        <p className="text-lg font-semibold mb-4">Pronto para começar sua jornada de saúde?</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary-light font-bold px-8 h-12 rounded-xl">
          <Link href="/login">Criar conta grátis</Link>
        </Button>
      </section>
    </main>
  )
}
```

- [ ] **Step 3: Run dev server and verify landing page**

```bash
npm run dev
```
Open `http://localhost:3000`. Expected: orange gradient hero with white CTA button, 4 feature cards below.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add root layout and landing page"
```

---

## Task 10: Login Page

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create `src/app/login/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleGoogleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      toast.error('Erro ao conectar com Google. Tente novamente.')
      setLoading(false)
    }
    // On success the browser navigates to Google — no state reset needed
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-primary-light flex items-center justify-center px-4">
      <div className="bg-surface rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Activity className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-3xl font-extrabold text-dark mb-2">IMC Autocuidado</h1>
        <p className="text-text-secondary mb-8">
          Faça login para calcular seu IMC e receber recomendações personalizadas.
        </p>

        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          size="lg"
          className="w-full h-14 text-base font-bold bg-primary hover:bg-primary-light rounded-xl gap-3"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading ? 'Conectando…' : 'Continuar com Google'}
        </Button>

        <p className="mt-6 text-xs text-text-secondary">
          Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify at `http://localhost:3000/login`**

Expected: gradient background, white card, Activity icon, Google button.

- [ ] **Step 3: Commit**

```bash
git add src/app/login/page.tsx
git commit -m "feat: add Google login page"
```

---

## Task 11: ProgressBar & GoalStep

**Files:**
- Create: `src/components/calculator/ProgressBar.tsx`
- Create: `src/components/calculator/GoalStep.tsx`

- [ ] **Step 1: Create `src/components/calculator/ProgressBar.tsx`**

```tsx
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
                active ? 'text-primary' : done ? 'text-accent' : 'text-text-secondary',
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
          className="h-2 rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/calculator/GoalStep.tsx`**

```tsx
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
    color:  'text-warning',
    border: 'border-warning',
    bg:     'bg-warning/5',
  },
  {
    value:  'gain_muscle' as Goal,
    icon:   Dumbbell,
    title:  'Ganhar Massa',
    desc:   'Aumentar massa muscular com superávit calórico e alta ingestão proteica.',
    color:  'text-accent',
    border: 'border-accent',
    bg:     'bg-accent/5',
  },
]

export default function GoalStep({ selected, onSelect }: GoalStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-dark mb-2">Qual é o seu objetivo?</h2>
      <p className="text-text-secondary mb-8">
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
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'min-h-[44px]',
                isSelected
                  ? `${border} ${bg} shadow-md`
                  : 'border-gray-200 hover:border-gray-300 bg-surface',
              ].join(' ')}
              aria-pressed={isSelected}
              aria-label={`Objetivo: ${title}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isSelected ? bg : 'bg-gray-100'}`}>
                <Icon className={`h-6 w-6 ${isSelected ? color : 'text-gray-400'}`} />
              </div>
              <h3 className="font-bold text-lg mb-1 text-dark">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/calculator/ProgressBar.tsx src/components/calculator/GoalStep.tsx
git commit -m "feat: add ProgressBar and GoalStep components"
```

---

## Task 12: DataStep Component

**Files:**
- Create: `src/components/calculator/DataStep.tsx`

- [ ] **Step 1: Create `src/components/calculator/DataStep.tsx`**

```tsx
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
    .number({ invalid_type_error: 'Informe o peso' })
    .min(20, 'Peso mínimo: 20 kg')
    .max(300, 'Peso máximo: 300 kg'),
  heightCm: z
    .number({ invalid_type_error: 'Informe a altura' })
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
      <h2 className="text-2xl font-extrabold text-dark mb-2">Informe seus dados</h2>
      <p className="text-text-secondary mb-8">
        Usaremos peso e altura para calcular seu IMC com precisão.
      </p>

      <form onSubmit={handleSubmit(d => onSubmit(d.weightKg, d.heightCm))} noValidate className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="weightKg" className="font-semibold text-dark">Peso (kg)</Label>
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
            <p id="weightKg-error" role="alert" className="text-sm text-danger font-medium">
              {errors.weightKg.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="heightCm" className="font-semibold text-dark">Altura (cm)</Label>
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
            <p id="heightCm-error" role="alert" className="text-sm text-danger font-medium">
              {errors.heightCm.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full h-14 text-base font-bold bg-primary hover:bg-primary-light rounded-xl"
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/calculator/DataStep.tsx
git commit -m "feat: add DataStep form with React Hook Form + Zod validation"
```

---

## Task 13: BMI Gauge & ResultStep

**Files:**
- Create: `src/components/calculator/BMIGauge.tsx`
- Create: `src/components/calculator/ResultStep.tsx`

- [ ] **Step 1: Create `src/components/calculator/BMIGauge.tsx`**

The gauge arc spans 240° (from 8-o'clock to 4-o'clock, gap at bottom).
Display range: BMI 10–45. `rotate(150, cx, cy)` places the arc start at the 8-o'clock position.

```tsx
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
const CIRCUMFERENCE = 2 * Math.PI * RADIUS   // ≈ 502.65
const ARC_DEGREES   = 240
const ARC_LENGTH    = (ARC_DEGREES / 360) * CIRCUMFERENCE  // ≈ 335.10
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
        {/* Track arc */}
        <circle
          cx={CX} cy={CY} r={RADIUS}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="16"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
          strokeLinecap="round"
          transform={`rotate(150 ${CX} ${CY})`}
        />
        {/* Progress arc — spring animated on mount */}
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
        {/* Value text */}
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
```

- [ ] **Step 2: Create `src/components/calculator/ResultStep.tsx`**

```tsx
'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BMIGauge from './BMIGauge'
import type { Goal, BMICategory, DietPlan } from '@/types'
import { getBMILabel, getBMIColor } from '@/lib/bmi'

const PDFDownloadButton = dynamic(
  () => import('@/components/pdf/PDFDownloadButton'),
  { ssr: false }
)

interface ResultStepProps {
  bmiValue:    number
  bmiCategory: BMICategory
  goal:        Goal
  dietPlan:    DietPlan
  onSave:      () => Promise<void>
  savedId:     string | null
}

const MEAL_LABELS = {
  breakfast: 'Café da manhã',
  lunch:     'Almoço',
  snack:     'Lanche',
  dinner:    'Jantar',
} as const

export default function ResultStep({
  bmiValue, bmiCategory, goal, dietPlan, onSave, savedId,
}: ResultStepProps) {
  const [saving, setSaving] = useState(false)
  const color = getBMIColor(bmiCategory)
  const label = getBMILabel(bmiCategory)

  async function handleSave() {
    setSaving(true)
    await onSave()
    setSaving(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-dark mb-1">Seu resultado</h2>
        <p className="text-text-secondary">Confira sua classificação e as recomendações personalizadas.</p>
      </div>

      <BMIGauge value={bmiValue} color={color} label={label} />

      {/* Meal cards */}
      <div>
        <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Plano alimentar sugerido
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(MEAL_LABELS) as Array<keyof typeof MEAL_LABELS>).map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-surface rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                {MEAL_LABELS[key]}
              </p>
              <p className="text-sm text-dark leading-relaxed">{dietPlan.meals[key]}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
        <h3 className="font-bold text-dark mb-3">Dicas personalizadas</h3>
        <ul className="space-y-2">
          {dietPlan.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-dark">
              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <PDFDownloadButton
          bmiValue={bmiValue}
          bmiCategory={bmiCategory}
          goal={goal}
          dietPlan={dietPlan}
        />

        {!savedId ? (
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="outline"
            size="lg"
            className="flex-1 h-14 rounded-xl border-2 border-primary text-primary hover:bg-primary/5 font-bold"
          >
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando…</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Salvar no histórico</>
            )}
          </Button>
        ) : (
          <div className="flex-1 h-14 rounded-xl border-2 border-accent bg-accent/5 flex items-center justify-center text-accent font-bold text-sm">
            ✓ Salvo no histórico
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/calculator/BMIGauge.tsx src/components/calculator/ResultStep.tsx
git commit -m "feat: add BMI gauge and result step with diet cards"
```

---

## Task 14: Calculator Page (Multi-step Orchestration)

**Files:**
- Create: `src/app/calculator/page.tsx`

- [ ] **Step 1: Create `src/app/calculator/page.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import ProgressBar from '@/components/calculator/ProgressBar'
import GoalStep    from '@/components/calculator/GoalStep'
import DataStep    from '@/components/calculator/DataStep'
import ResultStep  from '@/components/calculator/ResultStep'
import { createClient } from '@/lib/supabase/client'
import { calculateBMI } from '@/lib/bmi'
import { getDietPlan }   from '@/lib/diet'
import type { CalculatorState, DietPlan } from '@/types'

const SLIDE = {
  initial:    { opacity: 0, x: 40 },
  animate:    { opacity: 1, x: 0 },
  exit:       { opacity: 0, x: -40 },
  transition: { duration: 0.3, ease: 'easeInOut' as const },
}

export default function CalculatorPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<CalculatorState>({
    step: 1, goal: null, weightKg: null, heightCm: null,
    bmiValue: null, bmiCategory: null, savedId: null,
  })
  const [dietPlan,    setDietPlan]    = useState<DietPlan | null>(null)
  const [calculating, setCalculating] = useState(false)

  function handleGoalSelect(goal: CalculatorState['goal']) {
    setState(prev => ({ ...prev, goal }))
    setTimeout(() => setState(prev => ({ ...prev, step: 2 })), 300)
  }

  async function handleDataSubmit(weightKg: number, heightCm: number) {
    if (!state.goal) return
    setCalculating(true)
    await new Promise(res => setTimeout(res, 400))
    const bmi  = calculateBMI(weightKg, heightCm)
    const plan = getDietPlan(state.goal, bmi.category)
    setState(prev => ({
      ...prev, step: 3, weightKg, heightCm,
      bmiValue: bmi.value, bmiCategory: bmi.category,
    }))
    setDietPlan(plan)
    setCalculating(false)
  }

  async function handleSave() {
    if (!state.goal || !state.bmiValue || !state.bmiCategory || !dietPlan) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: record, error: recErr } = await supabase
      .from('bmi_records')
      .insert({
        user_id:      user.id,
        weight_kg:    state.weightKg,
        height_cm:    state.heightCm,
        bmi_value:    state.bmiValue,
        bmi_category: state.bmiCategory,
        goal:         state.goal,
      })
      .select('id')
      .single()

    if (recErr || !record) {
      toast.error('Não foi possível salvar o cálculo. Tente novamente.')
      return
    }

    const { error: dietErr } = await supabase
      .from('diet_plans')
      .insert({
        bmi_record_id: record.id,
        meals:         dietPlan.meals,
        tips:          dietPlan.tips,
      })

    if (dietErr) {
      toast.error('Cálculo salvo, mas houve erro ao salvar o plano de dieta.')
    } else {
      toast.success('Resultado salvo no seu histórico!')
      setState(prev => ({ ...prev, savedId: record.id }))
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-content">
        <div className="mb-10">
          <ProgressBar currentStep={state.step} />
        </div>

        <div className="bg-surface rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          <AnimatePresence mode="wait">
            {state.step === 1 && (
              <motion.div key="step1" {...SLIDE}>
                <GoalStep selected={state.goal} onSelect={handleGoalSelect} />
              </motion.div>
            )}
            {state.step === 2 && (
              <motion.div key="step2" {...SLIDE}>
                <DataStep
                  defaultWeight={state.weightKg}
                  defaultHeight={state.heightCm}
                  onSubmit={handleDataSubmit}
                  loading={calculating}
                />
              </motion.div>
            )}
            {state.step === 3 && state.bmiValue && state.bmiCategory && state.goal && dietPlan && (
              <motion.div key="step3" {...SLIDE}>
                <ResultStep
                  bmiValue={state.bmiValue}
                  bmiCategory={state.bmiCategory}
                  goal={state.goal}
                  dietPlan={dietPlan}
                  onSave={handleSave}
                  savedId={state.savedId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {state.step === 2 && (
          <button
            onClick={() => setState(prev => ({ ...prev, step: 1 }))}
            className="mt-4 text-sm text-text-secondary hover:text-dark transition-colors min-h-[44px] px-2"
          >
            ← Voltar ao objetivo
          </button>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Test full calculator flow in browser**

Log in with Google, go to `/calculator`, select a goal, enter weight + height, verify the gauge animates and diet cards appear.

- [ ] **Step 3: Commit**

```bash
git add src/app/calculator/page.tsx
git commit -m "feat: add multi-step calculator page with Supabase save"
```

---

## Task 15: PDF Export

**Files:**
- Create: `src/components/pdf/DietPDFTemplate.tsx`
- Create: `src/components/pdf/PDFDownloadButton.tsx`

- [ ] **Step 1: Create `src/components/pdf/DietPDFTemplate.tsx`**

```tsx
import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'
import type { Goal, BMICategory, DietPlan } from '@/types'
import { getBMILabel } from '@/lib/bmi'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff', fontWeight: 700 },
  ],
})

const GOAL_LABEL: Record<Goal, string> = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
}

const MEAL_LABELS: Record<keyof DietPlan['meals'], string> = {
  breakfast: 'Café da manhã',
  lunch:     'Almoço',
  snack:     'Lanche',
  dinner:    'Jantar',
}

const s = StyleSheet.create({
  page:        { padding: 48, fontFamily: 'Inter', fontSize: 11, color: '#1A1A2E' },
  header:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, borderBottom: '2px solid #FF6B35', paddingBottom: 12 },
  title:       { fontSize: 22, fontWeight: 700, color: '#FF6B35' },
  subtitle:    { fontSize: 11, color: '#6B7280', marginTop: 2 },
  section:     { marginBottom: 18 },
  sectionTitle:{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#FF6B35' },
  card:        { backgroundColor: '#F8F9FA', borderRadius: 6, padding: 10, marginBottom: 6 },
  mealLabel:   { fontSize: 9, fontWeight: 700, color: '#FF6B35', textTransform: 'uppercase', marginBottom: 3 },
  mealText:    { fontSize: 10, lineHeight: 1.5 },
  tip:         { flexDirection: 'row', gap: 4, marginBottom: 4 },
  tipNum:      { fontWeight: 700, color: '#FF6B35', minWidth: 14 },
  footer:      { position: 'absolute', bottom: 30, left: 48, right: 48, fontSize: 8, color: '#9CA3AF', textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: 8 },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gridItem:    { width: '47%' },
  meta:        { fontSize: 10, marginBottom: 4, color: '#6B7280' },
  metaBold:    { fontWeight: 700, color: '#1A1A2E' },
  metaRow:     { flexDirection: 'row', gap: 20, marginBottom: 16 },
})

interface Props {
  bmiValue:    number
  bmiCategory: BMICategory
  goal:        Goal
  dietPlan:    DietPlan
  userName?:   string
  date?:       string
}

export default function DietPDFTemplate({ bmiValue, bmiCategory, goal, dietPlan, userName, date }: Props) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.title}>IMC Autocuidado</Text>
            <Text style={s.subtitle}>Plano de Dieta Personalizado</Text>
          </View>
          <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 4 }}>
            {date ?? new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={[s.section, s.metaRow]}>
          {userName && (
            <Text style={s.meta}><Text style={s.metaBold}>Usuário: </Text>{userName}</Text>
          )}
          <Text style={s.meta}>
            <Text style={s.metaBold}>IMC: </Text>{bmiValue.toFixed(1)} — {getBMILabel(bmiCategory)}
          </Text>
          <Text style={s.meta}>
            <Text style={s.metaBold}>Objetivo: </Text>{GOAL_LABEL[goal]}
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Plano Alimentar Diário</Text>
          <View style={s.grid}>
            {(Object.keys(MEAL_LABELS) as Array<keyof DietPlan['meals']>).map((key) => (
              <View key={key} style={[s.card, s.gridItem]}>
                <Text style={s.mealLabel}>{MEAL_LABELS[key]}</Text>
                <Text style={s.mealText}>{dietPlan.meals[key]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Dicas Personalizadas</Text>
          {dietPlan.tips.map((tip, i) => (
            <View key={i} style={s.tip}>
              <Text style={s.tipNum}>{i + 1}.</Text>
              <Text style={s.mealText}>{tip}</Text>
            </View>
          ))}
        </View>

        <Text style={s.footer}>
          Este plano é uma sugestão educativa e não substitui acompanhamento médico ou nutricional profissional. Consulte um especialista antes de iniciar qualquer dieta.
        </Text>
      </Page>
    </Document>
  )
}
```

- [ ] **Step 2: Create `src/components/pdf/PDFDownloadButton.tsx`**

```tsx
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
      className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary-light font-bold text-white"
    >
      {generating ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando PDF…</>
      ) : (
        <><FileDown className="mr-2 h-4 w-4" />Baixar Dieta em PDF</>
      )}
    </Button>
  )
}
```

- [ ] **Step 3: Test PDF download in the browser**

Complete the calculator flow and click "Baixar Dieta em PDF". Expected: a `.pdf` file downloaded with the meal plan and tips.

- [ ] **Step 4: Commit**

```bash
git add src/components/pdf/
git commit -m "feat: add PDF export with @react-pdf/renderer"
```

---

## Task 16: Dashboard Page

**Files:**
- Create: `src/components/dashboard/BMIChart.tsx`
- Create: `src/components/dashboard/HistoryList.tsx`
- Create: `src/app/dashboard/page.tsx`
- Create: `src/app/auth/signout/route.ts`

- [ ] **Step 1: Create `src/components/dashboard/BMIChart.tsx`**

```tsx
'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { getBMILabel, getBMICategory } from '@/lib/bmi'
import type { BMIRecord } from '@/types'

interface Props { records: BMIRecord[] }

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const bmi = payload[0].value as number
  return (
    <div className="bg-surface border border-gray-200 rounded-xl p-3 shadow-md text-sm">
      <p className="font-semibold text-dark">{label}</p>
      <p className="text-primary font-bold">IMC: {bmi.toFixed(1)}</p>
      <p className="text-text-secondary">{getBMILabel(getBMICategory(bmi))}</p>
    </div>
  )
}

export default function BMIChart({ records }: Props) {
  const data = [...records]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(r => ({
      date:  new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      value: r.bmi_value,
    }))

  if (data.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-text-secondary text-sm">
        Calcule pelo menos 2 vezes para ver a evolução do seu IMC.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <YAxis domain={[10, 45]} tick={{ fontSize: 11, fill: '#6B7280' }} width={32} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={18.5} stroke="#2ECC71" strokeDasharray="4 4" strokeWidth={1} />
        <ReferenceLine y={25}   stroke="#F39C12" strokeDasharray="4 4" strokeWidth={1} />
        <Line
          type="monotone" dataKey="value"
          stroke="#FF6B35" strokeWidth={3}
          dot={{ fill: '#FF6B35', r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 2: Create `src/components/dashboard/HistoryList.tsx`**

```tsx
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getBMILabel, getBMIColor } from '@/lib/bmi'
import type { BMIRecord } from '@/types'

interface Props { records: BMIRecord[] }

const GOAL_LABEL: Record<string, string> = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
}

export default function HistoryList({ records }: Props) {
  if (records.length === 0) {
    return (
      <p className="text-text-secondary text-sm py-8 text-center">
        Nenhum cálculo salvo ainda.{' '}
        <Link href="/calculator" className="text-primary font-semibold hover:underline">
          Calcular agora →
        </Link>
      </p>
    )
  }

  return (
    <ul className="divide-y divide-gray-100" aria-label="Histórico de cálculos">
      {records.map(r => {
        const color = getBMIColor(r.bmi_category)
        const label = getBMILabel(r.bmi_category)
        return (
          <li key={r.id}>
            <Link
              href={`/result/${r.id}`}
              className="flex items-center gap-4 py-4 hover:bg-gray-50 rounded-xl px-2 transition-colors min-h-[44px]"
              aria-label={`Resultado de ${new Date(r.created_at).toLocaleDateString('pt-BR')}: IMC ${r.bmi_value}, ${label}`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: color }}
              >
                {r.bmi_value.toFixed(1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark text-sm truncate">{label}</p>
                <p className="text-xs text-text-secondary">
                  {GOAL_LABEL[r.goal]} · {r.weight_kg} kg · {r.height_cm} cm
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-text-secondary">
                  {new Date(r.created_at).toLocaleDateString('pt-BR')}
                </p>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto mt-1" />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
```

- [ ] **Step 3: Create `src/app/auth/signout/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
```

- [ ] **Step 4: Create `src/app/dashboard/page.tsx`**

```tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BMIChart    from '@/components/dashboard/BMIChart'
import HistoryList from '@/components/dashboard/HistoryList'
import { createClient } from '@/lib/supabase/server'
import type { BMIRecord } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: records } = await supabase
    .from('bmi_records')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const typedRecords = (records ?? []) as BMIRecord[]
  const latest       = typedRecords[0]

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-content mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url as string}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <h1 className="font-extrabold text-dark text-xl">
                Olá, {(user.user_metadata?.full_name as string)?.split(' ')[0] ?? 'usuário'}!
              </h1>
              <p className="text-sm text-text-secondary">Seu painel de evolução</p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" className="text-text-secondary gap-2">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </form>
        </div>

        {/* Latest IMC */}
        {latest && (
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-white">
            <p className="text-sm opacity-80 mb-1">Último IMC calculado</p>
            <p className="text-5xl font-extrabold">{latest.bmi_value.toFixed(1)}</p>
            <p className="text-sm opacity-90 mt-1">
              {new Date(latest.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
            </p>
          </div>
        )}

        {/* New calculation CTA */}
        <Button asChild size="lg" className="w-full h-14 rounded-xl bg-primary hover:bg-primary-light font-bold text-base">
          <Link href="/calculator">
            <Plus className="mr-2 h-5 w-5" /> Novo cálculo de IMC
          </Link>
        </Button>

        {/* Chart */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-dark text-lg mb-4">Evolução do IMC</h2>
          <BMIChart records={typedRecords} />
        </div>

        {/* History */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-dark text-lg mb-2">Histórico de cálculos</h2>
          <HistoryList records={typedRecords} />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Verify dashboard**

Save at least one BMI calculation, then visit `/dashboard`. Expected: avatar header, latest IMC card, chart placeholder or line, history list.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/ src/app/dashboard/ src/app/auth/signout/
git commit -m "feat: add dashboard with BMI chart and history list"
```

---

## Task 17: Result Detail Page

**Files:**
- Create: `src/app/result/[id]/page.tsx`

- [ ] **Step 1: Create `src/app/result/[id]/page.tsx`**

```tsx
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import BMIGauge from '@/components/calculator/BMIGauge'
import { getBMIColor, getBMILabel } from '@/lib/bmi'
import type { SavedResult } from '@/types'

interface Props { params: Promise<{ id: string }> }

const GOAL_LABEL: Record<string, string> = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  lunch:     'Almoço',
  snack:     'Lanche',
  dinner:    'Jantar',
}

export default async function ResultDetailPage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: record } = await supabase
    .from('bmi_records')
    .select('*, diet_plans(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!record) notFound()

  const typed = record as SavedResult
  const diet  = typed.diet_plans?.[0]
  const color = getBMIColor(typed.bmi_category)
  const label = getBMILabel(typed.bmi_category)

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-content mx-auto space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-dark transition-colors min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao dashboard
        </Link>

        <div className="bg-surface rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 space-y-8">
          <div>
            <p className="text-sm text-text-secondary mb-1">
              {new Date(typed.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
            </p>
            <h1 className="text-2xl font-extrabold text-dark">Resultado do IMC</h1>
            <p className="text-text-secondary text-sm mt-1">
              Objetivo: <strong>{GOAL_LABEL[typed.goal]}</strong> · {typed.weight_kg} kg · {typed.height_cm} cm
            </p>
          </div>

          <BMIGauge value={typed.bmi_value} color={color} label={label} />

          {diet && (
            <>
              <div>
                <h2 className="text-lg font-bold text-dark mb-4">Plano alimentar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(MEAL_LABELS).map(key => (
                    <div key={key} className="bg-background rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                        {MEAL_LABELS[key]}
                      </p>
                      <p className="text-sm text-dark">{(diet.meals as Record<string, string>)[key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-bold text-dark mb-3">Dicas</h3>
                <ul className="space-y-2">
                  {(diet.tips as string[]).map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm text-dark">
                      <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify result page**

Save a calculation, click it in the history list, confirm gauge + meal plan + tips appear.

- [ ] **Step 3: Commit**

```bash
git add src/app/result/
git commit -m "feat: add result detail page"
```

---

## Task 18: Run All Tests & Final Build Verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```
Expected:
```
PASS src/__tests__/lib/bmi.test.ts
PASS src/__tests__/lib/diet.test.ts
Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no output (zero errors).

- [ ] **Step 3: Production build**

```bash
npm run build
```
Expected: `Route (app)` table shows 8 routes (`/`, `/login`, `/auth/callback`, `/auth/signout`, `/calculator`, `/dashboard`, `/result/[id]`, plus the 404). No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: all tests passing, production build verified"
```

---

## Task 19: Deploy to Vercel

- [ ] **Step 1: Install Vercel CLI and deploy**

```bash
npm install -g vercel
vercel login
vercel
```
Follow prompts, accept defaults. Note the preview URL.

- [ ] **Step 2: Add environment variables in Vercel Dashboard**

Project Settings → Environment Variables → add for Production + Preview + Development:
```
NEXT_PUBLIC_SUPABASE_URL       = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = your-anon-key
```

- [ ] **Step 3: Add production callback URL to Supabase**

Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:
```
https://your-app.vercel.app/auth/callback
```

- [ ] **Step 4: Production deploy**

```bash
vercel --prod
```
Expected: production URL printed. Visit it, log in with Google, complete a full calculation end-to-end.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: production deploy verified"
```

---

## Self-Review Notes

**Spec coverage:**
- Section 2 (User Journey): GoalStep → DataStep → ResultStep → Dashboard — all 5 routes implemented
- Section 3 (Architecture): App Router, server/client split, httpOnly cookies via `@supabase/ssr`, middleware
- Section 4 (Data Model): `bmi_records` + `diet_plans` + RLS in `001_bmi_tables.sql`
- Section 5 (Diet Logic): Full 10-cell matrix (5 BMI categories × 2 goals); obese_2/3 collapse to MEDICAL_ALERT for both goals
- Section 6 (Design System): CSS vars in `globals.css`, Tailwind tokens, Inter, WCAG-AA color pairs, 44×44px min targets, ARIA roles
- Section 7 (Components): All 5 spec components built; `BMIGauge` uses 800ms spring animation
- Section 8 (Auth): `signInWithOAuth`, `/auth/callback` with `exchangeCodeForSession`, httpOnly cookies, middleware redirect with `?next=`
- Section 9 (Responsiveness): single-column mobile, `sm:grid-cols-2`, `max-w-content` desktop
- Section 10 (Error handling): inline Zod field errors (`aria-describedby`), toasts for Supabase failures, PDF error toast, `notFound()` for invalid result IDs, `?error=auth_callback_failed` on OAuth failure

**Type consistency:**
- `Goal`: `'lose_weight' | 'gain_muscle'` — consistent across `types/index.ts`, `diet.ts`, all components, and DB `goal` column
- `BMICategory` — consistent in `bmi.ts`, `diet.ts`, `types/index.ts`, and all components
- `DietPlan.meals` keys (`breakfast`, `lunch`, `snack`, `dinner`) — match `MEAL_LABELS` in `ResultStep`, `DietPDFTemplate`, and `ResultDetailPage`
- `SavedResult.diet_plans` typed as array — matches Supabase's one-to-many join response format
