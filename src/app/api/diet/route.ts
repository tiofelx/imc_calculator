import { NextRequest } from 'next/server'
import { getDietPlan } from '@/lib/diet'
import type { Goal, BMICategory, DietPlan } from '@/types'

const GOAL_TRANSLATIONS: Record<Goal, string> = {
  lose_weight: 'Perder peso / Emagrecimento',
  gain_muscle: 'Ganhar massa muscular / Hipertrofia',
}

const CATEGORY_TRANSLATIONS: Record<BMICategory, string> = {
  underweight: 'Abaixo do peso',
  normal: 'Peso normal',
  overweight: 'Sobrepeso',
  obese_1: 'Obesidade Grau I',
  obese_2: 'Obesidade Grau II',
  obese_3: 'Obesidade Grau III',
}

function cleanJsonResponse(text: string): string {
  const startIndex = text.indexOf('{')
  const endIndex = text.lastIndexOf('}')
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    return text.substring(startIndex, endIndex + 1)
  }
  return text
}

export async function POST(request: Request) {
  let body: {
    weightKg: number
    heightCm: number
    bmiValue: number
    bmiCategory: BMICategory
    goal: Goal
  }

  try {
    body = await request.json()
  } catch (err) {
    return Response.json({ error: 'Payload JSON inválido.' }, { status: 400 })
  }

  const { weightKg, heightCm, bmiValue, bmiCategory, goal } = body

  // Obter fallback caso falte a API Key ou dê erro
  const fallbackPlan = getDietPlan(goal, bmiCategory)

  const apiKey = process.env.NVIDIA_API_KEY
  const modelName = process.env.NVIDIA_MODEL || 'nvidia/llama-3.3-nemotron-super-49b-v1.5'

  if (!apiKey) {
    console.warn('[NVIDIA API] NVIDIA_API_KEY não configurada. Usando dieta estática de fallback.')
    return Response.json(fallbackPlan)
  }

  const goalStr = GOAL_TRANSLATIONS[goal] || goal
  const categoryStr = CATEGORY_TRANSLATIONS[bmiCategory] || bmiCategory

  const systemPrompt = `Você é um nutricionista esportivo profissional e experiente. Sua tarefa é elaborar um plano de dieta personalizado e não genérico com base no perfil físico e objetivo do usuário.
Retorne SEMPRE e EXCLUSIVAMENTE um objeto JSON válido, sem nenhum tipo de texto adicional antes ou depois do JSON. Não inclua blocos de código com crases (como \`\`\`json) no início ou no fim, apenas o JSON puro.

O JSON deve seguir exatamente a seguinte estrutura:
{
  "meals": {
    "breakfast": "Café da manhã personalizado e detalhado",
    "lunch": "Almoço personalizado e detalhado",
    "snack": "Lanche da tarde personalizado e detalhado",
    "dinner": "Jantar personalizado e detalhado"
  },
  "tips": [
    "Dica 1 no formato emoji|Título curto|Explicação simples",
    "Dica 2 no formato emoji|Título curto|Explicação simples",
    "Dica 3 no formato emoji|Título curto|Explicação simples",
    "Dica 4 no formato emoji|Título curto|Explicação simples"
  ]
}

REGRAS IMPORTANTES PARA O CONTEÚDO:
1. As refeições (meals.breakfast, meals.lunch, meals.snack, meals.dinner) DEVEM conter os alimentos individuais separados pelo caractere " + " (espaço, sinal de mais, espaço) para que o sistema possa renderizar os itens em formato de lista. Exemplo: "Ovos mexidos (2) + Pão integral (2 fatias) + Café sem açúcar".
2. O array "tips" DEVE conter exatamente 4 dicas personalizadas. Cada dica DEVE seguir rigorosamente o formato "emoji|Título Curto|Explicação simples e direta". Exemplo: "🥑|Coma gorduras boas|Adicione abacate, azeite de oliva e castanhas na sua rotina de forma moderada."
3. As refeições e dicas devem ser altamente customizadas para o peso, altura, IMC e objetivo do usuário, fornecendo porções realistas baseadas nas informações do usuário.`

  const userPrompt = `Gere um plano de dieta personalizado para o seguinte perfil de usuário:
- Objetivo: ${goalStr}
- Peso atual: ${weightKg} kg
- Altura: ${heightCm} cm
- Classificação do IMC: ${categoryStr} (Valor do IMC: ${bmiValue})

Por favor, calcule estimativas calóricas adequadas e elabore as refeições Café da Manhã, Almoço, Lanche da Tarde e Jantar contendo alimentos saudáveis e porções exatas.`

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
      // Adicionando um timeout razoável para a API
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`NVIDIA API respondeu com status ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('Nenhum conteúdo retornado da NVIDIA API.')
    }

    const cleanedJson = cleanJsonResponse(content)
    const parsed: DietPlan = JSON.parse(cleanedJson)

    // Validar estrutura para evitar problemas no frontend
    if (!parsed.meals || typeof parsed.meals !== 'object') {
      throw new Error('Formato do objeto meals é inválido.')
    }

    const { breakfast, lunch, snack, dinner } = parsed.meals
    if (
      typeof breakfast !== 'string' ||
      typeof lunch !== 'string' ||
      typeof snack !== 'string' ||
      typeof dinner !== 'string'
    ) {
      throw new Error('Refeições individuais devem ser strings.')
    }

    if (!Array.isArray(parsed.tips) || parsed.tips.length < 4) {
      throw new Error('O array de dicas deve conter pelo menos 4 itens.')
    }

    return Response.json(parsed)
  } catch (error) {
    console.error('[NVIDIA API Error] Falha na geração dinâmica da dieta:', error)
    // Retorna fallback em caso de qualquer falha
    return Response.json(fallbackPlan)
  }
}
