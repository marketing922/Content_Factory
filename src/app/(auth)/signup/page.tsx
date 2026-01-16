"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { AuthSidePanel } from "@/components/auth/auth-side-panel"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // States for animation control
  const [isTyping, setIsTyping] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Domain restriction
    if (!email.endsWith('@calebasse.com')) {
      setError("Seuls les emails @calebasse.com sont autorisés.")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
              username: username,
              full_name: fullName,
              avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
            },
          },
      })

      if (error) throw error
      if (data.user) setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription")
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
            <span className="font-heading text-foreground">Content Factory</span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2 font-heading text-foreground">Créer un compte</h1>
            <p className="text-muted-foreground text-sm">Rejoignez Content Factory dès aujourd'hui</p>
          </div>
          
           {success ? (
             <div className="text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-inner">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Compte créé avec succès ! ✨</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Bienvenue chez Content Factory. 
                        <br/>Si la confirmation par email est activée sur votre compte, n'oubliez pas de cliquer sur le lien reçu. Sinon, vous pouvez vous connecter immédiatement.
                    </p>
                </div>
                <div className="pt-4">
                    <Link href="/login">
                        <Button variant="outline" className="w-full h-12 font-medium hover:bg-muted transition-colors">Retour à la connexion</Button>
                    </Link>
                </div>
             </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Nom</Label>
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="Jean Dupont"
                        value={fullName}
                        autoComplete="name"
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                        required
                        className="h-12 bg-background border-border/60 focus:border-primary transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="jdupont"
                        value={username}
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                        required
                        minLength={3}
                        className="h-12 bg-background border-border/60 focus:border-primary transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
                  minLength={6}
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

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400 animate-in fade-in zoom-in-95 duration-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold transition-all shadow-md hover:shadow-primary/20 active:scale-[0.98]" 
              size="lg" 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Création du compte..." : "S'inscrire"}
            </Button>
          </form>
        )}

        {!success && (
            <div className="text-center text-sm text-muted-foreground mt-8">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline transition-colors">
                Se connecter
                </Link>
            </div>
        )}
        </div>
      </div>
    </div>
  )
}
