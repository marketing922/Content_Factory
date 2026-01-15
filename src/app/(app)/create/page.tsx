"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, UploadCloud, FileText, Sparkles, X, Settings2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  prompt: z.string().min(20, "Le prompt doit contenir au moins 20 caractères."),
  language: z.enum(["fr", "cn"]),
  length: z.enum(["short", "medium", "long"]),
  tone: z.enum(["educational", "promotional", "inspiring", "technical"]),
  files: z.array(z.any()).optional(),
})

export default function CreateArticlePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      language: "fr",
      length: "medium",
      tone: "educational",
      files: [],
    },
  })

  // Dropzone setup
  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles])
    form.setValue("files", [...uploadedFiles, ...acceptedFiles])
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    
    try {
        // 1. Save to Supabase
        const { data, error } = await supabase
            .from('articles')
            .insert({
                topic: values.prompt,
                parameters: {
                    language: values.language,
                    length: values.length,
                    tone: values.tone
                },
                status: 'draft',
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error
        if (!data) throw new Error("No data returned")

        const articleId = data.id

        // 2. Trigger n8n Webhook via Proxy (avoids CORS)
        // We trigger without awaiting to speed up the transition to the article page
        // where the user will see the progress loader.
        fetch('/api/n8n', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'start',
                article_id: articleId,
                ...values
            })
        }).catch(err => console.error("N8N Trigger failed:", err));

        // 3. Redirect to Article Page IMMEDIATELY
        router.push(`/article/${articleId}`)

    } catch (e) {
        console.error("Error creating article:", e)
        setIsGenerating(false)
        // You might want to show a toast error here
    }
  }

  return (
    <div className="w-full pb-32 px-6 lg:px-10">
      <div className="mb-8 space-y-2 pt-6">
        <h1 className="text-3xl font-bold font-heading text-foreground">Créer un nouvel article</h1>
        <p className="text-muted-foreground text-lg">Définissez votre sujet et laissez l&apos;IA rédiger du contenu de qualité pour vous.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Top Toolbar: Parameters */}
          <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm sticky top-4 z-30">
             <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Settings2 className="h-5 w-5" />
                    <span className="hidden md:inline">Paramètres de rédaction</span>
                </div>
                <div className="flex flex-1 gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                     <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem className="flex-1 min-w-[140px] space-y-0">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-10 bg-background border-border/50">
                                    <SelectValue placeholder="Langue" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                                  <SelectItem value="cn">🇨🇳 Chinois</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                         <FormField
                          control={form.control}
                          name="tone"
                          render={({ field }) => (
                            <FormItem className="flex-1 min-w-[180px] space-y-0">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-10 bg-background border-border/50">
                                    <SelectValue placeholder="Ton" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="educational">🎓 Éducatif & Expert</SelectItem>
                                  <SelectItem value="promotional">📣 Promotionnel</SelectItem>
                                  <SelectItem value="inspiring">✨ Inspirant & Lifestyle</SelectItem>
                                  <SelectItem value="technical">🔬 Technique / TCM</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="length"
                          render={({ field }) => (
                            <FormItem className="flex-1 min-w-[150px] space-y-0">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-10 bg-background border-border/50">
                                    <SelectValue placeholder="Longueur" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="short">Court (~500 mots)</SelectItem>
                                  <SelectItem value="medium">Moyen (~1000 mots)</SelectItem>
                                  <SelectItem value="long">Long (~2000 mots)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                </div>
             </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="grid gap-6">
            
            {/* Prompt Area */}
            <Card className="border-border/50 shadow-sm flex flex-col min-h-[500px]">
                <CardContent className="p-0 flex-1 flex flex-col">
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem className="flex-1 flex flex-col space-y-0 h-full">
                                <FormControl>
                                    <Textarea 
                                        placeholder="Commencez à décrire votre article ici... (Sujet, angle, mots-clés, structure souhaitée)" 
                                        className="flex-1 w-full h-full min-h-[400px] text-lg p-6 bg-transparent border-0 focus-visible:ring-0 resize-none leading-relaxed placeholder:text-muted-foreground/50"
                                        {...field} 
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="px-6 py-3 border-t border-border/30 flex justify-between items-center bg-muted/10 text-xs text-muted-foreground">
                        <span>Markdown supporté</span>
                        <span>{form.watch("prompt").length}/2000 caractères</span>
                    </div>
                </CardContent>
            </Card>

            {/* Documents - Optional */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground ml-2">Documents de référence (Optionnel)</h3>
                <Card className="border-border/50 shadow-sm bg-muted/10">
                    <CardContent className="p-0">
                             <div 
                                {...getRootProps()} 
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col sm:flex-row items-center justify-center gap-4 cursor-pointer transition-all duration-200
                                    ${isDragActive 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-transparent hover:border-primary/30 hover:bg-muted/30'
                                    }`}
                             >
                                <input {...getInputProps()} />
                                <div className="p-3 rounded-full bg-background border shadow-sm text-muted-foreground">
                                    <UploadCloud className="h-6 w-6" />
                                </div>
                                <div className="text-center sm:text-left space-y-1">
                                    <p className="font-medium text-foreground">Ajouter des fichiers contextuels</p>
                                    <p className="text-xs text-muted-foreground">Glissez-déposez ou cliquez (PDF, DOCX)</p>
                                </div>
                             </div>

                             {uploadedFiles.length > 0 && (
                                <div className="border-t border-border/50 p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 bg-background border border-border/50 rounded-md group relative">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="text-sm truncate flex-1">{file.name}</span>
                                            <button 
                                                type="button" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUploadedFiles(prev => prev.filter((_, idx) => idx !== i));
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             )}
                    </CardContent>
                </Card>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-40 lg:pl-[260px]">
             <div className="max-w-6xl mx-auto flex justify-between items-center px-4 lg:px-0">
                <Button variant="ghost" type="button" className="text-muted-foreground hover:text-foreground">
                    Annuler
                </Button>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                        {isGenerating ? "Rédaction en cours..." : "Prêt à rédiger ?"}
                    </span>
                    <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isGenerating || form.watch("prompt").length < 20} 
                        className="bg-primary hover:bg-primary/90 text-white min-w-[180px] shadow-lg shadow-primary/20"
                    >
                        {isGenerating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Générer
                    </Button>
                </div>
             </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
