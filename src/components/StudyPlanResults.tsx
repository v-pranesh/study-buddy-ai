import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudyPlanResponse } from "@/types/studyPlan";
import { ExportActions } from "./ExportActions";
import { 
  Calendar, 
  Lightbulb, 
  AlertTriangle, 
  Sparkles, 
  Clock,
  CheckCircle2,
  ArrowLeft,
  Target,
  TrendingUp
} from "lucide-react";

interface StudyPlanResultsProps {
  plan: StudyPlanResponse;
  onReset: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function StudyPlanResults({ plan, onReset }: StudyPlanResultsProps) {
  const totalStudyHours = plan.weeklyPlan.reduce((acc, day) => acc + day.studyHours, 0);
  const avgHoursPerDay = (totalStudyHours / plan.weeklyPlan.length).toFixed(1);
  const totalTasks = plan.weeklyPlan.reduce((acc, day) => acc + day.tasks.length, 0);

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto space-y-8 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="mb-4 text-muted-foreground hover:text-foreground group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Create New Plan
        </Button>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-accent" />
            Your Personalized Study Plan
          </h2>
        </motion.div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {plan.overview}
        </p>

        {/* Export actions */}
        <motion.div variants={itemVariants} className="pt-2">
          <ExportActions plan={plan} />
        </motion.div>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard icon={<Clock className="w-5 h-5" />} value={`${totalStudyHours}h`} label="Total Hours" color="primary" />
        <StatsCard icon={<TrendingUp className="w-5 h-5" />} value={avgHoursPerDay} label="Avg Hours/Day" color="accent" />
        <StatsCard icon={<Target className="w-5 h-5" />} value={totalTasks.toString()} label="Total Tasks" color="secondary" />
        <StatsCard icon={<Calendar className="w-5 h-5" />} value={plan.weeklyPlan.length.toString()} label="Days Planned" color="muted" />
      </motion.div>

      {/* Weekly Plan Grid */}
      <motion.section variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-serif font-semibold flex items-center gap-2 text-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plan.weeklyPlan.map((day, index) => (
            <DayCard key={day.day} day={day} index={index} />
          ))}
        </div>
      </motion.section>

      {/* Focus Tips */}
      <motion.section variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-serif font-semibold flex items-center gap-2 text-foreground">
          <Lightbulb className="w-5 h-5 text-accent" />
          Focus Techniques
        </h3>
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-border/50 shadow-soft overflow-hidden">
          <CardContent className="p-6">
            <ul className="grid sm:grid-cols-2 gap-4">
              {plan.focusTips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-foreground">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.section>

      {/* Burnout Warnings */}
      {plan.burnoutWarnings.length > 0 && (
        <motion.section variants={itemVariants} className="space-y-4">
          <h3 className="text-xl font-serif font-semibold flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Burnout Prevention
          </h3>
          <Card className="border-warning/30 bg-gradient-to-br from-warning/10 to-warning/5 shadow-soft">
            <CardContent className="p-6">
              <ul className="space-y-3">
                {plan.burnoutWarnings.map((warning, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                  >
                    <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <span className="text-foreground">{warning}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Motivation */}
      <motion.section variants={itemVariants} className="space-y-4 pb-8">
        <Card className="gradient-hero text-primary-foreground shadow-lg overflow-hidden relative">
          <motion.div
            className="absolute top-4 right-4"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-10 h-10 opacity-40" />
          </motion.div>
          <CardHeader>
            <CardTitle className="text-xl font-serif flex items-center gap-2">
              💪 Your Daily Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl leading-relaxed opacity-95 font-medium">
              "{plan.motivation}"
            </p>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}

function StatsCard({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl bg-${color}/10 border border-${color}/20 text-center`}
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-${color}/20 text-${color} mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function DayCard({ day, index }: { day: { day: string; tasks: string[]; studyHours: number }; index: number }) {
  const isWeekend = day.day.toLowerCase().includes('saturday') || day.day.toLowerCase().includes('sunday');
  const progress = (day.studyHours / 8) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card 
        className={`border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 h-full ${
          isWeekend ? 'bg-gradient-to-br from-secondary/50 to-secondary/20' : 'bg-card'
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">{day.day}</CardTitle>
            <Badge 
              variant="secondary" 
              className={`flex items-center gap-1 ${
                day.studyHours <= 4 ? 'bg-success/20 text-success' :
                day.studyHours <= 6 ? 'bg-warning/20 text-warning' :
                'bg-destructive/20 text-destructive'
              }`}
            >
              <Clock className="w-3 h-3" />
              {day.studyHours}h
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {day.tasks.map((task, taskIndex) => (
              <motion.li
                key={taskIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 + taskIndex * 0.05 }}
                className="text-sm text-muted-foreground flex items-start gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5 group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-foreground transition-colors">{task}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
