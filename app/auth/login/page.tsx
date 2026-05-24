'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

function LoginForm() {
  const { signInWithGoogle, loading } = useAuth()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  const handleGoogleLogin = async () => {
    // Store intended destination for callback
    if (typeof window !== 'undefined' && next !== '/dashboard') {
      sessionStorage.setItem('auth_redirect', next)
    }
    await signInWithGoogle()
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm card-glow-hover relative z-10">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/lunar-logo.png"
              alt="LunarScan Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-3xl font-bold text-gradient-primary">LunarScan</span>
          </div>
        </div>
        <CardTitle className="text-xl text-foreground">Welcome to LunarScan</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to explore the Lunar Chain blockchain. View blocks, transactions, and network statistics.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          variant="outline"
          className="w-full h-12 text-base border-border/50 hover:bg-accent hover:border-primary/50 transition-all duration-300"
        >
          {loading ? (
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          ) : (
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>By signing in, you agree to our</p>
          <p className="mt-1">
            <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
            {' & '}
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.15_195_/_0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.65_0.18_280_/_0.08),transparent_50%)]" />

      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
