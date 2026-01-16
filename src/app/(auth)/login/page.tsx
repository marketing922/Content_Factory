"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { AuthSidePanel } from "@/components/auth/auth-side-panel"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // States for animation control
  const [isTyping, setIsTyping] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Domain restriction check
    if (!email.endsWith('@calebasse.com')) {
      setError("Seuls les emails @calebasse.com sont autorisés.")
      setLoading(false)
      return
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        // More specific error handling for Supabase Auth
        if (loginError.message.includes("Email not confirmed")) {
          throw new Error("Votre email n'est pas encore confirmé. Veuillez cliquer sur le lien envoyé par mail.")
        }
        throw loginError
      }

      if (data.session) {
        console.log("Login successful, forcing hard redirect...")
        // Using window.location.href is more robust for session cookie propagation to the proxy layer (formerly middleware)
        window.location.href = '/dashboard'
      } else {
        // Fallback if no error but no session
        setError("Erreur inconnue : Session non créée. Vérifiez si votre email doit être confirmé.")
      }
    } catch (err: any) {
      console.error("Login Error:", err)
      setError(err.message === "Invalid login credentials" 
        ? "Email ou mot de passe incorrect." 
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Content Section with Animation */}
      <AuthSidePanel 
        isTyping={isTyping} 
        passwordLength={password.length} 
        showPassword={showPassword} 
      />

      {/* Right Login Section */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
               <Image src="/favicon.png" alt="Logo" width={24} height={24} className="rounded-sm" />
            </div>
            <span className="font-heading">Content Factory</span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2 font-heading text-foreground">Bon retour !</h1>
            <p className="text-muted-foreground text-sm">Entrez votre email @calebasse.com pour continuer</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Professional</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@mail.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                className="h-12 bg-background border-border/60 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                  className="h-12 pr-10 bg-background border-border/60 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer text-muted-foreground"
                >
                  Se souvenir de moi
                </Label>
              </div>
              <a
                href="#"
                className="text-sm text-primary hover:underline font-medium transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400 animate-in fade-in zoom-in-95 duration-200">
                <AlertDescription className="flex items-center gap-2">
                    {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold transition-all shadow-md hover:shadow-primary/20 active:scale-[0.98]" 
              size="lg" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground tracking-wider">
                    Ou continuer avec
                  </span>
                </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full h-12 bg-background border-border/60 hover:bg-accent text-foreground transition-all flex items-center justify-center gap-2"
              type="button"
              disabled={loading}
            >
              <Mail className="size-5" />
              Se connecter avec Google
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-muted-foreground mt-8">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline transition-colors">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
