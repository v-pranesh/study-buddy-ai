import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudyPlanResponse } from "@/types/studyPlan";
import { 
  Calendar, 
  Lightbulb, 
  AlertTriangle, 
  Sparkles, 
  Clock,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

interface StudyPlanResultsProps {
  plan: StudyPlanResponse;
  onReset: () => void;
}

export function StudyPlanResults({ plan, onReset }: StudyPlanResultsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Your Personalized Study Plan
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {plan.overview}
        </p>
      </div>

      {/* Weekly Plan Grid */}
      <section className="space-y-4">
        <h3 className="text-xl font-serif font-semibold flex items-center gap-2 text-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plan.weeklyPlan.map((day, index) => (
            <DayCard key={day.day} day={day} index={index} />
          ))}
        </div>
      </section>

      {/* Focus Tips */}
      <section className="space-y-4">
        <h3 className="text-xl font-serif font-semibold flex items-center gap-2 text-foreground">
          <Lightbulb className="w-5 h-5 text-accent" />
          Focus Techniques
        </h3>
        <Card className="gradient-calm border-border/50 shadow-soft">
          <CardContent className="p-6">
            <ul className="space-y-3">
              {plan.focusTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Burnout Warnings */}
      {plan.burnoutWarnings.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-serif font-semibold flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Burnout Prevention
          </h3>
          <Card className="border-warning/30 bg-warning/5 shadow-soft">
            <CardContent className="p-6">
              <ul className="space-y-3">
                {plan.burnoutWarnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <span className="text-foreground">{warning}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Motivation */}
      <section className="space-y-4">
        <Card className="gradient-hero text-primary-foreground shadow-medium overflow-hidden relative">
          <div className="absolute top-4 right-4">
            <Sparkles className="w-8 h-8 opacity-50" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-serif">💪 Your Daily Motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed opacity-95">
              {plan.motivation}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DayCard({ day, index }: { day: { day: string; tasks: string[]; studyHours: number }; index: number }) {
  const isWeekend = day.day.toLowerCase().includes('saturday') || day.day.toLowerCase().includes('sunday');
  
  return (
    <Card 
      className={`border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up ${
        isWeekend ? 'bg-secondary/30' : 'bg-card'
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">{day.day}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {day.studyHours}h
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {day.tasks.map((task, taskIndex) => (
            <li key={taskIndex} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              {task}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
