"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Hash, Lightbulb, Link2, Layout, Sparkles, BookOpen, ExternalLink, ShieldCheck, Zap } from "lucide-react"

interface ResearchCardProps {
    research: any;
}

export function ResearchCard({ research: rawResearch }: ResearchCardProps) {
    // 1. Initial Parsing logic
    let research: any = rawResearch;
    if (typeof research === 'string') {
        try {
            research = JSON.parse(research);
        } catch (e) {
            console.error("Failed to parse research synthesis:", e);
            return (
                <div className="p-8 text-center border border-dashed rounded-2xl bg-muted/20">
                    <p className="text-sm text-muted-foreground italic">Données de recherche corrompues ou illisibles.</p>
                </div>
            )
        }
    }

    if (!research || Object.keys(research).length === 0) return null

    // 2. Normalization / Helpers
    const ensureArray = (val: any) => (Array.isArray(val) ? val : []);
    
    // Extract TOC
    const toc = research.toc || research.table_of_contents || null;
    
    // Extract Sources (handle different names)
    const sources = ensureArray(research.sources_detailed || research.sources || research.all_sources);
    
    // Extract Plan Options
    const planOptions = research.plan_options || null;

    // Extract Keywords (handle object vs array)
    let seoKeywords: string[] = [];
    if (research.keywords) {
        const k = research.keywords;
        seoKeywords = [...ensureArray(k.primary), ...ensureArray(k.secondary), ...ensureArray(k.long_tail)];
    } else {
        seoKeywords = ensureArray(research.seo_keywords);
    }

    // Extract Concepts
    let keyConcepts: string[] = [];
    if (research.concepts) {
        const c = research.concepts;
        keyConcepts = [...ensureArray(c.main_topics), ...ensureArray(c.subtopics)];
    } else {
        keyConcepts = ensureArray(research.key_concepts);
    }
    
    const relatedTerms = research.concepts?.related_terms ? ensureArray(research.concepts.related_terms) : [];

    // Extract New Fields (from latest n8n schema)
    const importantPoints = ensureArray(research.important_points);
    const keyStatistics = ensureArray(research.key_statistics);
    const uniqueAngles = ensureArray(research.unique_angles);
    const commonQuestions = ensureArray(research.common_questions);
    const searchPerformed = research.search_performed || null;

    return (
        <div className="space-y-8 pb-10">
            {/* Header Summary */}
            <div className="px-1">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Laboratoire d&apos;Analyse IA
                </h2>
                <p className="text-sm text-muted-foreground mt-1 font-medium italic opacity-70">
                    Synthèse exhaustive des sources et orientations stratégiques
                </p>
            </div>

            {/* Section: Synthesis Summary (MOVED TO TOP) */}
            {research.sources_summary && (
                <div className="space-y-4 pt-2">
                     <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-3 w-3" /> Synthèse Labo
                    </h4>
                    <div className="text-sm text-foreground/80 leading-relaxed bg-primary/5 p-6 rounded-2xl border border-primary/10 italic relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                        &ldquo;{research.sources_summary}&rdquo;
                    </div>
                </div>
            )}

            {/* Section: Search Performed */}
            {searchPerformed && ensureArray(searchPerformed.serpapi_queries).length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Search className="h-3 w-3 text-primary" />
                        Recherches effectuées sur le Web
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ensureArray(searchPerformed.serpapi_queries).map((query: string, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-muted/30 text-muted-foreground font-normal border-none whitespace-normal h-auto text-left py-1 px-2.5">
                                {query}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Section: Expanded Metadata */}
            {(seoKeywords.length > 0 || keyConcepts.length > 0 || importantPoints.length > 0 || keyStatistics.length > 0 || uniqueAngles.length > 0 || commonQuestions.length > 0 || relatedTerms.length > 0) && (
                <div className="space-y-10 pt-8 border-t border-border/30">
                    
                    {/* Stats & Points grid (FORCED SINGLE COLUMN) */}
                    <div className="grid grid-cols-1 gap-8">
                        {keyStatistics.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-amber-500" /> Données & Chiffres clés
                                </h4>
                                <div className="space-y-3">
                                    {keyStatistics.map((stat: string, i: number) => (
                                        <div key={i} className="text-xs p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                            <span className="text-foreground/90">{stat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {importantPoints.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Lightbulb className="h-3 w-3 text-blue-500" /> Points d&apos;attention
                                </h4>
                                <div className="space-y-3">
                                    {importantPoints.map((p: string, i: number) => (
                                        <div key={i} className="text-xs p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                            <span className="text-foreground/90">{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Angles & Questions (FORCED SINGLE COLUMN) */}
                    <div className="grid grid-cols-1 gap-8">
                        {uniqueAngles.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-green-500" /> Angles de rédaction recommandés
                                </h4>
                                <div className="space-y-3">
                                    {uniqueAngles.map((angle: string, i: number) => (
                                        <div key={i} className="text-xs p-4 rounded-xl bg-green-500/5 border border-green-500/10 flex items-start gap-3">
                                            <Sparkles className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground/90">{angle}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {commonQuestions.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Search className="h-3 w-3 text-primary" /> Questions fréquentes (FAQ)
                                </h4>
                                <div className="space-y-3">
                                    {commonQuestions.map((q: string, i: number) => (
                                        <div key={i} className="text-xs p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                                            <span className="font-bold text-primary">Q.</span>
                                            <span className="text-foreground/90 font-medium">{q}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SEO & Concepts */}
                    <div className="space-y-8">
                        {seoKeywords.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Hash className="h-3 w-3" /> Stratégie Sémantique & SEO
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {seoKeywords.map((k: string, i: number) => (
                                        <Badge key={i} variant="outline" className="text-[11px] px-3 py-1 font-normal border-border/40 bg-muted/5 hover:bg-primary/5 transition-colors whitespace-normal h-auto text-left">
                                            {k}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {keyConcepts.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-primary" /> Concepts majeurs
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {keyConcepts.map((c: string, i: number) => (
                                        <Badge key={i} variant="outline" className="text-[11px] px-3 py-1 font-medium border-primary/20 bg-primary/5 text-primary whitespace-normal h-auto text-left">
                                            {c}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {relatedTerms.length > 0 && (
                            <div className="space-y-3 opacity-60">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Hash className="h-3 w-3" /> Termes connexes
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {relatedTerms.map((t: string, i: number) => (
                                        <span key={i} className="text-[10px] text-muted-foreground bg-muted/20 px-2 py-0.5 rounded italic">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Section: Draft Plan Preview (TOC) */}
            {toc && (
                <div className="space-y-4 pt-8 border-t border-border/30">
                    <div className="flex items-center gap-2 px-1 text-sm font-semibold text-primary/80">
                        <Layout className="h-4 w-4" />
                        Aperçu du Plan de Travail (TOC)
                    </div>
                    <Card className="shadow-sm border-border/40 bg-card">
                        <CardHeader className="bg-muted/30 border-b border-border/20 py-3 px-4">
                            <CardTitle className="text-base font-bold">
                                {toc.title || "Titre suggéré"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 space-y-4">
                                {ensureArray(toc.sections).map((section: any, idx: number) => (
                                    <div key={section.id || idx} className="space-y-2">
                                        <div className="text-sm font-bold text-foreground/90 flex gap-2 leading-tight">
                                            <span className="text-primary/50 text-xs mt-0.5">{idx + 1}.</span>
                                            {section.title}
                                        </div>
                                        {ensureArray(section.subsections).length > 0 && (
                                            <div className="ml-5 space-y-1.5 border-l border-primary/10 pl-4 py-1">
                                                {section.subsections.map((sub: any, sIdx: number) => (
                                                    <div key={sub.id || sIdx} className="text-[13px] text-muted-foreground leading-snug">
                                                        • {sub.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Section: Orientations Card (Titles & Axes) (FORCED SINGLE COLUMN) */}
            {planOptions && (planOptions.titles || planOptions.axes) && (
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-primary" />
                            Angles de Titrage
                        </div>
                        <div className="space-y-2">
                            {ensureArray(planOptions.titles).map((title: string, i: number) => (
                                <div key={i} className="p-4 text-xs bg-primary/5 border border-primary/10 rounded-xl font-medium leading-relaxed">
                                    {title}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            <Zap className="h-3 w-3 text-amber-500" />
                            Axes de Rédaction
                        </div>
                        <div className="space-y-2">
                            {ensureArray(planOptions.axes).map((axis: string, i: number) => (
                                <div key={i} className="p-4 text-xs bg-amber-500/5 border border-amber-500/10 rounded-xl text-muted-foreground leading-relaxed italic">
                                    {axis}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Section: Rich Source Map (MOVED TO BOTTOM) */}
            {sources.length > 0 && (
                <div className="space-y-4 pt-10 border-t border-border/30">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
                            <BookOpen className="h-4 w-4" />
                            Cartographie des Sources ({sources.length})
                        </div>
                        <Badge variant="outline" className="text-[9px] h-5 opacity-60">Verified by Agent</Badge>
                    </div>
                    <div className="grid gap-4">
                        {sources.map((source: any, i: number) => (
                            <Card key={i} className="shadow-none border border-border/40 bg-card/40 hover:bg-card hover:border-primary/20 transition-all group">
                                <CardContent className="p-5 space-y-4">
                                    {/* Header: Title & Meta */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1.5 min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="flex-shrink-0 text-xs font-bold text-primary/50">#{i + 1}</span>
                                                <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                                    {source.title || "Document sans titre"}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-muted-foreground break-all opacity-60 leading-normal">
                                                {source.url}
                                            </p>
                                        </div>
                                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-all flex-shrink-0">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>

                                    {/* Badges: Authority & Type */}
                                    <div className="flex flex-wrap gap-2">
                                        {source.authority && (
                                            <Badge 
                                                variant="outline" 
                                                className={`text-[10px] uppercase font-bold border-none h-6 px-3 ${
                                                    source.authority === 'high' ? 'bg-green-500/10 text-green-600' :
                                                    source.authority === 'medium' ? 'bg-blue-500/10 text-blue-600' : 
                                                    'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                                                {source.authority === 'high' ? 'Expert' : source.authority === 'medium' ? 'Fiable' : 'Standard'}
                                            </Badge>
                                        )}
                                        {source.source_type && (
                                            <Badge variant="secondary" className="text-[10px] font-medium h-6 px-3 bg-muted/40 text-muted-foreground border-none capitalize">
                                                {source.source_type}
                                            </Badge>
                                        )}
                                        {source.publish_date && source.publish_date !== 'Non spécifié' && (
                                            <span className="text-[10px] text-muted-foreground/60 flex items-center h-6">
                                                Publié le {source.publish_date}
                                            </span>
                                        )}
                                    </div>

                                    {/* Insight Callout */}
                                    {source.key_insight && (
                                        <div className="p-4 rounded-xl bg-primary/5 border-l-2 border-primary/30 relative">
                                            <p className="text-[13px] text-foreground/80 leading-relaxed italic">
                                                &ldquo;{source.key_insight}&rdquo;
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
