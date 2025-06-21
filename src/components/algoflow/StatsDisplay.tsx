import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, TrendingUp } from "lucide-react";

interface StatsDisplayProps {
  overallProgress: number; // Percentage 0-100
  streak: number; // Number of days
}

export function StatsDisplay({ overallProgress, streak }: StatsDisplayProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 p-4 md:p-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Overall Progress</CardTitle>
          <TrendingUp className="h-6 w-6 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{overallProgress.toFixed(1)}%</div>
          <Progress value={overallProgress} className="mt-2 h-3 bg-accent/20 [&>div]:bg-accent" aria-label={`Overall progress: ${overallProgress.toFixed(1)}%`} />
          <p className="text-xs text-muted-foreground mt-1">
            Keep up the great work!
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Current Streak</CardTitle>
          <Flame className="h-6 w-6 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {streak} Day{streak === 1 ? "" : "s"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Consistency is key to success.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
