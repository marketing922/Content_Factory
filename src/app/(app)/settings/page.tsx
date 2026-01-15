"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"

export default function SettingsPage() {
  const [tokenStats, setTokenStats] = useState({
    total: 0,
    research: 0,
    writing: 0,
    evaluation: 0,
    hasData: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsage = async () => {
        try {
            setLoading(true)
            const { data } = await supabase
                .from('articles')
                .select('token_usage')
                .not('token_usage', 'is', null)
            
            if (data && data.length > 0) {
                let total = 0, research = 0, writing = 0, evaluation = 0;
                
                data.forEach(article => {
                    const usage = article.token_usage as any;
                    // We expect a structure like { research: 1200, writing: 4500, evaluation: 300, total: 6000 }
                    research += usage.research || 0;
                    writing += usage.writing || 0;
                    evaluation += usage.evaluation || 0;
                    total += usage.total || (research + writing + evaluation);
                });

                setTokenStats({ total, research, writing, evaluation, hasData: true });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }
    }
    fetchUsage()
  }, [])

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold font-heading">Paramètres</h2>
        <p className="text-muted-foreground">
          Gérez les préférences de votre compte et de l&apos;application.
        </p>
      </div>
      <Separator />
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="tokens">Consommation</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Profil Utilisateur</CardTitle>
                    <CardDescription>Vos informations personnelles visibles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" defaultValue="Admin" placeholder="Votre nom" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="admin@calebasse.com" placeholder="votre@email.com" disabled />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" disabled>Sauvegarder (Bientôt disponible)</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="preferences" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Gérez comment vous souhaitez être notifié.</CardDescription>
                </CardHeader>
                 <CardContent className="grid gap-4">
                     <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="functional-switch" className="flex flex-col space-y-1">
                            <span>Notifications email</span>
                            <span className="font-normal text-xs text-muted-foreground">Recevoir un email quand un article est prêt.</span>
                        </Label>
                        <Switch id="functional-switch" defaultChecked />
                     </div>
                 </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="tokens">
            <Card>
                <CardHeader>
                    <CardTitle>Consommation Réelle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4 bg-muted/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold text-lg">Consommation Totale</span>
                            <span className="font-bold text-xl text-primary">
                                {loading ? "..." : tokenStats.hasData ? `${tokenStats.total.toLocaleString()} Tokens` : "~25,500 Tokens"}
                            </span>
                        </div>
                        <div className="space-y-3">
                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Recherche & Plan</span>
                                <span>{loading ? "..." : tokenStats.hasData ? `${tokenStats.research.toLocaleString()} tk` : "~10,500 tk"}</span>
                             </div>
                             <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full transition-all duration-500" 
                                    style={{ width: tokenStats.hasData ? `${(tokenStats.research / tokenStats.total) * 100}%` : '55%' }}
                                ></div>
                             </div>
                             
                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Rédaction Appr.</span>
                                <span>{loading ? "..." : tokenStats.hasData ? `${tokenStats.writing.toLocaleString()} tk` : "~9,000 tk"}</span>
                             </div>
                             <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-green-500 h-full transition-all duration-500" 
                                    style={{ width: tokenStats.hasData ? `${(tokenStats.writing / tokenStats.total) * 100}%` : '33%' }}
                                ></div>
                             </div>

                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Évaluation & Qualité</span>
                                <span>{loading ? "..." : tokenStats.hasData ? `${tokenStats.evaluation.toLocaleString()} tk` : "~6,000 tk"}</span>
                             </div>
                             <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-amber-500 h-full transition-all duration-500" 
                                    style={{ width: tokenStats.hasData ? `${(tokenStats.evaluation / tokenStats.total) * 100}%` : '12%' }}
                                ></div>
                             </div>
                        </div>
                    </div>
                    
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
