import React from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DebugState() {
  const { state, actions } = useApp();

  const checkLocalStorage = () => {
    const accounts = localStorage.getItem("cloudviz-accounts");
    const resources = localStorage.getItem("cloudviz-resources");
    console.log("LocalStorage accounts:", accounts);
    console.log("LocalStorage resources:", resources);
    console.log("State accounts:", state.accounts);
    console.log("State resources:", state.resources);
    console.log("Is onboarded:", state.isOnboarded);
    console.log("Is initialized:", state.isInitialized);
  };

  const clearStorage = () => {
    localStorage.removeItem("cloudviz-accounts");
    localStorage.removeItem("cloudviz-resources");
    window.location.reload();
  };

  const addTestAccount = async () => {
    try {
      await actions.addAccount({
        name: "Test AWS Account",
        provider: "aws",
        region: "us-east-1",
        accessKey: "test-key",
        secretKey: "test-secret",
        status: "connected",
        lastSync: "Just now",
        resources: 0,
        cost: "$0.00/month",
      });
    } catch (error) {
      console.error("Failed to add test account:", error);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="text-sm text-red-700">Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs">
          <div>Accounts: {state.accounts.length}</div>
          <div>Resources: {state.resources.length}</div>
          <div>Onboarded: {state.isOnboarded.toString()}</div>
          <div>Initialized: {state.isInitialized.toString()}</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={checkLocalStorage}>
            Check
          </Button>
          <Button size="sm" variant="outline" onClick={clearStorage}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={addTestAccount}>
            Add Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
