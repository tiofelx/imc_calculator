# IMC Calculator — Design Spec
**Data:** 2026-06-01  
**Status:** Aprovado pelo usuário

---

## 1. Visão Geral

Sistema web de autocuidado que calcula o IMC do usuário e gera recomendações de dieta personalizadas com base no objetivo (perder peso ou ganhar massa muscular). O usuário faz login com Google, passa por um fluxo multi-step guiado, visualiza seu resultado com um gauge animado, baixa a dieta em PDF e acompanha sua evolução histórica no dashboard.

**Plataforma:** Web app (Next.js), com visão de evolução para mobile (React Native).  
**Usuário-alvo:** Pessoas que querem começar uma jornada de saúde e precisam de orientação prática e visual.

---

## 2. Fluxo da Aplicação (User Journey)

```
[Landing Page]
      ↓
[Login com Google]  ←────────────────────────────────┐
      ↓                                               │
[Calculadora — Step 1: Seleção de Objetivo]          │
  • Card "Perder Peso"  |  Card "Ganhar Massa"        │
      ↓                                               │
[Calculadora — Step 2: Dados]                        │
  • Campo Peso (kg) + Campo Altura (cm)               │
  • Botão "Calcular meu IMC"                         │
      ↓                                               │
[Calculadora — Step 3: Resultado + Recomendações]    │
  • Gauge circular animado com valor do IMC          │
  • Badge de classificação                           │
  • 4 cards de refeições (café/almoço/lanche/jantar) │
  • Lista de dicas personalizadas                    │
  • Botão "Baixar Dieta em PDF"                      │
  • Botão "Salvar no histórico"                      │
      ↓                                               │
[Dashboard]  ────────────────────────────────────────┘
  • Boas-vindas com avatar do Google
  • Gráfico de evolução do IMC
  • Lista de cálculos anteriores
```

**Rotas Next.js (App Router):**

| Rota | Descrição |
|------|-----------|
| `/` | Landing page com CTA |
| `/login` | Login social Google (Supabase Auth) |
| `/calculator` | Fluxo multi-step (objetivo → dados → resultado) |
| `/dashboard` | Histórico e evolução do IMC |
| `/result/[id]` | Resultado salvo específico |

---

## 3. Arquitetura Técnica

### Stack Principal

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Auth + DB | Supabase |
| Animações | Framer Motion (150–300ms micro, ≤400ms complexas) |
| Gráficos | Recharts |
| PDF | @react-pdf/renderer (geração client-side) |
| Formulários | React Hook Form + Zod |
| Ícones | Lucide React (SVG consistente) |
| Deploy | Vercel |

### Estrutura de Pastas

```
src/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── login/page.tsx            ← Login Google
│   ├── calculator/page.tsx       ← Fluxo multi-step
│   ├── dashboard/page.tsx        ← Histórico
│   └── result/[id]/page.tsx      ← Resultado salvo
├── components/
│   ├── ui/                       ← shadcn/ui base components
│   ├── calculator/
│   │   ├── GoalStep.tsx          ← Cards de objetivo
│   │   ├── DataStep.tsx          ← Campos peso + altura
│   │   ├── ResultStep.tsx        ← Gauge + recomendações
│   │   └── ProgressBar.tsx       ← Barra de progresso multi-step
│   ├── dashboard/
│   │   ├── BMIChart.tsx          ← Gráfico de evolução
│   │   └── HistoryList.tsx       ← Lista de cálculos
│   └── pdf/
│       └── DietPDFTemplate.tsx   ← Template do PDF exportável
├── lib/
│   ├── supabase.ts               ← Cliente Supabase (browser + server)
│   ├── bmi.ts                    ← Cálculo IMC + classificação
│   └── diet.ts                   ← Matriz de recomendações
└── types/
    └── index.ts                  ← Tipos TypeScript compartilhados
```

---

## 4. Modelo de Dados (Supabase PostgreSQL)

### Tabelas

```sql
-- Gerenciada pelo Supabase Auth
users (
  id          uuid PRIMARY KEY,
  email       text,
  name        text,
  avatar_url  text
)

-- Cada cálculo de IMC realizado
bmi_records (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg    decimal(5,2) NOT NULL,
  height_cm    decimal(5,1) NOT NULL,
  bmi_value    decimal(5,2) NOT NULL,
  bmi_category text NOT NULL,
  goal         text NOT NULL,
  created_at   timestamptz DEFAULT now()
)

-- Plano de dieta vinculado a um cálculo
diet_plans (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bmi_record_id  uuid REFERENCES bmi_records(id) ON DELETE CASCADE,
  meals          jsonb NOT NULL,
  tips           text[] NOT NULL,
  created_at     timestamptz DEFAULT now()
)
```

### Enum: bmi_category

