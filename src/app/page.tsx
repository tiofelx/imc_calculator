'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Activity,
  Calculator,
  Salad,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  FileDown,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">IMC Calculator</span>
          </div>
          <Link href="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all">
              Entrar
            </Button>
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 grid md:grid-cols-2 gap-14 items-center">

        {/* Left: copy */}
        <motion.div initial="hidden" animate="visible" className="space-y-7">
          <motion.span
            custom={0} variants={fadeUp}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Gratuito para começar
          </motion.span>

          <motion.h1
            custom={1} variants={fadeUp}
            className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight"
          >
            Calcule seu IMC,<br />
            <span className="text-indigo-600">transforme sua saúde.</span>
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp}
            className="text-lg text-slate-500 max-w-md leading-relaxed"
          >
            Descubra seu Índice de Massa Corporal e receba um plano alimentar
            personalizado com base no seu perfil. Simples, preciso e gratuito.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 text-base gap-2 shadow-lg shadow-indigo-200/60 transition-all"
              >
                Começar agora <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <span className="text-sm text-slate-400">Sem cartão de crédito</span>
          </motion.div>

          <motion.ul custom={4} variants={fadeUp} className="flex flex-col gap-2 pt-1">
            {['Resultado instantâneo', 'Plano exportável em PDF', 'Histórico de progresso'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: BMI result card mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          className="relative"
        >
          {/* ambient glow */}
          <div className="absolute inset-4 bg-indigo-300/20 rounded-3xl blur-3xl pointer-events-none" />

          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 space-y-5">
            {/* Card header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seu resultado</span>
              <span className="text-xs bg-green-50 text-green-600 font-semibold px-2.5 py-1 rounded-full border border-green-100">
                Peso Normal
              </span>
            </div>

            {/* Big IMC number */}
            <div className="text-center py-3">
              <div className="text-8xl font-black text-slate-900 tabular-nums leading-none">22.4</div>
              <div className="text-sm text-slate-400 mt-2 font-medium">IMC</div>
            </div>

            {/* Scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-1">
                <span>Baixo</span><span>Normal</span><span>Sobrepeso</span><span>Obeso</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: '100%', background: 'linear-gradient(to right, #60a5fa, #34d399, #fb923c, #f87171)' }}
                />
              </div>
              {/* marker */}
              <div className="relative h-3">
                <div
                  className="absolute w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-md -top-1"
                  style={{ left: 'calc(45% - 7px)' }}
                />
              </div>
            </div>

            {/* Diet suggestion */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1.5">
                <Salad className="w-4 h-4 text-indigo-600" />
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Plano Alimentar</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Dieta equilibrada com <strong>2.100 kcal/dia</strong>, rica em proteínas e fibras vegetais.
              </p>
            </div>

            {/* Export hint */}
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
              <FileDown className="w-3.5 h-3.5" />
              Exportar resultado em PDF
            </div>
          </div>
        </motion.div>
      </section>


      {/* ── How it works ── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">Como funciona</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Três passos para sua saúde
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Informe seus dados',
                desc: 'Insira seu peso, altura e informações básicas. O processo leva menos de 1 minuto.',
              },
              {
                step: '02',
                title: 'Calcule seu IMC',
                desc: 'Nosso algoritmo classifica seu resultado com base nas diretrizes da OMS.',
              },
              {
                step: '03',
                title: 'Receba seu plano',
                desc: 'Obtenha um plano alimentar personalizado e exporte o resultado em PDF.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-indigo-100 select-none leading-none mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">Recursos</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Tudo que você precisa
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: 'Cálculo Preciso',
                desc: 'Metodologia validada pela OMS com categorias detalhadas por faixa etária e gênero.',
                iconBg: 'bg-indigo-50',
                iconColor: 'text-indigo-600',
                hoverBorder: 'hover:border-indigo-200',
              },
              {
                icon: Salad,
                title: 'Plano Alimentar',
                desc: 'Recomendações nutricionais personalizadas com base no seu IMC e objetivos de saúde.',
                iconBg: 'bg-green-50',
                iconColor: 'text-green-500',
                hoverBorder: 'hover:border-green-200',
              },
              {
                icon: TrendingUp,
                title: 'Acompanhe o Progresso',
                desc: 'Visualize sua evolução ao longo do tempo com gráficos e histórico completo.',
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-500',
                hoverBorder: 'hover:border-blue-200',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`rounded-2xl border border-slate-100 p-8 hover:shadow-xl ${feature.hoverBorder} transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 py-20 md:py-24">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 text-center space-y-7">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Pronto para transformar sua saúde?
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Junte-se a milhares de pessoas que já descobriram seu IMC e deram o primeiro passo rumo ao bem-estar.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50 h-12 px-10 text-base font-semibold shadow-xl gap-2 transition-all"
            >
              Criar conta grátis <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-indigo-300 text-sm">Sem cartão de crédito · Acesso imediato</p>
          <p className="text-indigo-300/60 text-xs pt-6 border-t border-indigo-500/40 w-full text-center">
            © 2026 IMC Calculator. Todos os direitos reservados.
          </p>
        </div>
      </section>

    </div>
  )
}
