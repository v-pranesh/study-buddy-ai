import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Loader2, Calendar, Clock, AlertTriangle, Sparkles, Info } from "lucide-react";
import { StudyPlanInput } from "@/types/studyPlan";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StudyPlanFormProps {
  onSubmit: (data: StudyPlanInput) => void;
  isLoading: boolean;
}

const subjectSuggestions = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "English", "History", "Geography", "Computer Science"
];

export function StudyPlanForm({ onSubmit, isLoading }: StudyPlanFormProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSubject = (subject?: string) => {
    const subjectToAdd = (subject || currentSubject).trim();
    if (subjectToAdd && !subjects.includes(subjectToAdd)) {
      setSubjects([...subjects, subjectToAdd]);
      setCurrentSubject("");
      setShowSuggestions(false);
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

  const daysUntilExam = examDate 
    ? Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const filteredSuggestions = subjectSuggestions.filter(
    s => !subjects.includes(s) && s.toLowerCase().includes(currentSubject.toLowerCase())
  );

  const getHoursColor = () => {
    if (hoursPerDay <= 4) return "text-success";
    if (hoursPerDay <= 8) return "text-warning";
    return "text-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto shadow-medium border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 gradient-card opacity-50" />
        <CardHeader className="relative text-center pb-2">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-2xl sm:text-3xl font-serif flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Create Your Study Plan
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Tell us about your subjects and schedule
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subjects input */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="subjects" className="flex items-center gap-2 text-foreground text-base">
                <span className="text-xl">📚</span> Subjects
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add all subjects you need to study for</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="subjects"
                      value={currentSubject}
                      onChange={(e) => {
                        setCurrentSubject(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowSuggestions(currentSubject.length > 0 || filteredSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="e.g., Mathematics"
                      className="bg-background/80 border-input h-11"
                    />
                    <AnimatePresence>
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                        >
                          {filteredSuggestions.slice(0, 5).map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                              onClick={() => addSubject(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => addSubject()} 
                    variant="outline" 
                    size="icon"
                    className="h-11 w-11 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <AnimatePresence mode="popLayout">
                {subjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {subjects.map((subject, index) => (
                      <motion.div
                        key={subject}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge
                          variant={weakSubjects.includes(subject) ? "destructive" : "secondary"}
                          className="cursor-pointer group px-3 py-1.5 gap-2 text-sm hover:shadow-md transition-all"
                          onClick={() => toggleWeakSubject(subject)}
                        >
                          {subject}
                          {weakSubjects.includes(subject) && (
                            <span className="text-xs opacity-75">(weak)</span>
                          )}
                          <X
                            className="w-3 h-3 opacity-50 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSubject(subject);
                            }}
                          />
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-destructive/50" />
                Click on a subject to mark it as a weak area
              </p>
            </motion.div>

            {/* Exam date */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="examDate" className="flex items-center gap-2 text-foreground text-base">
                <Calendar className="w-5 h-5 text-primary" /> Exam Date
              </Label>
              <div className="relative">
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-background/80 border-input h-11"
                  required
                />
                {daysUntilExam !== null && daysUntilExam > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${
                      daysUntilExam <= 7 ? "text-destructive" : 
                      daysUntilExam <= 14 ? "text-warning" : "text-success"
                    }`}
                  >
                    {daysUntilExam} days left
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Hours per day */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="hours" className="flex items-center gap-2 text-foreground text-base">
                <Clock className="w-5 h-5 text-primary" /> Daily Study Hours
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      id="hours"
                      type="range"
                      min={1}
                      max={12}
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                      <span>1h</span>
                      <span>6h</span>
                      <span>12h</span>
                    </div>
                  </div>
                  <motion.span
                    key={hoursPerDay}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`text-2xl font-bold min-w-[4rem] text-center ${getHoursColor()}`}
                  >
                    {hoursPerDay}h
                  </motion.span>
                </div>
                {hoursPerDay > 8 && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-warning flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Consider reducing hours to prevent burnout
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Stress level */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="stress" className="flex items-center gap-2 text-foreground text-base">
                <AlertTriangle className="w-5 h-5 text-primary" /> Current Stress Level
              </Label>
              <Select value={stressLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setStressLevel(value)}>
                <SelectTrigger className="bg-background/80 border-input h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-success" />
                      Low - Feeling relaxed and ready
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-warning" />
                      Medium - Some pressure, manageable
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-destructive" />
                      High - Feeling overwhelmed
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                className="w-full gradient-hero text-primary-foreground hover:opacity-90 transition-all h-14 text-lg font-semibold shadow-medium hover:shadow-lg group"
                disabled={subjects.length === 0 || !examDate || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI is creating your plan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Generate Study Plan
                  </span>
                )}
              </Button>
              {subjects.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Add at least one subject to continue
                </p>
              )}
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
