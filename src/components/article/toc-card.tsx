import { Card, CardContent } from "@/components/ui/card"
import { ListTree, ChevronRight, Check, Sparkles, Send, MessageSquare, Paperclip, X, File as FileIcon, RefreshCcw, Trash2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

interface TOCSection {
    id: string
    title: string
    subsections?: { id: string; title: string }[]
}

interface TOCCardProps {
    toc: {
        title: string
        sections: TOCSection[]
    }
    planOptions?: {
        titles: string[]
        axes: string[]
    }
    onSelectAxis?: (axis: string) => void
    onModificationRequest?: (request: string, file?: { name: string, content: string, type: string }) => void
    onRegenerate?: (axis: string) => void
    status?: string
    isGenerating?: boolean
    onUpdateTOC?: (newTOC: any) => void
}

export function TOCCard({ toc, planOptions, onSelectAxis, onModificationRequest, onRegenerate, status, isGenerating, onUpdateTOC }: TOCCardProps) {
    const { t } = useTranslation()
    const [selectedTitle, setSelectedTitle] = useState(toc?.title || "")
    const [selectedAxis, setSelectedAxis] = useState("")
    const [modRequest, setModRequest] = useState("")
    const [selectedFile, setSelectedFile] = useState<{ name: string, content: string, type: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
             // Simple alert for now
            alert(t.article.toc.fileSizeError)
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            const base64 = content.split(',')[1]
            setSelectedFile({
                name: file.name,
                type: file.type,
                content: base64
            })
        }
        reader.readAsDataURL(file)
    }

    const handleSend = () => {
        if (modRequest.trim() || selectedFile) {
            onModificationRequest?.(modRequest, selectedFile || undefined)
            setModRequest("")
            setSelectedFile(null)
        }
    }

    const isWaiting = status === 'waiting_validation'

    if (!toc && !planOptions) return null

    return (
        <div className="space-y-8 pb-40">
            {/* AI Plan Options (Titles & Axes) */}
            {planOptions && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t.article.toc.chooseAxis}</h3>
                        </div>
                        <div className="space-y-3">
                            {planOptions.axes.map((axis, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSelectedAxis(axis)
                                        onSelectAxis?.(axis)
                                    }}
                                    className={`w-full text-left p-4 rounded-xl border transition-all text-xs leading-relaxed flex items-start gap-3 ${
                                        selectedAxis === axis 
                                        ? "bg-primary/10 border-primary ring-1 ring-primary/20" 
                                        : "bg-card border-border/40 hover:border-primary/40 hover:bg-primary/5"
                                    }`}
                                >
                                    <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                                        selectedAxis === axis ? "bg-primary border-primary" : "border-muted-foreground/30"
                                    }`}>
                                        {selectedAxis === axis && <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[4px]" />}
                                    </div>
                                    <span className={selectedAxis === axis ? "text-foreground font-medium" : "text-muted-foreground"}>
                                        {axis}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {selectedAxis && (
                            <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                                <Button 
                                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all"
                                    onClick={() => {
                                        onRegenerate?.(selectedAxis)
                                        toast.info(t.article.toc.regenInfo)
                                    }}
                                    disabled={isGenerating}
                                >
                                    <RefreshCcw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                                    {isGenerating ? t.article.toc.generatingStatus : t.article.toc.regenerateBtn}
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-2">
                                    {t.article.toc.confirmRegen}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t.article.toc.chooseTitle}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {planOptions.titles.map((title, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSelectedTitle(title)
                                        // Update the assistant input with this title choice
                                        setModRequest(prev => {
                                            const prefix = t.article.parameters?.language === 'zh' ? "使用此标题：" : t.article.parameters?.language === 'en' ? "Use this title: " : "Utilise ce titre : ";
                                            // Simple check to avoid duplicating if already there or replacing main intent
                                            // We append or set. Let's just append neatly.
                                            return prev ? `${prev}\n${prefix}"${title}"` : `${prefix}"${title}"`;
                                        })
                                    }}
                                    className={`text-left p-4 rounded-xl border transition-all text-sm font-medium flex items-start gap-3 group relative overflow-hidden ${
                                        selectedTitle === title 
                                        ? "bg-primary/10 border-primary ring-1 ring-primary/20" 
                                        : "bg-card border-border/40 hover:border-primary/40 hover:bg-primary/5"
                                    }`}
                                >
                                    <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
                                        selectedTitle === title ? "bg-primary border-primary" : "border-muted-foreground/30"
                                    }`}>
                                        {selectedTitle === title && <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[4px]" />}
                                    </div>
                                    <span>{title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* AI Modification Request Box - Floating */}
            <AnimatePresence>
                {!isGenerating && (
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
                                        <h4 className="text-xs font-bold text-foreground">{t.article.toc.assistantTitle}</h4>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] bg-primary/5 text-primary border-primary/10 px-1.5 h-4">BETA</Badge>
                                </div>
                                <div className="relative group">
                                    <Textarea 
                                        value={modRequest}
                                        onChange={(e) => setModRequest(e.target.value)}
                                        placeholder={t.article.toc.placeholder} 
                                        className="bg-background/50 border-border/40 focus:ring-primary/20 pr-20 text-sm min-h-[44px] max-h-[120px] py-2 px-3 resize-none shadow-inner leading-relaxed rounded-xl transition-all border-2 focus:border-primary/30"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey && (modRequest.trim() || selectedFile)) {
                                                e.preventDefault();
                                                handleSend()
                                            }
                                        }}
                                    />
                                    <div className="absolute right-2 bottom-1.5 flex items-center gap-1.5">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden" 
                                            accept=".pdf,.txt,.md,.json"
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className={`h-7 w-7 hover:bg-primary/10 ${selectedFile ? 'text-primary' : 'text-muted-foreground opacity-50'}`}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Paperclip className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            className="h-7 w-7 shadow-lg hover:scale-105 transition-transform bg-primary"
                                            onClick={handleSend}
                                            disabled={(!modRequest.trim() && !selectedFile) || isGenerating}
                                        >
                                            <Send className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                {selectedFile && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-primary/5 border border-primary/10 rounded-lg max-w-fit ml-1">
                                        <FileIcon className="h-3 w-3 text-primary" />
                                        <span className="text-[10px] font-medium text-foreground truncate max-w-[150px]">{selectedFile.name}</span>
                                        <button 
                                            onClick={() => setSelectedFile(null)}
                                            className="p-0.5 hover:bg-background rounded-full transition-colors"
                                        >
                                            <X className="h-2.5 w-2.5 text-muted-foreground hover:text-destructive" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Current Structure Display */}
            <div className="space-y-4">
                <div className={`flex items-center justify-between px-1 ${isGenerating ? "animate-pulse" : ""}`}>
                    <textarea 
                        value={toc?.title || ""}
                        onChange={(e) => {
                            onUpdateTOC?.({ ...toc, title: e.target.value })
                            e.target.style.height = 'auto'; 
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        ref={(ref) => {
                            if (ref) {
                                ref.style.height = 'auto';
                                ref.style.height = ref.scrollHeight + 'px';
                            }
                        }}
                        rows={1}
                        className="text-xl font-bold font-heading text-foreground bg-transparent border-none focus:ring-0 p-0 w-full resize-none overflow-hidden"
                    />
                    {!isWaiting && <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">{t.article.toc.planValidated}</Badge>}
                </div>
                
                <div className={`space-y-3 ${isGenerating ? "opacity-50 pointer-events-none" : ""}`}>
                    {toc?.sections?.map((section, idx) => {
                        const isSelected = modRequest.includes(section.title)
                        return (
                            <div key={section.id || idx} className="space-y-2">
                                <div 
                                    onClick={() => {
                                        if (!modRequest.includes(section.title)) {
                                            const subTitles = section.subsections?.map(s => s.title).join(", ") || "";
                                            const context = t.article.parameters?.language === 'zh' ? `第 ${idx + 1} 部分 "${section.title}"` : t.article.parameters?.language === 'en' ? `Section: "${section.title}"` : `Section : "${section.title}"`;
                                            const subContext = subTitles ? (t.article.parameters?.language === 'zh' ? ` (包含子章节：${subTitles})` : t.article.parameters?.language === 'en' ? ` (including subsections: ${subTitles})` : ` (incluant sous-parties : ${subTitles})`) : "";
                                            const modifyPrompt = t.article.parameters?.language === 'zh' ? "修改 " : t.article.parameters?.language === 'en' ? "Modify " : "Modifie la ";
                                            const regardingPrompt = t.article.parameters?.language === 'zh' ? "关于 " : t.article.parameters?.language === 'en' ? "Regarding " : "Concernant la ";
                                            
                                            setModRequest(prev => prev ? `${prev}\n${regardingPrompt}${context}${subContext}` : `${modifyPrompt}${context}${subContext} : `)
                                        }
                                    }}
                                    className={`flex items-start gap-4 p-4 border rounded-xl group transition-all duration-300 cursor-pointer ${
                                        isSelected 
                                        ? "bg-primary/5 border-primary/40" 
                                        : "bg-muted/20 border-border/40 hover:bg-muted/30"
                                    }`}
                                >
                                    <span className={`flex-shrink-0 h-7 w-7 rounded-lg text-xs flex items-center justify-center font-black border transition-colors ${
                                        isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-primary/10 text-primary border-primary/10"
                                    }`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex-1">
                                                <input 
                                                    type="text"
                                                    value={section.title}
                                                    onChange={(e) => {
                                                        const newSections = [...toc.sections]
                                                        newSections[idx] = { ...section, title: e.target.value }
                                                        onUpdateTOC?.({ ...toc, sections: newSections })
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={`w-full bg-transparent border-none focus:ring-0 text-sm font-bold p-0 transition-colors ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}
                                                />
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                                {isSelected && <Badge variant="secondary" className="text-[9px] h-4 bg-primary/10 text-primary border-none">Sélectionné</Badge>}
                                                
                                                {/* Delete Section Button */}
                                                {!isGenerating && status !== 'published' && status !== 'writing' && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-6 w-6 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            if (confirm("Supprimer cette partie ?")) {
                                                                const newSections = toc.sections.filter((_, i) => i !== idx)
                                                                onUpdateTOC?.({ ...toc, sections: newSections })
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {section.subsections && section.subsections.length > 0 && (
                                            <div className="mt-3 space-y-2.5 border-l border-border/60 ml-1.5 pl-4">
                                                {section.subsections.map((sub, sIdx) => (
                                                    <div key={sub.id || sIdx} className="flex items-center gap-2 group/sub relative pr-6">
                                                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30 group-hover/sub:bg-primary transition-colors" />
                                                        <input 
                                                            type="text"
                                                            value={sub.title}
                                                            onChange={(e) => {
                                                                const newSections = [...toc.sections]
                                                                const newSubsections = [...(section.subsections || [])]
                                                                newSubsections[sIdx] = { ...sub, title: e.target.value }
                                                                newSections[idx] = { ...section, subsections: newSubsections }
                                                                onUpdateTOC?.({ ...toc, sections: newSections })
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-muted-foreground group-hover/sub:text-foreground transition-colors p-0"
                                                        />
                                                        
                                                        {/* Delete Subsection Button (visible on hover) */}
                                                        {!isGenerating && status !== 'published' && status !== 'writing' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    const newSections = [...toc.sections]
                                                                    const newSubsections = section.subsections!.filter((_, i) => i !== sIdx)
                                                                    newSections[idx] = { ...section, subsections: newSubsections }
                                                                    onUpdateTOC?.({ ...toc, sections: newSections })
                                                                }}
                                                                className="absolute right-0 opacity-0 group-hover/sub:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
