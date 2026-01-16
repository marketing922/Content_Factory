"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

interface AccordionItemProps {
  value: string
  title: string
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  onToggle?: () => void
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn("space-y-2", className)}>{children}</div>
}

export function AccordionItem({ 
  title, 
  children, 
  className, 
  isOpen, 
  onToggle 
}: AccordionItemProps) {
  return (
    <div className={cn("border border-border/50 rounded-xl overflow-hidden bg-card", className)}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left font-medium transition-all hover:bg-muted/50"
      >
        <span>{title}</span>
        <ChevronDown 
          className={cn("size-4 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
