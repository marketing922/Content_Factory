"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Zap, PenTool, BarChart3, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-50">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 font-bold text-xl tracking-tighter"
        >
            <div className="h-8 w-8 relative rounded-lg overflow-hidden">
                <Image src="/favicon.png" alt="Logo" fill className="object-cover" />
            </div>
            <span>Content Factory</span>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
        >
            <ThemeToggle />
            <Link href="/library">
                <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                    Accéder au Dashboard
                </Button>
            </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 max-w-5xl mx-auto mt-[-80px]">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Opérationnel & Connecté
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-tight">
                L'Intelligence Artificielle au service de notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Expertise</span>.
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance font-light">
                Générez, éditez et publiez des articles optimisés SEO en un temps record. Une suite d'outils puissante pour le Laboratoire Calebasse.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/create">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform duration-300">
                        <Zap className="mr-2 h-5 w-5 fill-current" />
                        Créer un Article
                    </Button>
                </Link>
                <Link href="/library">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full hover:bg-muted/50 transition-all duration-300">
                        Voir les Articles
                    </Button>
                </Link>
            </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
        >
             {[
                { icon: PenTool, title: "Éditeur Temps Réel", desc: "Suivez la rédaction de l'IA phrase par phrase dans un éditeur riche." },
                { icon: Globe, title: "Traduction Auto", desc: "Traduisez les contenus en 3 langues (Français, Anglais, Chinois) instantanément ." },
                { icon: BarChart3, title: "SEO Optimisé", desc: "Structure, balisage et mots-clés intégrés dès la conception." },
             ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-card/40 border border-border/50 hover:bg-card/80 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                        <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
             ))}
        </motion.div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground/60 z-10">
        © 2026 Laboratoire Calebasse — Powered by Franck F.
      </footer>
    </div>
  )
}
