import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { StudyPlanForm } from "@/components/StudyPlanForm";
import { StudyPlanResults } from "@/components/StudyPlanResults";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { StudyPlanInput, StudyPlanResponse } from "@/types/studyPlan";
import { useToast } from "@/hooks/use-toast";
import { Heart, Sparkles } from "lucide-react";

const Index = () => {
  const [studyPlan, setStudyPlan] = useState<StudyPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: StudyPlanInput) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-study-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate study plan");
      }

      const plan: StudyPlanResponse = await response.json();
      setStudyPlan(plan);
      
      toast({
        title: "✨ Study Plan Ready!",
        description: "Your personalized study plan has been generated.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStudyPlan(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 gradient-calm opacity-30 pointer-events-none" />
      
      <main className="relative">
        {isLoading ? (
          <LoadingSkeleton />
        ) : studyPlan ? (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <StudyPlanResults plan={studyPlan} onReset={handleReset} />
          </section>
        ) : (
          <>
            <HeroSection />
            <section className="px-4 sm:px-6 lg:px-8 pb-20">
              <StudyPlanForm onSubmit={handleSubmit} isLoading={isLoading} />
            </section>
          </>
        )}
      </main>

      <footer className="relative py-8 border-t border-border/50 print:hidden">
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for students everywhere</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/70">
            <Sparkles className="w-4 h-4" />
            <span>Powered by AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
