import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Loader2, Calendar, Clock, AlertTriangle } from "lucide-react";
import { StudyPlanInput } from "@/types/studyPlan";

interface StudyPlanFormProps {
  onSubmit: (data: StudyPlanInput) => void;
  isLoading: boolean;
}

export function StudyPlanForm({ onSubmit, isLoading }: StudyPlanFormProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const addSubject = () => {
    if (currentSubject.trim() && !subjects.includes(currentSubject.trim())) {
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
    setWeakSubjects(weakSubjects.filter(s => s !== subject));
  };

  const toggleWeakSubject = (subject: string) => {
    if (weakSubjects.includes(subject)) {
      setWeakSubjects(weakSubjects.filter(s => s !== subject));
    } else {
      setWeakSubjects([...weakSubjects, subject]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.length === 0 || !examDate) return;
    
    onSubmit({
      subjects,
      examDate,
      hoursPerDay,
      weakSubjects,
      stressLevel,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-soft border-border/50 animate-slide-up">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-serif">Create Your Study Plan</CardTitle>
        <CardDescription>Tell us about your subjects and schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subjects input */}
          <div className="space-y-3">
            <Label htmlFor="subjects" className="flex items-center gap-2 text-foreground">
              <span>📚</span> Subjects
            </Label>
            <div className="flex gap-2">
              <Input
                id="subjects"
                value={currentSubject}
                onChange={(e) => setCurrentSubject(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Mathematics"
                className="flex-1 bg-background border-input"
              />
              <Button type="button" onClick={addSubject} variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {subjects.map(subject => (
                  <Badge
                    key={subject}
                    variant={weakSubjects.includes(subject) ? "destructive" : "secondary"}
                    className="cursor-pointer group px-3 py-1 gap-2"
                    onClick={() => toggleWeakSubject(subject)}
                  >
                    {subject}
                    {weakSubjects.includes(subject) && (
                      <span className="text-xs opacity-75">(weak)</span>
                    )}
                    <X
                      className="w-3 h-3 opacity-50 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSubject(subject);
                      }}
                    />
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Click on a subject to mark it as a weak area
            </p>
          </div>

          {/* Exam date */}
          <div className="space-y-2">
            <Label htmlFor="examDate" className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4" /> Exam Date
            </Label>
            <Input
              id="examDate"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="bg-background border-input"
              required
            />
          </div>

          {/* Hours per day */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4" /> Daily Study Hours
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="hours"
                type="range"
                min={1}
                max={12}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-primary min-w-[3rem] text-center">
                {hoursPerDay}h
              </span>
            </div>
          </div>

          {/* Stress level */}
          <div className="space-y-2">
            <Label htmlFor="stress" className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="w-4 h-4" /> Current Stress Level
            </Label>
            <Select value={stressLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setStressLevel(value)}>
              <SelectTrigger className="bg-background border-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Low - Feeling relaxed
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning" />
                    Medium - Some pressure
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    High - Feeling overwhelmed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full gradient-hero text-primary-foreground hover:opacity-90 transition-opacity h-12 text-base font-medium"
            disabled={subjects.length === 0 || !examDate || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Your Plan...
              </>
            ) : (
              "Generate Study Plan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
