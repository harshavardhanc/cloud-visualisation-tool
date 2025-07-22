import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Plus, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ElementType;
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Cloud,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <Icon className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{description}</p>
          {action && (
            <Button onClick={action.onClick} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
