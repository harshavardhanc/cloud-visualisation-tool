import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cloud,
  Server,
  Database,
  Shield,
  Activity,
  Search,
  Filter,
  Settings,
  Globe,
  Cpu,
  HardDrive,
  Network,
  Lock,
  AlertTriangle,
  CheckCircle,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Resources come from context - no need for mock data

const statusColors = {
  running: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  stopped: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const statusIcons = {
  running: CheckCircle,
  active: CheckCircle,
  stopped: Circle,
  error: AlertTriangle,
};

const providerInfo = {
  aws: { name: "AWS", icon: "🟠", color: "text-orange-600" },
  azure: { name: "Azure", icon: "🔵", color: "text-blue-600" },
  gcp: { name: "GCP", icon: "🔴", color: "text-red-600" },
};

const resourceTypeIcons = {
  "EC2 Instance": Server,
  "RDS Database": Database,
  "Application Load Balancer": Network,
  "S3 Bucket": HardDrive,
  "Virtual Machine": Server,
  "Kubernetes Cluster": Cpu,
};

export default function Resources() {
  const { state } = useApp();
  const resources = state.resources;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedResourceType, setSelectedResourceType] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedAccount, setSelectedAccount] = useState("all");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesProvider =
      selectedProvider === "all" || resource.provider === selectedProvider;
    const matchesStatus =
      selectedStatus === "all" || resource.status === selectedStatus;
    const matchesResourceType =
      selectedResourceType === "all" || resource.type === selectedResourceType;
    const matchesRegion =
      selectedRegion === "all" || resource.region === selectedRegion;
    const matchesAccount =
      selectedAccount === "all" || resource.account === selectedAccount;

    return (
      matchesSearch &&
      matchesProvider &&
      matchesStatus &&
      matchesResourceType &&
      matchesRegion &&
      matchesAccount
    );
  });

  // Group resources by type
  const groupedResources = filteredResources.reduce(
    (acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = [];
      }
      acc[resource.type].push(resource);
      return acc;
    },
    {} as Record<string, typeof resources>,
  );

  // Get unique values for filter options
  const uniqueResourceTypes = [...new Set(resources.map((r) => r.type))];
  const uniqueRegions = [...new Set(resources.map((r) => r.region))];
  const uniqueAccounts = [...new Set(resources.map((r) => r.account))];
  const uniqueStatuses = [...new Set(resources.map((r) => r.status))];
  const uniqueProviders = [...new Set(resources.map((r) => r.provider))];

  const resourceTypeCategories = {
    Compute: ["EC2 Instance", "Virtual Machine", "Kubernetes Cluster"],
    Storage: ["S3 Bucket", "RDS Database"],
    Networking: ["Application Load Balancer"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  CloudViz
                </h1>
              </Link>
              <Badge variant="secondary">Resource Explorer</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resource Filters</CardTitle>
            <CardDescription>
              Filter and search through your cloud resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {uniqueProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {providerInfo[provider as keyof typeof providerInfo]
                        ?.name || provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedResourceType}
                onValueChange={setSelectedResourceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Resource Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueResourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {uniqueRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {uniqueAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedProvider("all");
                    setSelectedStatus("all");
                    setSelectedResourceType("all");
                    setSelectedRegion("all");
                    setSelectedAccount("all");
                  }}
                >
                  Clear Filters
                </Button>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {filteredResources.length} of {resources.length} resources
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resources
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredResources.length}
              </div>
              <p className="text-xs text-muted-foreground">
                of {resources.length} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  filteredResources.filter(
                    (r) => r.status === "running" || r.status === "active",
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Active resources</p>
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
              <div className="text-2xl font-bold">
                $
                {filteredResources
                  .reduce(
                    (acc, r) =>
                      acc + parseFloat(r.cost.replace(/[$,\/month]/g, "")),
                    0,
                  )
                  .toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Providers</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(filteredResources.map((r) => r.provider)).size}
              </div>
              <p className="text-xs text-muted-foreground">Cloud providers</p>
            </CardContent>
          </Card>
        </div>

        {/* Resources List */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Click on any resource to view detailed usage and cost information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No resources found matching your filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResources.map((resource) => {
                  const provider =
                    providerInfo[
                      resource.provider as keyof typeof providerInfo
                    ];
                  const StatusIcon =
                    statusIcons[resource.status as keyof typeof statusIcons];
                  const TypeIcon =
                    resourceTypeIcons[
                      resource.type as keyof typeof resourceTypeIcons
                    ] || Server;

                  return (
                    <Link key={resource.id} to={`/resources/${resource.id}`}>
                      <Card className="p-4 hover:shadow-md transition-all cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <TypeIcon className="h-5 w-5 text-muted-foreground" />
                              <span className="text-lg">{provider.icon}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{resource.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {resource.type}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">
                                Region
                              </p>
                              <p className="text-sm">{resource.region}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">
                                Account
                              </p>
                              <p className="text-sm">{resource.account}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">
                                Status
                              </p>
                              <Badge
                                className={cn(
                                  "text-xs",
                                  statusColors[
                                    resource.status as keyof typeof statusColors
                                  ],
                                )}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {resource.status}
                              </Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">
                                Cost
                              </p>
                              <p className="text-sm font-semibold">
                                {resource.cost}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
