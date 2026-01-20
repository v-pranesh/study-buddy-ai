import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, Copy, Check } from "lucide-react";
import { StudyPlanResponse } from "@/types/studyPlan";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExportActionsProps {
  plan: StudyPlanResponse;
}

export function ExportActions({ plan }: ExportActionsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateTextContent = () => {
    let content = `📚 MY STUDY PLAN\n${"=".repeat(40)}\n\n`;
    content += `📝 Overview:\n${plan.overview}\n\n`;
    content += `📅 Weekly Schedule:\n${"-".repeat(30)}\n`;
    
    plan.weeklyPlan.forEach(day => {
      content += `\n${day.day} (${day.studyHours}h):\n`;
      day.tasks.forEach(task => {
        content += `  • ${task}\n`;
      });
    });

    content += `\n💡 Focus Tips:\n${"-".repeat(30)}\n`;
    plan.focusTips.forEach(tip => {
      content += `  ✓ ${tip}\n`;
    });

    if (plan.burnoutWarnings.length > 0) {
      content += `\n⚠️ Burnout Warnings:\n${"-".repeat(30)}\n`;
      plan.burnoutWarnings.forEach(warning => {
        content += `  ! ${warning}\n`;
      });
    }

    content += `\n💪 Motivation:\n${"-".repeat(30)}\n${plan.motivation}\n`;

    return content;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateTextContent());
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Study plan copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-study-plan.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Study plan saved as text file",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Study Plan",
          text: generateTextContent(),
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center print:hidden">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="gap-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Download
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="gap-2"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
    </div>
  );
}
