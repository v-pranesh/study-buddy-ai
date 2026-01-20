import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StudyPlanInput {
  subjects: string[];
  examDate: string;
  hoursPerDay: number;
  weakSubjects: string[];
  stressLevel: "low" | "medium" | "high";
}

interface DailyPlan {
  day: string;
  tasks: string[];
  studyHours: number;
}

interface StudyPlanResponse {
  overview: string;
  weeklyPlan: DailyPlan[];
  focusTips: string[];
  burnoutWarnings: string[];
  motivation: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: StudyPlanInput = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Validate input
    if (!input.subjects?.length || !input.examDate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: subjects and examDate" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate days until exam
    const today = new Date();
    const examDate = new Date(input.examDate);
    const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Build system prompt
    const systemPrompt = `You are an expert study planner and focus coach. Your job is to create personalized, realistic study plans that prevent burnout.

IMPORTANT RULES:
- Allocate more time to weak subjects
- If stress level is high, schedule shorter sessions with more breaks
- Never exceed the daily study hours limit
- Include at least one rest day or lighter day per week
- Suggest practical, proven focus techniques
- Warn about potential burnout if schedule is too intense
- Always be encouraging and supportive

The student has ${daysUntilExam} days until their exam.`;

    const userPrompt = `Create a weekly study plan for the following:

Subjects: ${input.subjects.join(", ")}
Weak subjects that need extra attention: ${input.weakSubjects.length > 0 ? input.weakSubjects.join(", ") : "None specified"}
Exam date: ${input.examDate} (${daysUntilExam} days away)
Available study time: ${input.hoursPerDay} hours per day
Current stress level: ${input.stressLevel}

Generate a structured response using the generate_study_plan function.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_study_plan",
              description: "Generate a structured weekly study plan with focus tips and burnout warnings",
              parameters: {
                type: "object",
                properties: {
                  overview: {
                    type: "string",
                    description: "A 1-2 sentence overview of the study plan strategy",
                  },
                  weeklyPlan: {
                    type: "array",
                    description: "Array of daily study plans for the week",
                    items: {
                      type: "object",
                      properties: {
                        day: {
                          type: "string",
                          description: "Day name (e.g., 'Monday', 'Tuesday')",
                        },
                        tasks: {
                          type: "array",
                          items: { type: "string" },
                          description: "List of specific study tasks for this day",
                        },
                        studyHours: {
                          type: "number",
                          description: "Total study hours for this day",
                        },
                      },
                      required: ["day", "tasks", "studyHours"],
                    },
                  },
                  focusTips: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 practical focus techniques for the student",
                  },
                  burnoutWarnings: {
                    type: "array",
                    items: { type: "string" },
                    description: "Warnings about potential burnout risks and how to avoid them (empty array if no concerns)",
                  },
                  motivation: {
                    type: "string",
                    description: "A personalized motivational message for the student",
                  },
                },
                required: ["overview", "weeklyPlan", "focusTips", "burnoutWarnings", "motivation"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_study_plan" } },
      }),
    });

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the function call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_study_plan") {
      throw new Error("Invalid response from AI service");
    }

    const studyPlan: StudyPlanResponse = JSON.parse(toolCall.function.arguments);

    // Validate response structure
    if (!studyPlan.overview || !studyPlan.weeklyPlan || !studyPlan.focusTips) {
      throw new Error("Incomplete study plan generated");
    }

    return new Response(JSON.stringify(studyPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating study plan:", error);
    
    // Return a fallback response for better UX
    const fallbackPlan: StudyPlanResponse = {
      overview: "We encountered an issue generating your personalized plan. Here's a general study strategy to get you started.",
      weeklyPlan: [
        { day: "Monday", tasks: ["Review notes from all subjects", "Create study flashcards"], studyHours: 4 },
        { day: "Tuesday", tasks: ["Focus on weak subjects", "Practice problems"], studyHours: 4 },
        { day: "Wednesday", tasks: ["Active recall session", "Group study if possible"], studyHours: 4 },
        { day: "Thursday", tasks: ["Review difficult concepts", "Take practice tests"], studyHours: 4 },
        { day: "Friday", tasks: ["Light review", "Organize materials"], studyHours: 3 },
        { day: "Saturday", tasks: ["Mock exam practice", "Review mistakes"], studyHours: 4 },
        { day: "Sunday", tasks: ["Rest and light review", "Plan next week"], studyHours: 2 },
      ],
      focusTips: [
        "Use the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break",
        "Study in a quiet, well-lit environment",
        "Stay hydrated and take short walks between sessions",
        "Review material before bed for better retention",
      ],
      burnoutWarnings: [
        "Remember to take regular breaks to avoid mental fatigue",
        "Don't sacrifice sleep for extra study time",
      ],
      motivation: "You've got this! Every hour of focused study brings you closer to your goals. Believe in yourself and stay consistent.",
    };

    return new Response(JSON.stringify(fallbackPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
