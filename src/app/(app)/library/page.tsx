"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
    LayoutGrid, 
    List, 
    Search, 
    MoreHorizontal, 
    FileText, 
    Calendar,
    ArrowRight,
    Loader2
} from "lucide-react"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Article = {
    id: string
    topic: string
    parameters: any
    status: string
    score: number
    created_at: string
}

export default function LibraryPage() {
    const [view, setView] = useState<"grid" | "list">("grid")
    const [searchTerm, setSearchTerm] = useState("")
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (data) setArticles(data)
            setLoading(false)
        }

        fetchArticles()

        // Real-time subscription for the entire articles table
        const channel = supabase
            .channel('library_changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'articles'
                },
                (payload) => {
                    console.log("[DEBUG] Realtime Change in Library:", payload);
                    
                    if (payload.eventType === 'INSERT') {
                        setArticles(prev => [payload.new as Article, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setArticles(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a));
                    } else if (payload.eventType === 'DELETE') {
                        setArticles(prev => prev.filter(a => a.id !== payload.old.id));
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const filteredArticles = articles.filter(a => 
        (a.topic || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return
        
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id)
        
        if (!error) {
            setArticles(articles.filter(a => a.id !== id))
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-primary">Bibliothèque</h1>
                    <p className="text-muted-foreground">Gérez vos contenus générés et publiés.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Rechercher..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "grid" | "list")}>
                         <ToggleGroupItem value="grid" aria-label="Grid view">
                            <LayoutGrid className="h-4 w-4" />
                         </ToggleGroupItem>
                         <ToggleGroupItem value="list" aria-label="List view">
                            <List className="h-4 w-4" />
                         </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                    Aucun article trouvé. Commencez par en générer un !
                </div>
            ) : view === "list" ? (
                <div className="bg-card rounded-md border">
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[45%]">Titre</TableHead>
                                <TableHead className="w-[10%]">Langue</TableHead>
                                <TableHead className="w-[15%]">Statut</TableHead>
                                <TableHead className="w-[10%]">Score</TableHead>
                                <TableHead className="w-[10%]">Date</TableHead>
                                <TableHead className="w-[10%] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredArticles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium max-w-[400px]">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                            <Link 
                                                href={`/article/${article.id}`} 
                                                className="hover:underline hover:text-primary truncate block"
                                                title={article.topic}
                                            >
                                                {article.topic}
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="uppercase">
                                            {article.parameters?.language === 'cn' ? '🇨🇳' : '🇫🇷'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={article.status} />
                                    </TableCell>
                                    <TableCell>
                                        {article.score ? (
                                             <span className={article.score > 80 ? "text-green-600 font-bold" : "text-amber-600"}>{article.score}</span>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/article/${article.id}`}>Ouvrir</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(article.id)}>
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredArticles.map((article) => (
                        <Card key={article.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="uppercase">
                                        {article.parameters?.language === 'cn' ? '🇨🇳' : '🇫🇷'}
                                    </Badge>
                                    <StatusBadge status={article.status} />
                                </div>
                                <CardTitle className="line-clamp-2 text-lg pt-2 min-h-[60px]">
                                    {article.topic}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </div>
                                    {article.score && (
                                        <div className="font-bold text-primary">Score: {article.score}</div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant="secondary" asChild>
                                    <Link href={`/article/${article.id}`}>
                                        Voir l&apos;article <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'done' || status === 'published' || status === 'completed') return <Badge className="bg-green-600 hover:bg-green-700">Terminé</Badge>
    if (status === 'waiting_validation') return <Badge variant="destructive">Validation requise</Badge>
    if (['writing', 'processing', 'researching', 'generating', 'generating_plan', 'translating'].includes(status)) return <Badge variant="secondary" className="animate-pulse">En cours</Badge>
    return <Badge variant="outline">Brouillon</Badge>
}
