import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BMIChart from '@/components/dashboard/BMIChart'
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
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-10">
      <div className="w-full max-w-[800px] mx-auto space-y-8">
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
              <h1 className="font-extrabold text-[#1A1A2E] text-xl">
                Olá, {(user.user_metadata?.full_name as string)?.split(' ')[0] ?? 'usuário'}!
              </h1>
              <p className="text-sm text-[#6B7280]">Seu painel de evolução</p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="ghost" size="sm" className="text-[#6B7280] gap-2">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </form>
        </div>

        {latest && (
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-6 text-white">
            <p className="text-sm opacity-80 mb-1">Último IMC calculado</p>
            <p className="text-5xl font-extrabold">{latest.bmi_value.toFixed(1)}</p>
            <p className="text-sm opacity-90 mt-1">
              {new Date(latest.created_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
            </p>
          </div>
        )}

        <Link
          href="/calculator"
          className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-base text-white inline-flex items-center justify-center transition-colors"
        >
          <Plus className="mr-2 h-5 w-5" /> Novo cálculo de IMC
        </Link>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#1A1A2E] text-lg mb-4">Evolução do IMC</h2>
          <BMIChart records={typedRecords} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[#1A1A2E] text-lg mb-2">Histórico de cálculos</h2>
          <HistoryList records={typedRecords} />
        </div>
      </div>
    </main>
  )
}
