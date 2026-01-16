"use client"

import { useState } from "react"
import { 
    HelpCircle, 
    Search, 
    ChevronRight, 
    Zap, 
    ShieldCheck, 
    Edit3, 
    Globe, 
    RefreshCw,
    PlayCircle,
    BookOpen
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionItem } from "@/components/ui/custom-accordion"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

const ICON_MAP: Record<string, any> = {
    "Génération d'Articles": Zap,
    "Article Generation": Zap,
    "文章生成": Zap,
    "Édition & Personnalisation": Edit3,
    "Editing & Customization": Edit3,
    "编辑与个性化": Edit3,
    "Langues & Support": Globe,
    "Languages & Support": Globe,
    "语言与支持": Globe,
    "Sécurité & Organisation": ShieldCheck,
    "Security & Organization": ShieldCheck,
    "安全与组织": ShieldCheck,
}



export default function FAQPage() {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const [openItem, setOpenItem] = useState<string | null>(null)

    const filteredFaq = t.faq.data.map((category, idx) => ({
        ...category,
        index: idx,
        questions: category.questions.filter(q => 
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0)

    return (
        <div className="w-full p-6 space-y-12 animate-in fade-in duration-500 pb-24">
            {/* Header */}
            <header className="space-y-4 text-center py-10 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-background border border-border/50 shadow-sm relative overflow-hidden">
                <div className="absolute -left-10 -top-10 size-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10 space-y-2">
                    <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary bg-primary/5 rounded-full">{t.nav.faq}</Badge>
                    <h1 className="text-4xl font-bold font-heading">{t.faq.title}</h1>
                    <p className="text-muted-foreground text-lg">{t.faq.desc}</p>
                </div>

                <div className="max-w-md mx-auto relative z-10 mt-8 px-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t.faq.searchPlaceholder} 
                            className="h-12 pl-10 bg-background border-border/60 focus:ring-2 ring-primary/20 transition-all rounded-xl shadow-lg"
                        />
                    </div>
                </div>
            </header>

            {/* Content Categories */}
            <div className="grid gap-10">
                {filteredFaq.map((group) => (
                    <motion.section 
                        key={group.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                {(() => {
                                    const Icon = ICON_MAP[group.category] || HelpCircle
                                    return <Icon className="h-5 w-5 text-primary" />
                                })()}
                            </div>
                            <h2 className="text-xl font-bold font-heading">{group.category}</h2>
                        </div>
                        
                        <Accordion className="w-full">
                            {group.questions.map((item, qIdx) => {
                                const itemId = `${group.index}-${qIdx}`
                                return (
                                    <AccordionItem 
                                        key={qIdx} 
                                        value={itemId}
                                        title={item.q}
                                        isOpen={openItem === itemId}
                                        onToggle={() => setOpenItem(openItem === itemId ? null : itemId)}
                                    >
                                        {item.a}
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </motion.section>
                ))}

                {filteredFaq.length === 0 && (
                    <div className="text-center py-20 row-span-full opacity-50">
                         <Search className="size-12 mx-auto mb-4 text-muted-foreground" />
                         <p>{t.faq.noResults} "{searchTerm}"</p>
                    </div>
                )}
            </div>

            {/* Help Cards */}
            <div className="grid md:grid-cols-2 gap-6 pt-10">
                <Card className="bg-muted/30 border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BookOpen className="size-5 text-primary" />
                            <CardTitle className="text-base font-heading">{t.faq.helpCards.guide}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {t.faq.helpCards.guideDesc}
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="p-0 text-primary font-semibold">{t.faq.helpCards.guideBtn} <ChevronRight className="size-4 ml-1" /></Button>
                    </CardFooter>
                </Card>
                <Card className="bg-muted/30 border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <PlayCircle className="size-5 text-primary" />
                            <CardTitle className="text-base font-heading">{t.faq.helpCards.video}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {t.faq.helpCards.videoDesc}
                    </CardContent>
                    <CardFooter>
                        <Button variant="link" className="p-0 text-primary font-semibold">{t.faq.helpCards.videoBtn} <ChevronRight className="size-4 ml-1" /></Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
