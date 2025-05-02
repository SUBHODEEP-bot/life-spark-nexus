
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateGeminiResponse } from "@/utils/aiHelpers";

const SymptomAnalyzer = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    setError("");
    
    const prompt = `
      As a health-focused AI assistant, analyze these symptoms: "${symptoms}".
      
      Provide a brief response with:
      1. Possible causes of the symptom
      2. Suggestions for home remedies or health tips
      3. Common over-the-counter medicine names (only if relevant and safe)
      4. A reminder to consult a medical professional for serious concerns
      
      Keep the response brief and easy to understand. Do not make a definitive diagnosis.
      Do not answer if this is not a medical question. Only respond to health-related symptoms.
    `;

    try {
      const response = await generateGeminiResponse(prompt);
      
      if (response.error) {
        console.error("Gemini API error:", response.error);
        setError("Sorry, I couldn't analyze your symptoms. Please try again later.");
      } else {
        setAnalysis(response.text);
      }
    } catch (err) {
      console.error("Error analyzing symptoms:", err);
      setError("An error occurred while analyzing your symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-lifemate-purple" />
          Symptom Analyzer
        </CardTitle>
        <CardDescription>
          Describe your symptoms to get potential insights and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe your symptoms (e.g., headache and fatigue)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isAnalyzing) {
                analyzeSymptoms();
              }
            }}
            className="flex-1"
            disabled={isAnalyzing}
          />
          <Button 
            onClick={analyzeSymptoms} 
            disabled={!symptoms.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {analysis && !error && (
          <div className="rounded-md border border-border p-4 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-5 w-5 text-lifemate-purple" />
              <span className="font-medium">Analysis Result</span>
            </div>
            <div className="text-sm space-y-2 whitespace-pre-wrap">
              {analysis}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Disclaimer: This is not medical advice. Always consult a healthcare professional for medical concerns.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomAnalyzer;
