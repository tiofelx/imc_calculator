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
