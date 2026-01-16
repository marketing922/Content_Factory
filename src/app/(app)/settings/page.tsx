"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useProfile } from "@/hooks/use-profile"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Loader2, Moon, Sun, Monitor, Globe, Bell, ShieldCheck, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"


import { useTranslation } from "@/hooks/use-translation"

export default function SettingsPage() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { profile, fetchProfile, updateProfile } = useProfile()
  const [fullName, setFullName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [tokenStats, setTokenStats] = useState({
    total: 0,
    research: 0,
    writing: 0,
    evaluation: 0,
    hasData: false
  })
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const init = async () => {
      await fetchProfile()
      setLoading(false)
    }
    init()
  }, [fetchProfile])

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name)
    }
  }, [profile])

  useEffect(() => {
    const fetchUsage = async () => {
        try {
            const { data } = await supabase
                .from('articles')
                .select('token_usage')
                .not('token_usage', 'is', null)
            
            if (data && data.length > 0) {
                let total = 0, research = 0, writing = 0, evaluation = 0;
                
                data.forEach(article => {
                    const usage = article.token_usage as any;
                    research += usage.research || 0;
                    writing += usage.writing || 0;
                    evaluation += usage.evaluation || 0;
                    total += usage.total || (research + writing + evaluation);
                });

                setTokenStats({ total, research, writing, evaluation, hasData: true });
            }
        } catch (e) {
            console.error(e);
        }
    }
    fetchUsage()
  }, [])

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      await updateProfile({ full_name: fullName })
      toast.success("Profil mis à jour avec succès !")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas ou sont vides.")
        return
    }

    try {
        setIsUpdatingPassword(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) throw error
        toast.success("Mot de passe mis à jour !")
        setNewPassword("")
        setConfirmPassword("")
    } catch (error: any) {
        toast.error(error.message || "Erreur lors de la mise à jour du mot de passe")
    } finally {
        setIsUpdatingPassword(false)
    }
  }

  if (loading || !mounted) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 pb-16 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold font-heading">{t.settings.title}</h2>
        <p className="text-muted-foreground">
          {t.settings.desc}
        </p>
      </div>
      <Separator className="bg-border/50" />
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="profile">{t.settings.tabs.profile}</TabsTrigger>
            <TabsTrigger value="preferences">{t.settings.tabs.preferences}</TabsTrigger>
            <TabsTrigger value="tokens">{t.settings.tabs.tokens}</TabsTrigger>
            <TabsTrigger value="security">{t.settings.tabs.security}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">{t.settings.profile.title}</CardTitle>
                    <CardDescription>{t.settings.profile.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-3">
                        <Label htmlFor="name" className="text-sm font-medium">{t.settings.profile.nameLabel}</Label>
                        <Input 
                            id="name" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Votre nom" 
                            className="h-11 bg-background"
                        />
                    </div>
                    <div className="grid gap-3 opacity-60">
                        <Label htmlFor="email" className="text-sm font-medium">{t.settings.profile.emailLabel}</Label>
                        <Input 
                            id="email" 
                            value={profile?.email || ""} 
                            placeholder="votre@email.com" 
                            disabled 
                            className="h-11 bg-muted/50 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-muted-foreground italic">{t.settings.profile.emailDesc}</p>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-4">
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 px-6">
                        {isSaving && <Loader2 className="size-4 animate-spin" />}
                        {t.common.save}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">{t.settings.appearance.title}</CardTitle>
                    <CardDescription>{t.settings.appearance.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Theme Toggle */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium">{t.settings.appearance.themeTitle}</Label>
                        <div className="grid grid-cols-3 gap-4">
                           <button 
                                onClick={() => setTheme("light")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 hover:border-border text-muted-foreground'}`}
                           >
                                <Sun className="size-5" />
                                <span className="text-xs font-medium">{t.settings.appearance.themes.light}</span>
                           </button>
                           <button 
                                onClick={() => setTheme("dark")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 hover:border-border text-muted-foreground'}`}
                           >
                                <Moon className="size-5" />
                                <span className="text-xs font-medium">{t.settings.appearance.themes.dark}</span>
                           </button>
                           <button 
                                onClick={() => setTheme("system")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 hover:border-border text-muted-foreground'}`}
                           >
                                <Monitor className="size-5" />
                                <span className="text-xs font-medium">{t.settings.appearance.themes.system}</span>
                           </button>
                        </div>
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Language Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Globe className="size-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">{t.settings.appearance.langTitle}</Label>
                            </div>
                            <p className="text-xs text-muted-foreground">{t.settings.appearance.langDesc}</p>
                        </div>
                        <select 
                            value={profile?.language || "fr"}
                            onChange={async (e) => {
                                const newLang = e.target.value;
                                try {
                                    await updateProfile({ language: newLang });
                                    toast.success(`Langue mise à jour : ${newLang.toUpperCase()}`);
                                } catch (err) {
                                    toast.error("Erreur lors du changement de langue");
                                }
                            }}
                            className="bg-background border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 ring-primary/20"
                        >
                            <option value="fr">Français (FR)</option>
                            <option value="en">English (EN)</option>
                            <option value="zh">Chinois (ZH)</option>
                        </select>
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Notification Switch */}
                    <div className="flex items-center justify-between">
                         <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Bell className="size-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">{t.settings.appearance.notifTitle}</Label>
                            </div>
                            <p className="text-xs text-muted-foreground">{t.settings.appearance.notifDesc}</p>
                         </div>
                         <Switch 
                            checked={profile?.notifications_enabled ?? true} 
                            onCheckedChange={async (checked) => {
                                try {
                                    await updateProfile({ notifications_enabled: checked });
                                    toast.success(checked ? "Notifications activées" : "Notifications désactivées");
                                } catch (err) {
                                    toast.error("Erreur lors de la mise à jour des notifications");
                                }
                            }}
                         />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="tokens" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/20">
                    <CardTitle className="text-xl">{t.settings.usage.title}</CardTitle>
                    <CardDescription>{t.settings.usage.desc}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-6 space-y-8">
                        {/* Summary */}
                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">{t.settings.usage.total}</span>
                                <div className="text-4xl font-bold tracking-tight text-primary">
                                    {tokenStats.hasData ? tokenStats.total.toLocaleString() : "0"} <span className="text-lg font-medium text-muted-foreground underline decoration-dotted decoration-border/50">{t.settings.usage.tokens}</span>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1">
                                {t.settings.usage.plan}
                            </Badge>
                        </div>

                        {/* Visual bars */}
                        <div className="space-y-6">
                             <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{t.settings.usage.research}</span>
                                    <span className="text-muted-foreground font-jetbrains text-[10px]">{tokenStats.hasData ? tokenStats.research.toLocaleString() : "0"} tk</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: tokenStats.hasData ? `${(tokenStats.research / tokenStats.total) * 100}%` : '0%' }}
                                        className="bg-indigo-500 h-full transition-all" 
                                    />
                                </div>
                             </div>

                             <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium font-heading">{t.settings.usage.writing}</span>
                                    <span className="text-muted-foreground font-jetbrains text-[10px]">{tokenStats.hasData ? tokenStats.writing.toLocaleString() : "0"} tk</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: tokenStats.hasData ? `${(tokenStats.writing / tokenStats.total) * 100}%` : '0%' }}
                                        className="bg-emerald-500 h-full transition-all" 
                                    />
                                </div>
                             </div>

                             <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{t.settings.usage.eval}</span>
                                    <span className="text-muted-foreground font-jetbrains text-[10px]">{tokenStats.hasData ? tokenStats.evaluation.toLocaleString() : "0"} tk</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: tokenStats.hasData ? `${(tokenStats.evaluation / tokenStats.total) * 100}%` : '0%' }}
                                        className="bg-orange-500 h-full transition-all" 
                                    />
                                </div>
                             </div>
                        </div>

                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-3">
                            <Zap className="size-5 text-primary shrink-0 mt-0.5" />
                            <div className="text-xs leading-relaxed text-muted-foreground">
                                <strong className="text-foreground">{t.settings.usage.note.split(':')[0]}:</strong>{t.settings.usage.note.split(':')[1]}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="size-5 text-primary" />
                        <CardTitle className="text-xl">{t.settings.security.title}</CardTitle>
                    </div>
                    <CardDescription>{t.settings.security.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">{t.settings.security.newPass}</Label>
                            <Input 
                                id="new-password" 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••" 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">{t.settings.security.confirmPass}</Label>
                            <Input 
                                id="confirm-password" 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••" 
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-4">
                    <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} className="gap-2 px-6">
                        {isUpdatingPassword && <Loader2 className="size-4 animate-spin" />}
                        {t.settings.security.updateBtn}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
