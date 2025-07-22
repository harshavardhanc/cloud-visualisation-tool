import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Cloud,
  Server,
  Database,
  Shield,
  Activity,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cloudProviders = [
  {
    id: "aws",
    name: "Amazon Web Services",
    icon: "🟠",
    accounts: 3,
    resources: 247,
    status: "connected",
    lastSync: "2 minutes ago",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600",
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    icon: "🔵",
    accounts: 2,
    resources: 156,
    status: "connected",
    lastSync: "5 minutes ago",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600",
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    icon: "🔴",
    accounts: 1,
    resources: 89,
    status: "syncing",
    lastSync: "Syncing...",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600",
  },
];

const resourceTypes = [
  {
    name: "Compute Instances",
    count: 47,
    icon: Server,
    color: "text-blue-600",
  },
  {
    name: "Storage Buckets",
    count: 23,
    icon: Database,
    color: "text-green-600",
  },
  {
    name: "Load Balancers",
    count: 12,
    icon: Activity,
    color: "text-purple-600",
  },
  {
    name: "Security Groups",
    count: 34,
    icon: Shield,
    color: "text-orange-600",
  },
];

export default function Index() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  CloudViz
                </h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Multi-Cloud Infrastructure Visualization
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resources
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">492</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Connected Accounts
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">
                Across 3 providers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Cost
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,847</div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+2% improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Cloud Providers */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Cloud Providers</h2>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Connect Provider
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cloudProviders.map((provider) => (
              <Card
                key={provider.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  provider.bgColor,
                  provider.borderColor,
                  selectedProvider === provider.id && "ring-2 ring-primary",
                )}
                onClick={() => setSelectedProvider(provider.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <CardTitle className="text-lg">
                          {provider.name}
                        </CardTitle>
                        <CardDescription>
                          {provider.accounts} account
                          {provider.accounts > 1 ? "s" : ""} connected
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        provider.status === "connected"
                          ? "default"
                          : "secondary"
                      }
                      className={cn(
                        provider.status === "connected" &&
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                        provider.status === "syncing" &&
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                      )}
                    >
                      {provider.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Resources</p>
                      <p className="text-2xl font-bold">{provider.resources}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Sync</p>
                      <p className="text-sm">{provider.lastSync}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resource Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Overview</CardTitle>
            <CardDescription>
              Distribution of resources across all connected cloud accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="by-provider">By Provider</TabsTrigger>
                <TabsTrigger value="by-region">By Region</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {resourceTypes.map((resource) => (
                    <Card key={resource.name} className="p-4">
                      <div className="flex items-center space-x-3">
                        <resource.icon
                          className={cn("h-8 w-8", resource.color)}
                        />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {resource.name}
                          </p>
                          <p className="text-2xl font-bold">{resource.count}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-6 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Infrastructure Health
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Healthy: 456 resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Warning: 23 resources</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Critical: 3 resources</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="by-provider" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Provider-specific resource breakdown coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="by-region" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Regional resource distribution coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
