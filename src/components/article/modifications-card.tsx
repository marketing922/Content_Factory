import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ModificationsCardProps {
    articleId: string
}

export function ModificationsCard({ articleId }: ModificationsCardProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [instructions, setInstructions] = useState("")
    const [selection, setSelection] = useState({
        title: false,
        intro: false,
        body: false,
        concl: false
    })

    const handleRegen = async () => {
        if (!articleId) return;
        
        // Basic validation
        if (!Object.values(selection).some(v => v) && !instructions) {
            toast.error("Veuillez sélectionner au moins une section ou donner des instructions.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/n8n', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'regen',
                    article_id: articleId,
                    selection,
                    instructions
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }

            toast.success("Demande de régénération envoyée !");
            // Clear inputs if needed, or keep them
        } catch (error) {
            console.error(error);
            toast.error("Impossible de lancer la régénération.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="shadow-none border-0 sm:border sm:shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Révisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Sections à réviser</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="title" checked={selection.title} onCheckedChange={(c) => setSelection(s => ({...s, title: !!c}))} />
                            <Label htmlFor="title" className="font-normal">Titre H1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="intro" checked={selection.intro} onCheckedChange={(c) => setSelection(s => ({...s, intro: !!c}))} />
                            <Label htmlFor="intro" className="font-normal">Intro</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="body" checked={selection.body} onCheckedChange={(c) => setSelection(s => ({...s, body: !!c}))} />
                            <Label htmlFor="body" className="font-normal">Corps</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="concl" checked={selection.concl} onCheckedChange={(c) => setSelection(s => ({...s, concl: !!c}))} />
                            <Label htmlFor="concl" className="font-normal">Conclusion</Label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-xs text-muted-foreground uppercase tracking-wider">Instructions Spécifiques</Label>
                    <Textarea 
                        id="instructions"
                        placeholder="Ex: Rendre le ton plus professionnel, simplifier le vocabulaire..."
                        className="min-h-[100px] resize-none text-sm"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>

                <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    onClick={handleRegen}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? "Envoi en cours..." : "Régénérer la sélection"}
                </Button>
            </CardContent>
        </Card>
    )
}
