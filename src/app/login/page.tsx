'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

function isSafePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\')
}

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const raw     = searchParams.get('next') ?? '/dashboard'
  const nextUrl = isSafePath(raw) ? raw : '/dashboard'
  const error   = searchParams.get('error')

  useEffect(() => {
    if (error === 'auth_callback_failed') {
      toast.error('Erro ao conectar com Google. Tente novamente.')
    }
  }, [error])

  async function handleGoogleLogin() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
      },
    })
    if (error) {
      toast.error('Erro ao conectar com Google. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FF6B35] to-[#FF8E53] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mx-auto mb-6">
          <Activity className="h-8 w-8 text-[#FF6B35]" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">IMC Autocuidado</h1>
        <p className="text-[#6B7280] mb-8">
          Faça login para calcular seu IMC e receber recomendações personalizadas.
        </p>

        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          size="lg"
          className="w-full h-14 text-base font-bold bg-[#FF6B35] hover:bg-[#FF8E53] rounded-xl gap-3"
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

        <p className="mt-6 text-xs text-[#6B7280]">
          Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-[#FF6B35] to-[#FF8E53] flex items-center justify-center" />
    }>
      <LoginContent />
    </Suspense>
  )
}
