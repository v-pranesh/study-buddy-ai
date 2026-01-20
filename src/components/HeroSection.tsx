import { motion, Variants } from "framer-motion";
import { Brain, Sparkles, Target, Zap, Shield } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-secondary/30 blur-2xl"
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="relative max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">AI-Powered Study Planning</span>
          <Zap className="w-4 h-4 text-primary" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold tracking-tight mb-6"
        >
          Study Smarter,{" "}
          <span className="relative">
            <span className="text-gradient">Not Harder</span>
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Transform your syllabus into a personalized, stress-aware study plan with 
          <span className="text-foreground font-medium"> AI-powered focus coaching</span> and 
          <span className="text-foreground font-medium"> burnout prevention</span>.
        </motion.p>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          <StatItem number="10k+" label="Plans Created" />
          <StatItem number="98%" label="User Satisfaction" />
          <StatItem number="2x" label="Study Efficiency" />
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <FeatureCard 
            icon={<Target className="w-5 h-5" />}
            title="Smart Planning"
            description="Prioritizes weak subjects automatically"
            gradient="from-blue-500/20 to-cyan-500/20"
          />
          <FeatureCard 
            icon={<Brain className="w-5 h-5" />}
            title="Focus Coaching"
            description="Proven concentration techniques"
            gradient="from-purple-500/20 to-pink-500/20"
          />
          <FeatureCard 
            icon={<Shield className="w-5 h-5" />}
            title="Burnout Guard"
            description="Stress-aware scheduling"
            gradient="from-green-500/20 to-emerald-500/20"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <motion.div
        className="text-3xl sm:text-4xl font-bold text-gradient"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
      >
        {number}
      </motion.div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <motion.div
      className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-sm border border-border/50 shadow-soft overflow-hidden group`}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-3 rounded-xl bg-background/80 text-primary shadow-sm">
        {icon}
      </div>
      <h3 className="relative font-semibold text-foreground">{title}</h3>
      <p className="relative text-sm text-muted-foreground text-center">{description}</p>
    </motion.div>
  );
}
