"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-6 overflow-hidden relative">
             {/* Decorative background element */}
             <div className="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-2xl" />
             
             <div className="flex gap-4 items-start relative z-10">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Cookie className="size-5 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Gestion des Cookies</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Nous utilisons des cookies pour améliorer votre expérience et sécuriser votre session. 
                        En continuant, vous acceptez notre politique de confidentialité.
                    </p>
                </div>
             </div>

             <div className="mt-6 flex gap-3 relative z-10">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-lg"
                    onClick={handleDecline}
                >
                    Refuser
                </Button>
                <Button 
                    size="sm" 
                    className="flex-1 rounded-lg shadow-lg shadow-primary/20"
                    onClick={handleAccept}
                >
                    Accepter
                </Button>
             </div>
             
             <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
             >
                <X className="size-4" />
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
