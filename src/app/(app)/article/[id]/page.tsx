"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Editor } from "@/components/editor"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
    CheckCircle2, 
    AlertCircle, 
    RotateCcw, 
    ArrowLeft, 
    Save, 
    RefreshCcw,
    Sparkles,
    Settings2,
    Loader2,
    FileText,
    Download,
    ChevronDown,
    Languages,
    Globe,
    PenTool,
    History as HistoryIcon,
    Search,
    Clock,
    MessageSquare,
    Send
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// I will create these components next, providing placeholders for now if needed, 
// but sticking to modularity, I'll write them in this turn or next.
// Ideally I import them. I'll define them in separate files for cleanliness.
// For now I'll stub them or expect them to exist. 
// I'll assume I create them immediately after.
import { QualityCard } from "@/components/article/quality-card"
import { ResearchCard } from "@/components/article/research-card"
import { TOCCard } from "@/components/article/toc-card"
import Link from "next/link"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"


export default function ArticlePage() {
  const params = useParams()
  const [isGenerating, setIsGenerating] = useState(false)
  const [article, setArticle] = useState<any>(null)
  const [selectedAxis, setSelectedAxis] = useState("")
  const [articleModRequest, setArticleModRequest] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [manualCloseTranslating, setManualCloseTranslating] = useState(false)

  const handleTranslate = async (language: string) => {
    if (!article?.id) return
    setIsTranslating(true)
    setManualCloseTranslating(false)
    
    try {
        const translationPromise = fetch('/api/n8n', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'translate',
                article_id: article.id,
                target_language: language,
                current_status: article.status
            })
        })

        toast.promise(
            translationPromise,
            {
                loading: `Tradication vers ${language.toUpperCase()}...`,
                success: "Demande de traduction envoyée !",
                error: (err) => {
                    setIsTranslating(false);
                    return "Le service de traduction (n8n) ne répond pas. Vérifiez qu'il est bien lancé et accessible.";
                }
            }
        )
        
        const response = await translationPromise;
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erreur serveur lors de la demande de traduction");
        }
        
    } catch (error) {
        console.error("Translation error:", error);
        setIsTranslating(false);
    }
    // Note: We don't setIsTranslating(false) in .finally() here because 
    // the actual translation is async in background (n8n).
    // We only reset it if the initial request fails.
    // If it succeeds, the realtime 'translating' status from Supabase takes over.
  }
  
    const [lastUpdate, setLastUpdate] = useState<number>(0)
    const [activeTab, setActiveTab] = useState("plan")
    
    // Fetch initial data
    useEffect(() => {
        if (!params.id) return

        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', params.id)
                .single()
            
            if (data) {
                setArticle(data)
                // Initial tab selection
                if (['generating_plan', 'researching', 'waiting_validation'].includes(data.status)) {
                    setActiveTab("plan")
                } else if (['writing', 'generating', 'published', 'completed', 'done'].includes(data.status)) {
                    setActiveTab("article")
                }
            }
            if (error) console.error("Error fetching article:", error)
        }

        fetchArticle()

    // Realtime subscription
        const channel = supabase
            .channel(`article-${params.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'articles',
                    filter: `id=eq.${params.id}`
                },
                (payload) => {
                    const newRecord = payload.new;
                    console.log("[DEBUG] Realtime Update Received:", newRecord);
                    
                    setArticle((prev: any) => {
                        const updated = { ...prev, ...newRecord };
                        // Trigger pulse animation
                        setLastUpdate(Date.now());
                        return updated;
                    });
                    
                    // Sync loading states
                    if (newRecord.status) {
                        // If it enters a state that means "active work", keep loading
                        if (['generating_plan', 'researching', 'generating', 'writing', 'translating'].includes(newRecord.status)) {
                            setIsGenerating(true);
                        } else {
                            setIsGenerating(false);
                        }
                    }

                    if (newRecord.translation_status && newRecord.translation_status !== 'translating') {
                        setManualCloseTranslating(false);
                        setIsTranslating(false);
                    }
                }
            )
            .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
  }, [params.id])

  const handleExport = (format: 'docx' | 'pdf') => {
    if (!article?.content) return

    const title = article.topic || 'Article'
    const content = article.content

    if (format === 'docx') {
      const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${title}</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; }
            h1 { color: #111827; }
            p { line-height: 1.6; }
        </style>
        </head><body>
        <h1>${title}</h1>
        ${content}
        </body></html>`
      
      const blob = new Blob(['\ufeff', header], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/\s+/g, '_')}.doc`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // PDF via browser print
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
                h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 30px; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              ${content}
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }
  const lastStatus = useRef<string | null>(null)

  // Sync tab with status
  useEffect(() => {
    const status = article?.status;
    if (!status) return

    console.log("[DEBUG] Status Watcher:", status, "Last:", lastStatus.current);

    // Show toasts only on transition (not on load)
    if (lastStatus.current && status !== lastStatus.current) {
        if (status === 'waiting_validation') toast.success("Structure du plan prête !", { description: "Veuillez valider le plan pour lancer la rédaction." });
        if (status === 'writing') toast.info("Validation reçue", { description: "L'IA commence la rédaction finale." });
        if (status === 'published') toast.success("Article finalisé !", { description: "Votre contenu est prêt." });
    }
    lastStatus.current = status;

    // Logic: 
    // - Researching/Generating Plan/Initial -> Plan Tab (with loader)
    // - Waiting Validation -> Plan Tab (with TOC)
    // - Writing/Published -> Article Tab
    if (['draft', 'generating', 'generating_plan', 'researching', 'waiting_validation'].includes(status)) {
        if (activeTab !== "plan") setActiveTab("plan")
    } else if (['writing', 'published'].includes(status)) {
        if (activeTab !== "article") setActiveTab("article")
    }
  }, [article?.status])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
        {/* Header - Fixed Height */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md z-20">
            {/* ... header content ... */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold font-heading text-foreground line-clamp-2 max-w-[600px] leading-tight" title={article?.topic}>
                            {article ? (article.table_of_contents?.title || article.title || article.topic) : "Chargement..."}
                        </h1>
                        <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-[10px] pointer-events-none uppercase">
                            {article?.parameters?.language === 'fr' ? 'Version Française' : 
                             article?.parameters?.language === 'en' ? 'Version Anglaise' : 
                             article?.parameters?.language === 'cn' ? 'Version Chinoise' : 'Version Inconnue'}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 p-1 px-2 rounded-full bg-muted/30 border border-border/40 mr-2">
                    {isTranslating ? (
                        <Loader2 className="h-3.5 w-3.5 text-primary animate-spin mr-1" />
                    ) : (
                        <Languages className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                    )}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={isTranslating}
                        className={`h-7 px-2.5 text-[10px] rounded-full transition-all ${article?.parameters?.language === 'fr' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'hover:bg-muted text-muted-foreground'}`}
                        onClick={() => handleTranslate('fr')}
                    >
                        FR
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={isTranslating}
                        className={`h-7 px-2.5 text-[10px] rounded-full transition-all ${article?.parameters?.language === 'en' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'hover:bg-muted text-muted-foreground'}`}
                        onClick={() => handleTranslate('en')}
                    >
                        EN
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={isTranslating}
                        className={`h-7 px-2.5 text-[10px] rounded-full transition-all ${article?.parameters?.language === 'cn' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'hover:bg-muted text-muted-foreground'}`}
                        onClick={() => handleTranslate('cn')}
                    >
                        CN
                    </Button>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <HistoryIcon className="mr-2 h-4 w-4" />
                            Historique
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] border-l border-border/40 bg-card/95 backdrop-blur-xl">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <HistoryIcon className="h-5 w-5 text-primary" />
                                Historique des modifications
                            </SheetTitle>
                            <SheetDescription>
                                Suivez l&apos;évolution de votre article et les différentes étapes de génération.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-8 space-y-6">
                            <div className="relative pl-8 border-l border-border/50 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[37px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background shadow-sm" />
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold text-foreground">Version Actuelle</span>
                                            <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5">Actif</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {article?.status === 'published' ? 'Article finalisé et prêt à l\'export' : 'En cours de rédaction/révision'}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2 font-mono">
                                            <Clock className="h-3 w-3" />
                                            {new Date().toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[37px] top-0 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                                    <div className="space-y-1 opacity-60">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-foreground">Génération Initiale</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Lancement du processus par l&apos;IA</p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-2 font-mono">
                                            <Clock className="h-3 w-3" />
                                            {article ? new Date(article.created_at).toLocaleDateString() : '-'} à {article ? new Date(article.created_at).toLocaleTimeString() : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-primary/80 leading-relaxed italic">
                                &ldquo;Note : L&apos;IA conserve une trace de chaque itération. Vous pourrez bientôt revenir à une version précédente du plan ou du contenu.&rdquo;
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="h-4 w-px bg-border/50" />
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-muted hover:bg-muted/80 text-foreground"
                    onClick={async () => {
                        if (!article) return
                        await fetch('/api/n8n', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                action: 'validate',
                                article_id: article.id, 
                            })
                        })
                        setArticle((prev: any) => ({ ...prev, status: 'writing' }))
                    }}
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Régénérer
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                            <Save className="mr-2 h-4 w-4" />
                            Sauvegarder
                            <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleExport('docx')}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger .docx
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger .pdf
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="text-primary font-medium"
                            onClick={async () => {
                                if (!article) return
                                await fetch('/api/n8n', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ 
                                        action: 'save_to_drive',
                                        article_id: article.id, 
                                    })
                                })
                                // Feedback to user could be added here
                            }}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Sauvegarder sur Drive
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>

        {/* Content Split - Flexible remaining height */}
        <div className="flex flex-1 overflow-hidden">
            {/* Left: Editor Area with Tabs */}
            <main className="flex-1 overflow-hidden relative group flex flex-col">
                <AnimatePresence>
                    {/* Rédaction / Loading Overlay */}
                    {(isGenerating || article?.status === 'writing' || article?.status === 'generating' || article?.status === 'generating_plan' || article?.status === 'researching') && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-card border border-primary/20 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-5 max-w-sm"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                                    <PenTool className="h-12 w-12 text-primary relative animate-pulse" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold font-heading">
                                        {article?.status === 'writing' || article?.status === 'generating' ? "L'IA rédige votre article..." :
                                         article?.status === 'generating_plan' ? "L'IA restructure le plan..." :
                                         article?.status === 'researching' ? "Recherches en cours..." :
                                         "Traitement en cours..."}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {article?.status === 'writing' || article?.status === 'generating' ? "Exploration des sources et rédaction de la version finale haute-fidélité." :
                                         article?.status === 'generating_plan' ? "Analyse de votre demande et réorganisation de la structure." :
                                         "Nos agents travaillent sur votre demande."}
                                    </p>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                                    <motion.div 
                                        className="h-full bg-primary"
                                        animate={{ x: [-200, 400] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    />
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-50">
                                    Temps estimé : ~2 minutes 
                                </p>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Traduction Overlay */}
                    {((isTranslating || article?.status === 'translating') && !manualCloseTranslating) && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-card border border-primary/20 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                                    <Languages className="h-10 w-10 text-primary relative animate-bounce" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-lg font-bold font-heading">Traduction intelligente...</h3>
                                    <p className="text-sm text-muted-foreground">L&apos;IA adapte le ton et le style vers la langue cible.</p>
                                </div>
                                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-primary"
                                        animate={{ x: [-200, 200] }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    />
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="mt-2 text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => setManualCloseTranslating(true)}
                                >
                                    Fermer l&apos;aperçu
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="px-12 pt-6 flex justify-between items-center border-b border-border/10 bg-background/50 backdrop-blur-sm z-10 flex-shrink-0">
                        <TabsList className="bg-transparent border-b-0 gap-8 h-12 p-0">
                            <TabsTrigger 
                                value="plan" 
                                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 text-base font-medium h-full transition-none"
                            >
                                Structure du Plan
                            </TabsTrigger>
                            <TabsTrigger 
                                value="article" 
                                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 text-base font-medium h-full transition-none"
                            >
                                Article
                            </TabsTrigger>
                        </TabsList>
                        
                        {article?.status === 'waiting_validation' && (
                            <Button 
                                size="sm"
                                className="mb-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                onClick={async () => {
                                    await fetch('/api/n8n', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ 
                                            action: 'validate',
                                            article_id: article.id, 
                                            validated_title: article.table_of_contents?.title,
                                            validated_toc: article.table_of_contents,
                                            language: article.parameters?.language,
                                            tone: article.parameters?.tone,
                                            word_count: article.parameters?.length ? parseInt(article.parameters.length.match(/(\d+)/)?.[0] || '800') : 800
                                        })
                                    })
                                    setArticle((prev: any) => ({ ...prev, status: 'writing' }))
                                    toast.success("Rédaction lancée !", { description: "L'IA utilise maintenant vos choix pour rédiger." })
                                }}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirmer et Lancer la rédaction
                            </Button>
                        )}
                    </div>

                    <ScrollArea className="flex-1 h-full relative">
                        {/* Status Change Pulse Effect */}
                        <AnimatePresence>
                            {Date.now() - lastUpdate < 2000 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 pointer-events-none bg-primary/5 border-2 border-primary/20 rounded-2xl animate-pulse"
                                />
                            )}
                        </AnimatePresence>

                        <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32">
                            <TabsContent value="plan" className="mt-0 focus-visible:outline-none">
                                {article?.table_of_contents ? (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <TOCCard 
                                            toc={article.table_of_contents} 
                                            planOptions={article.plan_options}
                                            status={article.status}
                                            isGenerating={isGenerating || article.status === 'generating_plan' || article.status === 'researching'}
                                            onSelectAxis={setSelectedAxis}
                                            onUpdateTOC={async (newTOC) => {
                                                // Local update for immediate feedback
                                                setArticle((prev: any) => ({ ...prev, table_of_contents: newTOC }));
                                                
                                                // Debounced persistence to DB
                                                // (Using a simple timeout for debounce if we don't want to add lodash)
                                                if ((window as any)._tocTimeout) clearTimeout((window as any)._tocTimeout);
                                                (window as any)._tocTimeout = setTimeout(async () => {
                                                    console.log("[DEBUG] Persisting TOC update to DB...");
                                                    const { error } = await supabase
                                                        .from('articles')
                                                        .update({ table_of_contents: newTOC })
                                                        .eq('id', article.id);
                                                    
                                                    if (error) {
                                                        console.error("Error updating TOC:", error);
                                                        toast.error("Échec de la sauvegarde locale du plan");
                                                    } else {
                                                        // Signal a "silent" update to trigger the pulse if we want
                                                        setLastUpdate(Date.now());
                                                    }
                                                }, 1000);
                                            }}
                                            onRegenerate={async (axis) => {
                                                setIsGenerating(true)
                                                setArticle((prev: any) => ({ ...prev, status: 'generating_plan' })) // Optimistic status
                                                try {
                                                    // Parse word count from string (e.g., "Long (1500 - 2000 mots)" -> 1500)
                                                    const wordCountMatch = (article.parameters?.length || "").match(/(\d+)/);
                                                    const wordCount = wordCountMatch ? parseInt(wordCountMatch[0]) : 800; // Default fallback

                                                    const promise = fetch('/api/n8n', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ 
                                                            action: 'regenerate_axis',
                                                            article_id: article.id,
                                                            axe: axis,
                                                            language: article.parameters?.language,
                                                            word_count: wordCount,
                                                            tone: article.parameters?.tone
                                                        })
                                                    });

                                                    await toast.promise(
                                                        promise,
                                                        {
                                                            loading: 'Lancement de la régénération du plan...',
                                                            success: 'Régénération lancée ! Le plan va se mettre à jour sous peu.',
                                                            error: 'Erreur lors du lancement de la régénération.'
                                                        }
                                                    );
                                                    
                                                    // Status update is handled via Realtime or logic above
                                                } catch (e) {
                                                    console.error(e)
                                                    setIsGenerating(false)
                                                    // Maybe revert status here?
                                                }
                                            }}
                                            onModificationRequest={async (req, file) => {
                                                setIsGenerating(true)
                                                setArticle((prev: any) => ({ ...prev, status: 'generating_plan' })) // Optimistic status
                                                try {
                                                    await toast.promise(
                                                        fetch('/api/n8n', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ 
                                                                action: 'modify_plan',
                                                                article_id: article.id,
                                                                request: req,
                                                                file: file
                                                            })
                                                        }),
                                                        {
                                                            loading: 'Analyse de votre requête...',
                                                            success: 'Requête transmise à l\'agent !',
                                                            error: 'Erreur lors de l\'envoi'
                                                        }
                                                    )
                                                } catch (e) {
                                                    setIsGenerating(false)
                                                    // Revert or error handling
                                                }
                                            }}
                                        />
                                    </div>
                                ) : ['generating_plan', 'researching', 'generating', 'draft'].includes(article?.status || '') ? (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <div className="text-center">
                                            <p className="font-medium text-foreground">Préparation de  la structure...</p>
                                            <p className="text-sm text-muted-foreground mt-1">Status: {article?.status?.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground/50 border border-dashed rounded-2xl">
                                        <FileText className="h-12 w-12 mb-4 opacity-20" />
                                        <p>Aucun plan généré pour le moment</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="article" className="mt-0 focus-visible:outline-none">
                                {article?.content ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12 pb-40">
                                        <div className="prose-container">
                                            <Editor 
                                                content={(() => {
                                                    const raw = article.content || '';
                                                    try {
                                                        let clean = raw;
                                                        // If raw content is a full HTML doc, try to extract body
                                                        if (raw.includes('<html') || raw.includes('<!DOCTYPE html>')) {
                                                            const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                                                            if (bodyMatch && bodyMatch[1]) {
                                                                clean = bodyMatch[1].trim();
                                                            }
                                                        }
                                                        
                                                    // Cleaning Logic v3: Handle "Preamble Metadata" vs "Footer Metadata"
                                                    const cleanLower = clean.toLowerCase();
                                                    let finalContent = clean;
                                                    
                                                    // 1. Check for "ARTICLE COMPLET" marker (Preamble case)
                                                    if (cleanLower.includes("article complet")) {
                                                        const parts = clean.split(/ARTICLE COMPLET/i);
                                                        if (parts.length > 1) {
                                                            // We take the last part which is the main article
                                                            let mainContent = parts[parts.length - 1];
                                                            
                                                            // Cleanup: Often "ARTICLE COMPLET" is inside an <h1> or <h2>.
                                                            // The split leaves the closing tag at the start of mainContent, e.g. "</h1><p>..."
                                                            // We remove any leading closing tags like </h1>, </h2>, </p>, </div>
                                                            mainContent = mainContent.replace(/^[\s\r\n]*<\/[^>]+>/, '').trim();
                                                            
                                                            // Also remove any immediate opening <br> or empty paragraphs
                                                            mainContent = mainContent.replace(/^[\s\r\n]*(?:<br\s*\/?>|<p>\s*<\/p>)/i, '').trim();

                                                            if (mainContent.length > 300) {
                                                                finalContent = mainContent;
                                                            }
                                                        }
                                                    } 
                                                    // 2. Fallback: Check for Footer Metadata (Footer case)
                                                    else {
                                                        const anchors = ["article id :", "score :", "seo :"];
                                                        let maxAnchorIndex = -1;
                                                        
                                                        for (const anchor of anchors) {
                                                            const idx = cleanLower.lastIndexOf(anchor);
                                                            if (idx > maxAnchorIndex) {
                                                                maxAnchorIndex = idx;
                                                            }
                                                        }
                                                        
                                                        if (maxAnchorIndex !== -1) {
                                                            const metaIdx = cleanLower.lastIndexOf("métadonnées", maxAnchorIndex);
                                                            if (metaIdx !== -1 && metaIdx > clean.length * 0.4) {
                                                                const potentialCut = clean.substring(0, metaIdx).trim();
                                                                if (potentialCut.length > 300) {
                                                                    finalContent = potentialCut;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    
                                                    // Final Cleanup: Strip all inline styles to fix "immense font" issues
                                                    // This now applies to ALL content paths (Preamble, Footer, or None)
                                                    return finalContent.trim().replace(/ style="[^"]*"/g, '').replace(/ style='[^']*'/g, '');

                                                } catch (e) {
                                                    return raw;
                                                }
                                            })()} 
                                            />
                                        </div>

                                        {/* Fixed Floating Article Modification Request Box */}
                                        <AnimatePresence>
                                            {(article?.content && !['writing', 'researching', 'generating', 'generating_plan'].includes(article?.status) && !isGenerating) && (
                                                <motion.div 
                                                    initial={{ y: 100, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: 100, opacity: 0 }}
                                                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4"
                                                >
                                                    <div className="p-1 rounded-2xl bg-gradient-to-br from-primary/30 via-background/80 to-primary/20 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md">
                                                        <div className="bg-card/40 p-3 rounded-[14px] space-y-3">
                                                            <div className="flex items-center justify-between px-1">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                                                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                                                    </div>
                                                                    <h4 className="text-xs font-bold text-foreground">Éditeur Assistant</h4>
                                                                </div>
                                                                <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary border-primary/10 px-1.5 h-4">Beta</Badge>
                                                            </div>
                                                            <div className="relative group">
                                                                <Textarea 
                                                                    value={articleModRequest}
                                                                    onChange={(e) => setArticleModRequest(e.target.value)}
                                                                    placeholder="Ex: 'Humanise le ton', 'Plus de détails sur...'" 
                                                                    className="bg-background/50 border-border/40 focus:ring-primary/20 pr-12 text-sm min-h-[44px] max-h-[120px] py-2 px-3 resize-none shadow-inner leading-relaxed rounded-xl transition-all border-2 focus:border-primary/30"
                                                                    onKeyDown={async (e) => {
                                                                        if (e.key === 'Enter' && !e.shiftKey && articleModRequest.trim()) {
                                                                            e.preventDefault();
                                                                            const req = articleModRequest;
                                                                            setArticleModRequest("");
                                                                            setIsGenerating(true)
                                                                            setArticle((prev: any) => ({ ...prev, status: 'writing' }))
                                                                            try {
                                                                                await toast.promise(
                                                                                    fetch('/api/n8n', {
                                                                                        method: 'POST',
                                                                                        headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({ 
                                                                                            action: 'modify_article',
                                                                                            article_id: article.id,
                                                                                            instructions: req
                                                                                        })
                                                                                    }),
                                                                                    {
                                                                                        loading: 'Amélioration en cours...',
                                                                                        success: 'Votre demande a été prise en compte !',
                                                                                        error: 'Erreur lors de l\'envoi'
                                                                                    }
                                                                                )
                                                                            } finally {
                                                                                // Automatic disappearance is handled by !isGenerating in the condition above
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                                <div className="absolute right-1.5 bottom-1.5">
                                                                    <Button 
                                                                        size="icon" 
                                                                        className="h-7 w-7 shadow-lg hover:scale-105 transition-transform bg-primary"
                                                                        onClick={async () => {
                                                                            if (!articleModRequest.trim()) return;
                                                                            const req = articleModRequest;
                                                                            setArticleModRequest("");
                                                                            setIsGenerating(true)
                                                                            setArticle((prev: any) => ({ ...prev, status: 'writing' }))
                                                                            try {
                                                                                await toast.promise(
                                                                                    fetch('/api/n8n', {
                                                                                        method: 'POST',
                                                                                        headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({ 
                                                                                            action: 'modify_article',
                                                                                            article_id: article.id,
                                                                                            instructions: req
                                                                                        })
                                                                                    }),
                                                                                    {
                                                                                        loading: 'Amélioration en cours...',
                                                                                        success: 'Votre demande a été prise en compte !',
                                                                                        error: 'Erreur lors de l\'envoi'
                                                                                    }
                                                                                )
                                                                            } finally {
                                                                                // Automatic disappearance handled by AnimatePresence
                                                                            }
                                                                        }}
                                                                        disabled={!articleModRequest.trim() || isGenerating}
                                                                    >
                                                                        <Send className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : ['writing', 'researching', 'generating', 'generating_plan'].includes(article?.status || '') ? (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <div className="text-center">
                                            <p className="font-medium text-foreground">Contenu en cours de rédaction...</p>
                                            <p className="text-sm text-muted-foreground mt-1">Status: {article?.status?.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground/50 border border-dashed rounded-2xl">
                                        <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                                        <p>L&apos;article apparaîtra ici après validation du plan</p>
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </ScrollArea>
                </Tabs>
                
                {/* Floating indicator removed for "superflu" cleanup */}
            </main>

            {/* Right: Sidebar */}
            <aside className="w-[380px] h-full border-l border-border/40 bg-card/30 backdrop-blur-sm flex flex-col z-10 overflow-hidden">
                <Tabs defaultValue="quality" className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-shrink-0 px-6 py-4 border-b border-border/40">
                        <TabsList className="w-full bg-muted/50 p-1 h-auto flex flex-wrap gap-1">
                            <TabsTrigger value="quality" className="flex-1 text-[10px] py-1.5 px-1 truncate">Qualité</TabsTrigger>
                            <TabsTrigger value="research" className="flex-1 text-[10px] py-1.5 px-1 truncate">Analyse</TabsTrigger>
                            <TabsTrigger value="sources" className="flex-1 text-[10px] py-1.5 px-1 truncate">Sources</TabsTrigger>
                            <TabsTrigger value="metadata" className="flex-1 text-[10px] py-1.5 px-1 truncate">Infos</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <ScrollArea className="flex-1 h-full">
                        <TabsContent value="quality" className="p-6 space-y-6 mt-0 pb-12 overflow-visible">
                           {(() => {
                                let evaluation = article?.evaluation_details;
                                
                                // Step 1: Deep parsing if it's a string
                                if (typeof evaluation === 'string' && evaluation.trim().startsWith('{')) {
                                    try {
                                        evaluation = JSON.parse(evaluation);
                                    } catch (e) {
                                        console.error("QualityCard: Error parsing evaluation_details string", e);
                                    }
                                }

                                // Step 2: Extract from possible nesting (AI often wraps things)
                                if (evaluation && typeof evaluation === 'object') {
                                    // If it's wrapped in another "evaluation_details" or "evaluation" key
                                    if (evaluation.evaluation_details) evaluation = evaluation.evaluation_details;
                                    else if (evaluation.evaluation) evaluation = evaluation.evaluation;
                                    
                                    // If it's an array with one element
                                    if (Array.isArray(evaluation) && evaluation.length > 0) evaluation = evaluation[0];
                                }

                                const hasCriteria = Array.isArray(evaluation?.criteria) && evaluation.criteria.length > 0;
                                
                                return hasCriteria ? (
                                    <QualityCard evaluation={evaluation} score={article?.score} />
                                ) : (
                                    <div className="p-4 text-sm text-muted-foreground text-center border border-dashed rounded-lg">
                                        {article?.score ? (
                                            <div className="space-y-2">
                                                <div className="text-2xl font-bold text-primary">{article.score}/100</div>
                                                <p className="text-xs uppercase tracking-wider font-semibold opacity-50">Score Global</p>
                                                <p className="mt-4 text-[11px] italic">Détails d&apos;évaluation en cours de chargement ou non disponibles pour cet article.</p>
                                            </div>
                                        ) : (
                                            <div className="py-8 space-y-3">
                                                <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary/40" />
                                                <span>En attente d&apos;évaluation...</span>
                                            </div>
                                        )}
                                    </div>
                                );
                           })()}
                           
                           {/* Modification Suggestions - Removed per user request */}
                        </TabsContent>

                        <TabsContent value="sources" className="p-6 mt-0 space-y-6 pb-12 overflow-visible">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <h3 className="text-sm font-semibold">Sources Web consultées</h3>
                                </div>
                                {(() => {
                                    let sources = article?.sources
                                    if (typeof sources === 'string') {
                                        try {
                                            sources = JSON.parse(sources)
                                        } catch (e) {
                                            sources = []
                                        }
                                    }
                                    if (!Array.isArray(sources)) sources = []

                                    return sources.length > 0 ? (
                                    <div className="grid gap-3">
                                        {sources.map((source: any, i: number) => (
                                            <a 
                                                key={i} 
                                                href={source.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="block p-3 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center text-[9px] border-primary/20 text-primary flex-shrink-0">{i+1}</Badge>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <div className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors">
                                                            {source.title || "Document sans titre"}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground/60 break-all group-hover:text-muted-foreground transition-colors overflow-visible">
                                                            {source.url}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center border border-dashed rounded-2xl bg-muted/20">
                                        <p className="text-xs text-muted-foreground">Aucune source listée spécifiquement.</p>
                                    </div>
                                    )})()}
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="research" className="p-6 mt-0 space-y-6 pb-12 overflow-visible">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Approfondir la recherche..." 
                                        className="pl-9 h-10 bg-muted/30 border-border/40 focus:bg-background transition-all"
                                        onKeyDown={async (e) => {
                                            if (e.key === 'Enter' && article) {
                                                const query = (e.currentTarget as HTMLInputElement).value;
                                                if (!query) return;
                                                await fetch('/api/n8n', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ 
                                                        action: 'research',
                                                        article_id: article.id,
                                                        query: query
                                                    })
                                                });
                                                // Could add a toast here
                                            }
                                        }}
                                    />
                                </div>

                                {article?.search_synthesis ? (
                                    <ResearchCard research={article.search_synthesis} />
                                ) : (
                                    <div className="p-8 text-center border border-dashed rounded-2xl bg-muted/20">
                                        <div className="p-3 rounded-full bg-background border border-border/50 w-fit mx-auto mb-3">
                                            <Search className="h-5 w-5 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">Aucune donnée de recherche</p>
                                        <p className="text-xs text-muted-foreground/60 mt-1">Utilisez la barre ci-dessus pour lancer une analyse ou attendez la synthèse initiale.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="metadata" className="p-6 mt-0 space-y-6 pb-12 overflow-visible">
                            <div className="p-4 rounded-lg border border-border/50 bg-card">
                                <h3 className="text-sm font-medium mb-4 flex items-center gap-2 text-primary">
                                    <Sparkles className="h-4 w-4" /> Statut & Date
                                </h3>
                                <div className="space-y-4 text-xs">
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">ID Unique</span>
                                        <span className="font-mono opacity-50 text-[10px]">{article?.id?.slice(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Date</span>
                                        <span className="font-medium">{article ? new Date(article.created_at).toLocaleDateString() : '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Heure</span>
                                        <span className="font-medium">{article ? new Date(article.created_at).toLocaleTimeString() : '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-muted-foreground">Statut</span>
                                        <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">
                                            {article?.status?.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
     
                            <div className="p-4 rounded-lg border border-border/50 bg-card">
                                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                                    <Settings2 className="h-4 w-4" /> Configuration
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Ton</span>
                                        <span className="font-medium capitalize">{article?.parameters?.tone || '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Langue</span>
                                        <span className="font-medium uppercase">{article?.parameters?.language || '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Longueur</span>
                                        <span className="font-medium capitalize">{article?.parameters?.length || '-'}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-muted-foreground">Mots</span>
                                        <span className="font-medium">{article?.content?.split(' ').length || 0} mots</span>
                                    </div>
                                </div>
                            </div>

                            {/* Token Usage Breakdown */}
                            <div className="p-4 rounded-lg border border-border/50 bg-card">
                                <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                                    <RotateCcw className="h-4 w-4" /> Consommation (Tokens)
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-1 text-xs">
                                        <span className="text-muted-foreground">Recherche</span>
                                        <span className="font-medium">{article?.token_usage?.research?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="flex justify-between py-1 text-xs">
                                        <span className="text-muted-foreground">Rédaction</span>
                                        <span className="font-medium">{article?.token_usage?.writing?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="flex justify-between py-1 text-xs">
                                        <span className="text-muted-foreground">Évaluation</span>
                                        <span className="font-medium">{article?.token_usage?.evaluation?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="h-px bg-border/50 my-1" />
                                    <div className="flex justify-between py-1 font-semibold text-primary">
                                        <span>Total</span>
                                        <span>{article?.token_usage?.total?.toLocaleString() || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </aside>
        </div>
    </div>
  )
}
