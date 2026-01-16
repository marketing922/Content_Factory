"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, BookOpen, Clock, Star, ArrowUpRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    waiting: 0,
    recentArticles: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // 1. Total Articles
        const { count: totalCount } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })

        // 2. Waiting Validation
        const { count: waitingCount } = await supabase
            .from('articles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'waiting_validation')

        // 3. Average Score (fetch all scores)
        const { data: scores } = await supabase
            .from('articles')
            .select('score')
            .not('score', 'is', null)
        
        const avg = scores && scores.length > 0
            ? Math.round(scores.reduce((acc, curr) => acc + (curr.score || 0), 0) / scores.length)
            : 0

        // 4. Recent Articles
        const { data: recents } = await supabase
            .from('articles')
            .select('id, topic, status, created_at, score')
            .order('created_at', { ascending: false })
            .limit(5)

        setStats({
            total: totalCount || 0,
            waiting: waitingCount || 0,
            avgScore: avg,
            recentArticles: recents || []
        })

      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-heading text-primary">{t.dashboard.title}</h1>
            <Button asChild>
                <Link href="/create">{t.dashboard.generateBtn}</Link>
            </Button>
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-calebasse-green-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.dashboard.stats.articles}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.total}</div>
                <p className="text-xs text-muted-foreground">{t.dashboard.stats.totalDesc}</p>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-calebasse-gold shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.dashboard.stats.avgScore}</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : `${stats.avgScore}/100`}</div>
                <p className="text-xs text-muted-foreground">{t.dashboard.stats.avgDesc}</p>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-calebasse-terracotta shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t.dashboard.stats.waiting}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : stats.waiting}</div>
                <p className="text-xs text-muted-foreground">{t.dashboard.stats.waitingDesc}</p>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 shadow-sm">
          <CardHeader>
            <CardTitle>{t.dashboard.recent.title}</CardTitle>
          </CardHeader>
           <CardContent>
             {loading ? (
                <div className="text-center py-8 text-muted-foreground">{t.common.loading}</div>
             ) : stats.recentArticles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">{t.dashboard.recent.noArticles}</div>
             ) : (
                <div className="space-y-4">
                    {stats.recentArticles.map(article => (
                        <div key={article.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                            <div className="flex flex-col gap-1">
                                <span className="font-medium truncate max-w-[300px] md:max-w-[500px]">{article.topic}</span>
                                <span className="text-xs text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-bold ${article.score > 80 ? 'text-green-600' : 'text-muted-foreground'}`}>
                                    {article.score ? `${article.score}/100` : '-'}
                                </span>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/article/${article.id}`}>
                                        {t.dashboard.recent.open} <ArrowUpRight className="ml-2 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
