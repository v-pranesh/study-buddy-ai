import { BookOpen, Brain, Sparkles, Target } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 animate-float blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent/10 animate-float blur-xl" style={{ animationDelay: '2s' }} />
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-secondary-foreground">AI-Powered Study Planning</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 animate-slide-up">
          Study Smarter,{" "}
          <span className="text-gradient">Not Harder</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Transform your syllabus into a personalized, stress-aware study plan with AI-powered focus coaching and burnout prevention.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <FeatureCard 
            icon={<Target className="w-5 h-5" />}
            title="Smart Planning"
            description="Prioritizes weak subjects"
          />
          <FeatureCard 
            icon={<Brain className="w-5 h-5" />}
            title="Focus Coaching"
            description="Proven techniques"
          />
          <FeatureCard 
            icon={<BookOpen className="w-5 h-5" />}
            title="Burnout Guard"
            description="Stress-aware scheduling"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-soft hover:shadow-medium transition-shadow duration-300">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
