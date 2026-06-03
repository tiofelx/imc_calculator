import {
  Document, Page, Text, View, StyleSheet,
} from '@react-pdf/renderer'
import type { Goal, BMICategory, DietPlan } from '@/types'
import { getBMILabel } from '@/lib/bmi'

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
  page:        { padding: 48, fontSize: 11, color: '#1A1A2E' },
  header:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, borderBottom: '2px solid #4F46E5', paddingBottom: 12 },
  title:       { fontSize: 22, fontWeight: 700, color: '#4F46E5' },
  subtitle:    { fontSize: 11, color: '#6B7280', marginTop: 2 },
  section:     { marginBottom: 18 },
  sectionTitle:{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#4F46E5' },
  card:        { backgroundColor: '#F8F9FA', borderRadius: 6, padding: 10, marginBottom: 6 },
  mealLabel:   { fontSize: 9, fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', marginBottom: 3 },
  mealText:    { fontSize: 10, lineHeight: 1.5 },
  tip:         { flexDirection: 'row', gap: 4, marginBottom: 4 },
  tipNum:      { fontWeight: 700, color: '#4F46E5', minWidth: 14 },
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
          {dietPlan.tips.map((tip, i) => {
            const pipeIdx = tip.indexOf('|')
            const title  = pipeIdx !== -1 ? tip.slice(0, pipeIdx).trim() : tip
            const detail = pipeIdx !== -1 ? tip.slice(pipeIdx + 1).trim() : null
            return (
              <View key={i} style={[s.tip, { marginBottom: 8 }]}>
                <Text style={s.tipNum}>{i + 1}.</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.mealText, { fontWeight: 700 }]}>{title}</Text>
                  {detail && <Text style={[s.mealText, { color: '#6B7280', marginTop: 2 }]}>{detail}</Text>}
                </View>
              </View>
            )
          })}
        </View>

        <Text style={s.footer}>
          Este plano é uma sugestão educativa e não substitui acompanhamento médico ou nutricional profissional.
        </Text>
      </Page>
    </Document>
  )
}