| Valor | Faixa IMC | Label exibida |
|-------|-----------|---------------|
| `underweight` | < 18.5 | Abaixo do peso |
| `normal` | 18.5–24.9 | Peso normal |
| `overweight` | 25–29.9 | Sobrepeso |
| `obese_1` | 30–34.9 | Obesidade Grau I |
| `obese_2` | 35–39.9 | Obesidade Grau II |
| `obese_3` | ≥ 40 | Obesidade Grau III |

### Row Level Security (RLS)
- Usuários leem e escrevem somente seus próprios `bmi_records` e `diet_plans`.
- Política: `auth.uid() = user_id`.

---

## 5. Lógica de Recomendação de Dieta

Matriz **objetivo × classificação IMC** → plano de dieta + dicas:

| IMC \ Objetivo | Perder Peso | Ganhar Massa |
|----------------|-------------|--------------|
| Abaixo do peso | Dieta balanceada hipercalórica moderada + alerta nutricional | Hipercalórica + alto teor proteico + treino progressivo |
| Normal | Déficit calórico leve (-300 kcal) + cardio moderado | Superávit moderado (+300 kcal) + treino de força |
| Sobrepeso | Déficit calórico (-500 kcal) + low carb + cardio | Déficit leve + preservação muscular + proteína alta |
| Obesidade I | Déficit rigoroso + alimentação anti-inflamatória + alerta médico | Acompanhamento médico obrigatório |
| Obesidade II/III | Alerta médico prioritário + dieta supervisionada | Alerta médico prioritário + dieta supervisionada |

Cada célula produz `{ meals: { breakfast, lunch, snack, dinner }, tips: string[] }` via `getDietPlan(goal, bmiCategory)` em `lib/diet.ts`.

---

## 6. Design System (UI/UX Pro Max)

### Paleta de Cores (Tokens Semânticos)

```css
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
```

Todos os pares texto/fundo atingem contraste WCAG AA (ratio ≥ 4.5:1).

### Tipografia

| Uso | Fonte | Peso | Tamanho |
|-----|-------|------|---------|
| Títulos | Inter | 700–800 | 32–48px |
| Subtítulos | Inter | 600 | 20–24px |
| Corpo | Inter | 400 | 16px |
| Labels | Inter | 500 | 14px |

Line height: 1.5 (corpo), 1.2 (títulos). Max line length: 65ch.

### Animações

| Tipo | Duração | Easing |
|------|---------|--------|
| Hover / micro-interação | 150ms | ease-out |
| Transição de step | 300ms | ease-in-out |
| Gauge de IMC (entrada) | 800ms | spring |
| Toast / feedback | 200ms | ease-out |

### Touch & Acessibilidade

- Elementos interativos mínimo 44×44px, espaçamento ≥ 8px entre alvos.
- Focus rings visíveis em inputs e botões.
- ARIA labels em ícones sem texto. `role="progressbar"` na barra de steps.
- `<label>` explícito em todos os campos. Erros inline com `aria-describedby`.

---

## 7. Componentes Principais

### GoalStep
Dois cards grandes (empilhados mobile, lado a lado desktop). Estado selecionado: borda colorida + scale 1.02 + sombra. Animação 150ms ease-out.

### DataStep
Campos Peso (kg) e Altura (cm) com validação Zod (peso 20–300, altura 50–250). Botão "Calcular meu IMC" com loading spinner durante salvamento.

### ResultStep
Gauge SVG circular animado (spring 800ms), badge de classificação com cor semântica, 4 cards de refeições, lista de dicas, botão PDF (download client-side), botão Salvar.

### DietPDFTemplate
Documento A4: header com logo + data, dados do usuário (nome/IMC/objetivo), 4 seções de refeição, dicas numeradas, footer com aviso médico.

### BMIChart
`LineChart` Recharts com linha de referência para faixa normal, tooltip com data+valor+classificação, `ResponsiveContainer`.

---

## 8. Autenticação

- `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- Callback em `/auth/callback` (route handler).
- Sessão via cookies httpOnly (Supabase SSR helpers).
- Middleware protege `/calculator` e `/dashboard` — redirect para `/login` se não autenticado.

---

## 9. Responsividade

| Breakpoint | Layout |
|------------|--------|
| < 640px | Single column, cards empilhados |
| 640–1024px | 2 colunas nos cards de objetivo |
| > 1024px | Centralizado max-width 800px |

---

## 10. Tratamento de Erros

| Cenário | Comportamento |
|---------|--------------|
| Falha no login Google | Toast de erro + "Tentar novamente" |
| Campos inválidos | Mensagem inline + borda vermelha |
| Falha no Supabase | Toast de erro, estado local mantido |
| Rota protegida sem auth | Redirect `/login?returnUrl=...` |
| Erro ao gerar PDF | Toast "Não foi possível gerar o PDF." |

---

## 11. Fora do Escopo (v1)

- Notificações / lembretes push
- Integração com wearables
- Cálculo de TMB
- Planos de treino
- Plano premium / pagamento
- App mobile nativo (fase futura)
