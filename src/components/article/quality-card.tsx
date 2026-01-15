"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

interface QualityCardProps {
    evaluation: any
    hideScore?: boolean
    score?: number
}

export function QualityCard({ evaluation, hideScore = false, score: overrideScore }: QualityCardProps) {
    if (!evaluation && overrideScore === undefined) return null;

    const score = overrideScore ?? evaluation?.global_score ?? 0;
    const data = [{ name: 'Score', value: score, fill: '#4A7C59' }]
    const criteria = evaluation?.criteria || [];
    const feedback = evaluation?.feedback_for_writer;

    const content = (
        <div className="space-y-6">
            <div className="space-y-4">
                {criteria.map((c: any, i: number) => (
                    <ScoreRow 
                        key={i} 
                        label={c?.name || "Critère"} 
                        value={c?.score ?? 0} 
                        max={20} 
                        color="bg-primary" 
                        explanation={c?.explanation} 
                    />
                ))}
            </div>

            {feedback && (
                <div className="space-y-2 pt-4 border-t border-border/40">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/5 text-primary border-primary/20">Conseils</Badge>
                        Amélioration
                    </h4>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-[11px] text-muted-foreground leading-relaxed italic">
                        &ldquo;{feedback}&rdquo;
                    </div>
                </div>
            )}
        </div>
    );

    if (hideScore) {
        return <div className="pt-4">{content}</div>;
    }

    return (
        <Card className="shadow-none border-0 sm:border sm:shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                    Qualité Globale
                    <Badge variant={score > 80 ? 'default' : 'secondary'} className={score > 80 ? "bg-green-600/80 hover:bg-green-600" : ""}>
                        {score > 80 ? 'Excellent' : 'À améliorer'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[160px] w-full relative -mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                            innerRadius="70%" 
                            outerRadius="100%" 
                            barSize={12} 
                            data={data} 
                            startAngle={180} 
                            endAngle={0}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar
                                background
                                dataKey="value"
                                cornerRadius={10}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                        <span className="text-4xl font-black font-heading text-primary">{score}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">sur 100</span>
                    </div>
                </div>

                <div className="mt-2">
                    {content}
                </div>
            </CardContent>
        </Card>
    )
}

function ScoreRow({ label, value, max, color, explanation }: { label: string, value: number, max: number, color: string, explanation?: string }) {
    // Normalize to 100% for the bar width
    const widthPercentage = (value / max) * 100;
    
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">{label}</span>
                <span className="text-muted-foreground">{value}/{max}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${widthPercentage}%` }} 
                />
            </div>
            {explanation && (
                <p className="text-[10px] text-muted-foreground/70 leading-normal pl-1 border-l border-border/50 ml-0.5">
                    {explanation}
                </p>
            )}
        </div>
    )
}
