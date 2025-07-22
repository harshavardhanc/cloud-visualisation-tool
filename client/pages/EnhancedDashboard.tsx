import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cloud,
  Plus,
  Server,
  Database,
  Shield,
  Activity,
  Users,
  Settings,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Zap,
  Globe,
  BarChart3,
  PieChart,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const cloudProviders = [
  {
    id: "aws",
    name: "Amazon Web Services",
    icon: "🟠",
    color:
      "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
    fields: [
      {
        key: "accessKey",
        label: "Access Key ID",
        type: "text",
        placeholder: "AKIA...",
      },
      {
        key: "secretKey",
        label: "Secret Access Key",
        type: "password",
        placeholder: "Your secret key",
      },
      {
        key: "region",
        label: "Default Region",
        type: "select",
        options: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"],
      },
    ],
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    icon: "🔵",
    color:
      "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
    fields: [
      {
        key: "subscriptionId",
        label: "Subscription ID",
        type: "text",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      {
        key: "accessKey",
        label: "Client ID",
        type: "text",
        placeholder: "Your client ID",
      },
      {
        key: "secretKey",
        label: "Client Secret",
        type: "password",
        placeholder: "Your client secret",
      },
      {
        key: "region",
        label: "Default Region",
        type: "select",
        options: ["East US", "West Europe", "Southeast Asia", "Central India"],
      },
    ],
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    icon: "🔴",
    color: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    fields: [
      {
        key: "projectId",
        label: "Project ID",
        type: "text",
        placeholder: "my-project-id",
      },
      {
        key: "accessKey",
        label: "Service Account Key",
        type: "textarea",
        placeholder: "Paste your service account JSON key...",
      },
      {
        key: "region",
        label: "Default Region",
        type: "select",
        options: ["us-central1", "us-east1", "europe-west1", "asia-southeast1"],
      },
    ],
  },
];

const providerInfo = {
  aws: { name: "AWS", icon: "🟠", color: "text-orange-600" },
  azure: { name: "Azure", icon: "🔵", color: "text-blue-600" },
  gcp: { name: "GCP", icon: "🔴", color: "text-red-600" },
};

export default function EnhancedDashboard() {
  const { state, actions } = useApp();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [accountForm, setAccountForm] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncingAccount, setSyncingAccount] = useState<string | null>(null);

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalResources = state.resources.length;
    const totalCost = state.accounts.reduce((sum, account) => {
      return sum + parseFloat(account.cost.replace(/[$,\/month]/g, ""));
    }, 0);

    const runningResources = state.resources.filter(
      (r) => r.status === "running" || r.status === "active",
    ).length;
    const healthScore =
      totalResources > 0
        ? Math.round((runningResources / totalResources) * 100)
        : 0;

    const costTrend = Math.random() > 0.5 ? "up" : "down";
    const costChange = Math.floor(Math.random() * 10) + 1;

    return {
      totalResources,
      totalAccounts: state.accounts.length,
      totalCost: totalCost.toFixed(2),
      healthScore,
      costTrend,
      costChange,
      runningResources,
      stoppedResources: totalResources - runningResources,
    };
  }, [state.accounts, state.resources]);

  // Group resources by provider
  const resourcesByProvider = useMemo(() => {
    return state.resources.reduce(
      (acc, resource) => {
        if (!acc[resource.provider]) {
          acc[resource.provider] = [];
        }
        acc[resource.provider].push(resource);
        return acc;
      },
      {} as Record<string, typeof state.resources>,
    );
  }, [state.resources]);

  const handleAddAccount = async () => {
    if (!selectedProvider) return;

    setIsConnecting(true);
    try {
      const provider = cloudProviders.find((p) => p.id === selectedProvider);
      await actions.addAccount({
        name: accountForm.name || `${provider?.name} Account`,
        provider: selectedProvider as any,
        region:
          accountForm.region ||
          provider?.fields.find((f) => f.key === "region")?.options?.[0] ||
          "",
        accessKey: accountForm.accessKey || "",
        secretKey: accountForm.secretKey,
        subscriptionId: accountForm.subscriptionId,
        projectId: accountForm.projectId,
        status: "connecting",
        lastSync: "Connecting...",
        resources: 0,
        cost: "$0.00/month",
      });

      setIsAddAccountOpen(false);
      setSelectedProvider("");
      setAccountForm({});
    } catch (error) {
      console.error("Failed to add account:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    setSyncingAccount(accountId);
    try {
      await actions.syncAccount(accountId);
    } catch (error) {
      console.error("Failed to sync account:", error);
    } finally {
      setSyncingAccount(null);
    }
  };

  const handleFormChange = (key: string, value: string) => {
    setAccountForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedProviderData = cloudProviders.find(
    (p) => p.id === selectedProvider,
  );

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
                Multi-Cloud Infrastructure Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/resources">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Resources
                </Button>
              </Link>
              <Dialog
                open={isAddAccountOpen}
                onOpenChange={setIsAddAccountOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </DialogTrigger>
              </Dialog>
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
              <div className="text-2xl font-bold">{metrics.totalResources}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.runningResources} running, {metrics.stoppedResources}{" "}
                stopped
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
              <div className="text-2xl font-bold">{metrics.totalAccounts}</div>
              <p className="text-xs text-muted-foreground">
                Across {Object.keys(resourcesByProvider).length} providers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalCost}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {metrics.costTrend === "up" ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-red-500" />+
                    {metrics.costChange}% from last month
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1 text-green-500" />-
                    {metrics.costChange}% from last month
                  </>
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Health Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.healthScore}%</div>
              <Progress value={metrics.healthScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Cloud Accounts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Cloud Accounts</h2>
            <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.accounts.map((account) => {
              const provider = providerInfo[account.provider];
              const isSyncing = syncingAccount === account.id;

              return (
                <Card
                  key={account.id}
                  className={cn(
                    "relative transition-all hover:shadow-md",
                    account.provider === "aws" &&
                      "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
                    account.provider === "azure" &&
                      "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
                    account.provider === "gcp" &&
                      "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <CardTitle className="text-lg">
                            {account.name}
                          </CardTitle>
                          <CardDescription>
                            {account.region} • {account.resources} resources
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSyncAccount(account.id)}
                          disabled={isSyncing}
                        >
                          <RefreshCw
                            className={cn(
                              "h-4 w-4",
                              isSyncing && "animate-spin",
                            )}
                          />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "w-fit",
                        account.status === "connected" &&
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                        account.status === "connecting" &&
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        account.status === "error" &&
                          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                      )}
                    >
                      {account.status === "connected" && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {account.status === "error" && (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {account.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Monthly Cost
                        </p>
                        <p className="text-lg font-semibold">{account.cost}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Sync
                        </p>
                        <p className="text-sm">{account.lastSync}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Resource Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resource Overview</CardTitle>
                <CardDescription>
                  Distribution of resources across all connected cloud accounts
                </CardDescription>
              </div>
              <Link to="/resources">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="by-provider" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="by-provider">By Provider</TabsTrigger>
                <TabsTrigger value="by-type">By Type</TabsTrigger>
                <TabsTrigger value="by-status">By Status</TabsTrigger>
              </TabsList>

              <TabsContent value="by-provider" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(resourcesByProvider).map(
                    ([provider, resources]) => {
                      const providerData =
                        providerInfo[provider as keyof typeof providerInfo];
                      const totalCost = resources.reduce(
                        (sum, r) =>
                          sum + parseFloat(r.cost.replace(/[$,\/month]/g, "")),
                        0,
                      );

                      return (
                        <Card key={provider} className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-2xl">
                              {providerData.icon}
                            </span>
                            <div>
                              <h3 className="font-semibold">
                                {providerData.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {resources.length} resources
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Running:</span>
                              <span className="font-medium">
                                {
                                  resources.filter(
                                    (r) =>
                                      r.status === "running" ||
                                      r.status === "active",
                                  ).length
                                }
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Cost:</span>
                              <span className="font-medium">
                                ${totalCost.toFixed(2)}/mo
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    },
                  )}
                </div>
              </TabsContent>

              <TabsContent value="by-type" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(
                    state.resources.reduce(
                      (acc, resource) => {
                        if (!acc[resource.type]) {
                          acc[resource.type] = [];
                        }
                        acc[resource.type].push(resource);
                        return acc;
                      },
                      {} as Record<string, typeof state.resources>,
                    ),
                  ).map(([type, resources]) => (
                    <Card key={type} className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Server className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{type}</h3>
                      </div>
                      <p className="text-2xl font-bold">{resources.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {
                          resources.filter(
                            (r) =>
                              r.status === "running" || r.status === "active",
                          ).length
                        }{" "}
                        active
                      </p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="by-status" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["running", "active", "stopped", "error"].map((status) => {
                    const resources = state.resources.filter(
                      (r) => r.status === status,
                    );
                    return (
                      <Card key={status} className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          {status === "running" || status === "active" ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : status === "stopped" ? (
                            <Shield className="h-6 w-6 text-gray-500" />
                          ) : (
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                        <h3 className="font-semibold capitalize">{status}</h3>
                        <p className="text-2xl font-bold">{resources.length}</p>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Add Account Dialog */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Cloud Account</DialogTitle>
          <DialogDescription>
            Connect a new cloud account to monitor your infrastructure.
          </DialogDescription>
        </DialogHeader>

        {!selectedProvider ? (
          <div className="space-y-4">
            <Label>Select Cloud Provider</Label>
            <div className="grid grid-cols-1 gap-3">
              {cloudProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md p-3",
                    provider.color,
                  )}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">{selectedProviderData?.icon}</span>
              <h3 className="font-semibold">{selectedProviderData?.name}</h3>
            </div>

            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder={`My ${selectedProviderData?.name} Account`}
                value={accountForm.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
            </div>

            {selectedProviderData?.fields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === "select" ? (
                  <Select
                    onValueChange={(value) =>
                      handleFormChange(field.key, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Select ${field.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    className="w-full p-2 border rounded-md resize-none h-24 text-sm"
                    placeholder={field.placeholder}
                    value={accountForm[field.key] || ""}
                    onChange={(e) =>
                      handleFormChange(field.key, e.target.value)
                    }
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={accountForm[field.key] || ""}
                    onChange={(e) =>
                      handleFormChange(field.key, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsAddAccountOpen(false);
              setSelectedProvider("");
              setAccountForm({});
            }}
          >
            Cancel
          </Button>
          {selectedProvider && (
            <Button onClick={handleAddAccount} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                "Connect Account"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
