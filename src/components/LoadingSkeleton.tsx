import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

const loadingMessages = [
  "Analyzing your subjects...",
  "Prioritizing weak areas...",
  "Balancing study hours...",
  "Adding focus techniques...",
  "Checking for burnout risks...",
  "Finalizing your plan...",
];

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-12">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20"
        >
          <Brain className="w-6 h-6 text-primary animate-pulse" />
          <span className="text-lg font-medium text-primary">AI is crafting your plan</span>
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        </motion.div>
      </div>

      {/* Loading animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Rotating messages */}
        <div className="h-8 flex items-center justify-center">
          {loadingMessages.map((message, index) => (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [10, 0, 0, -10]
              }}
              transition={{
                duration: 2,
                delay: index * 2,
                repeat: Infinity,
                repeatDelay: (loadingMessages.length - 1) * 2,
              }}
              className="absolute text-muted-foreground text-lg"
            >
              {message}
            </motion.p>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-primary/30"
              animate={{
                backgroundColor: ["hsl(var(--primary) / 0.3)", "hsl(var(--primary))", "hsl(var(--primary) / 0.3)"],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Skeleton cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {[...Array(7)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="h-48 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/30 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <motion.div
                className="h-5 w-20 rounded-md bg-muted"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-6 w-12 rounded-full bg-muted"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
            </div>
            <div className="space-y-2 pt-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-4 rounded bg-muted"
                  style={{ width: `${85 - i * 15}%` }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
