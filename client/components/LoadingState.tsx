import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle,
  Shield,
  Globe,
  Search,
  Database,
  Download,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStep {
  label: string;
  progress: number;
  icon: React.ElementType;
}

interface LoadingStateProps {
  title: string;
  description?: string;
  steps: LoadingStep[];
  currentStep: number;
  progress: number;
  className?: string;
}

export function LoadingState({
  title,
  description,
  steps,
  currentStep,
  progress,
  className,
}: LoadingStateProps) {
  return (
    <Card className={cn("p-8", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all",
                  isActive && "bg-primary/10 border border-primary/20",
                  isCompleted && "opacity-75",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full",
                    isCompleted
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "font-medium flex-1",
                    isActive && "text-primary",
                  )}
                >
                  {step.label}
                </span>
                {isActive && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// Preset loading configurations
export const ConnectionLoadingSteps = [
  { label: "Validating credentials", progress: 20, icon: Shield },
  { label: "Establishing connection", progress: 40, icon: Globe },
  { label: "Discovering resources", progress: 60, icon: Search },
  { label: "Organizing data", progress: 80, icon: Database },
  { label: "Finalizing setup", progress: 100, icon: CheckCircle },
];

export const SyncLoadingSteps = [
  { label: "Connecting to cloud provider", progress: 25, icon: Globe },
  { label: "Fetching resource updates", progress: 50, icon: Download },
  { label: "Processing changes", progress: 75, icon: Cpu },
  { label: "Updating dashboard", progress: 100, icon: CheckCircle },
];
