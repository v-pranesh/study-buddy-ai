import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { StudyPlanForm } from "@/components/StudyPlanForm";
import { StudyPlanResults } from "@/components/StudyPlanResults";
import { StudyPlanInput, StudyPlanResponse } from "@/types/studyPlan";
import { useToast } from "@/hooks/use-toast";

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
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        if (response.status === 402) {
          throw new Error("Service temporarily unavailable. Please try again later.");
        }
        
        throw new Error(errorData.error || "Failed to generate study plan");
      }

      const plan: StudyPlanResponse = await response.json();
      setStudyPlan(plan);
      
      toast({
        title: "Study Plan Created! 🎉",
        description: "Your personalized study plan is ready.",
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
    <div className="min-h-screen bg-background">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 gradient-calm opacity-50 pointer-events-none" />
      
      <main className="relative">
        {!studyPlan ? (
          <>
            <HeroSection />
            <section className="px-4 sm:px-6 lg:px-8 pb-20">
              <StudyPlanForm onSubmit={handleSubmit} isLoading={isLoading} />
            </section>
          </>
        ) : (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <StudyPlanResults plan={studyPlan} onReset={handleReset} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>Built with 💙 to help you study smarter</p>
      </footer>
    </div>
  );
};

export default Index;
