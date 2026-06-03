import type { Goal, BMICategory, DietPlan } from '@/types'

// Formato das dicas: "emoji|Título curto|Explicação simples"
// O emoji fica no ícone, o título aparece em destaque e a explicação logo abaixo.

const MEDICAL_ALERT: DietPlan = {
  meals: {
    breakfast: 'Siga as orientações do seu médico e nutricionista',
    lunch:     'Siga as orientações do seu médico e nutricionista',
    snack:     'Siga as orientações do seu médico e nutricionista',
    dinner:    'Siga as orientações do seu médico e nutricionista',
  },
  tips: [
    '⚠️|Consulte um médico primeiro|Com esse IMC, é obrigatório ter acompanhamento médico e de um nutricionista antes de qualquer dieta',
    '🚫|Sem dietas sozinho|Não corte calorias por conta própria — pode ser perigoso nessa faixa de peso',
    '🏥|Procure um especialista|Marque uma consulta com um clínico geral ou endocrinologista para uma avaliação completa',
    '💚|Saúde antes de tudo|O foco deve ser sua saúde e bem-estar, não só o número na balança',
  ],
}

const PLANS: Record<Goal, Record<BMICategory, DietPlan>> = {
  lose_weight: {
    underweight: {
      meals: {
        breakfast: 'Aveia com banana e mel + 2 Ovos mexidos + Suco de laranja natural',
        lunch:     'Arroz integral + Frango grelhado + Salada verde + Feijão',
        snack:     'Mix de castanhas + 1 Fruta',
        dinner:    'Sopa de legumes com macarrão integral + Queijo cottage',
      },
      tips: [
        '🩺|Fale com um nutricionista|Tentar perder peso quando você já está abaixo do peso normal pode ser prejudicial à saúde',
        '🥗|Qualidade antes de quantidade|Foque em comer bem e de forma variada antes de pensar em cortar calorias',
        '📈|Aumente o que você come aos poucos|Adicione alimentos nutritivos na sua rotina de forma gradual, sem pressa',
        '🧪|Faça exames de sangue|Verifique se não faltam vitaminas ou minerais no seu organismo',
      ],
    },
    normal: {
      meals: {
        breakfast: 'Iogurte grego + Granola caseira + Frutas vermelhas + Café sem açúcar',
        lunch:     'Arroz integral + Peixe assado + Brócolis refogado + Salada colorida',
        snack:     'Maçã + 2 col. sopa de pasta de amendoim integral',
        dinner:    'Omelete de claras com espinafre + 1 fatia de pão integral',
      },
      tips: [
        '🔥|Corte pouco, não tudo|Comer cerca de 300 calorias a menos por dia já é o suficiente — cortes drásticos fazem mal',
        '🚶|Mexa-se com regularidade|150 minutos de caminhada rápida ou ciclismo por semana já faz grande diferença',
        '🥩|Coma proteína suficiente|Entre 1,6 e 2 g de proteína por kg do seu peso por dia ajuda a manter os músculos',
        '💧|Beba água|Tome cerca de 35 ml de água por kg do seu peso ao longo do dia',
      ],
    },
    overweight: {
      meals: {
        breakfast: 'Vitamina de whey com leite de amêndoas + Aveia + 1 Fruta',
        lunch:     'Frango grelhado + Quinoa + Legumes no vapor + Salada verde abundante',
        snack:     'Cenoura e pepino em palitos + Hummus caseiro',
        dinner:    'Filé de peixe assado + Batata-doce pequena + Salada',
      },
      tips: [
        '⚖️|Déficit de 500 calorias|Comer 500 calorias a menos por dia ajuda a perder cerca de 0,5 kg por semana de forma saudável',
        '🚫|Reduza o processado|Diminua pão branco, açúcar, massas e alimentos de pacote',
        '🏋️|Combine cardio e musculação|30 min de cardio 5 dias por semana e academia 3 dias por semana preserva seus músculos',
        '📓|Anote o que você come|Registre sua alimentação por 7 dias para ver onde estão os excessos',
      ],
    },
    obese_1: {
      meals: {
        breakfast: 'Ovos cozidos (2) + 1 fatia de pão integral + 1 Fruta + Chá verde sem açúcar',
        lunch:     'Peito de frango grelhado + Arroz integral (porção reduzida) + Feijão + Salada abundante',
        snack:     'Iogurte natural desnatado + Canela',
        dinner:    'Sopa de legumes sem batata + Proteína magra (atum ou frango desfiado)',
      },
      tips: [
        '⚠️|Consulte um médico antes|Com esse IMC, é muito importante ter orientação profissional antes de começar qualquer dieta',
        '🥦|Evite inflamação|Tire o açúcar, o excesso de glúten e as frituras do dia a dia',
        '🚫|Não corte demais sozinho|Reduzir mais de 750 calorias por dia só é seguro com acompanhamento profissional',
        '📓|Anote o que você come|Registre tudo por 7 dias para entender seus hábitos e encontrar onde melhorar',
      ],
    },
    obese_2: MEDICAL_ALERT,
    obese_3: MEDICAL_ALERT,
  },
  gain_muscle: {
    underweight: {
      meals: {
        breakfast: 'Shake de whey + Aveia + Banana + Pasta de amendoim + Leite integral',
        lunch:     'Arroz branco + Feijão + Carne bovina 200 g + 2 Ovos + Salada',
        snack:     'Pão integral + Peito de frango + 1/2 Abacate',
        dinner:    'Macarrão integral + Atum + Azeite + Parmesão + Salada',
      },
      tips: [
        '🔥|Coma mais do que gasta|Adicione entre 500 e 700 calorias a mais por dia para seu corpo ter energia para construir músculo',
        '🥩|Proteína em cada refeição|Coma entre 2 e 2,5 g de proteína por kg do seu peso, dividido em 4 ou 5 refeições por dia',
        '💪|Treino com evolução|Faça musculação 4 dias por semana e aumente o peso aos poucos, sempre',
        '😴|Durma bem|De 7 a 9 horas de sono por noite é quando seus músculos crescem de verdade',
      ],
    },
    normal: {
      meals: {
        breakfast: 'Ovos mexidos (3) + Aveia com leite + Banana + Café sem açúcar',
        lunch:     'Arroz + Feijão + Carne bovina magra 200 g + Legumes refogados',
        snack:     'Shake de whey + 1 Fruta + Aveia',
        dinner:    'Frango grelhado 200 g + Batata-doce + Brócolis + Azeite',
      },
      tips: [
        '🔥|Coma um pouco mais|Adicione cerca de 300 calorias a mais por dia para ganhar músculo sem acumular gordura',
        '🥩|Proteína espalhada no dia|Coma entre 1,8 e 2,2 g de proteína por kg do seu peso, dividido em 4 ou 5 refeições',
        '💪|Treino de força constante|Faça musculação de 3 a 5 vezes por semana e aumente o peso gradualmente',
        '🌾|Carboidrato na hora certa|Priorize carboidratos antes e depois do treino para ter mais energia e recuperação',
      ],
    },
    overweight: {
      meals: {
        breakfast: 'Iogurte grego proteico + Granola + Frutas + 1 dose de whey',
        lunch:     'Frango grelhado 200 g + Arroz integral + Salada + Feijão',
        snack:     'Queijo cottage + Frutas vermelhas + Nozes',
        dinner:    'Peixe assado 200 g + Legumes no vapor + Batata-doce pequena',
      },
      tips: [
        '⚖️|Recomposição corporal|Coma de 200 a 300 calorias a menos por dia para perder gordura e ganhar músculo ao mesmo tempo',
        '🥩|Proteína alta para preservar músculo|Entre 2 e 2,5 g de proteína por kg do seu peso por dia mantém e constrói músculo mesmo comendo menos',
        '🏋️|Musculação intensa|Treine 4 dias por semana com exercícios que usam o corpo todo (agachamento, supino, remada)',
        '🚴|Cardio leve para o coração|2 ou 3 sessões leves de cardio por semana cuidam do coração sem atrapalhar o ganho muscular',
      ],
    },
    obese_1: {
      meals: {
        breakfast: 'Ovos cozidos (2) + 1 fatia de pão integral + 1 Fruta + Chá sem açúcar',
        lunch:     'Frango grelhado 200 g + Arroz integral (porção pequena) + Salada abundante',
        snack:     'Iogurte grego proteico + Castanhas (30 g)',
        dinner:    'Peixe assado 180 g + Legumes no vapor',
      },
      tips: [
        '⚠️|Acompanhamento obrigatório|Procure um médico e nutricionista antes de começar qualquer protocolo de ganho de massa',
        '📉|Perca gordura primeiro|Reduzir a gordura corporal é mais seguro e melhora os resultados do treino a longo prazo',
        '🥩|Proteína para preservar músculo|Coma entre 1,6 e 2 g de proteína por kg do seu peso para manter e construir músculo aos poucos',
        '🚫|Sem suplementos por conta própria|Evite usar suplementos sem orientação profissional nessa faixa de IMC',
      ],
    },
    obese_2: MEDICAL_ALERT,
    obese_3: MEDICAL_ALERT,
  },
}

export function getDietPlan(goal: Goal, category: BMICategory): DietPlan {
  return PLANS[goal][category]
}
