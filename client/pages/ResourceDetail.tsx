import React from "react";
import { Link, useParams } from "react-router-dom";
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
  Cloud,
  Server,
  Database,
  ArrowLeft,
  Activity,
  Globe,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle,
  Circle,
  DollarSign,
  Calendar,
  Tag,
  Settings,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - in real app this would come from API
const resources = [
  {
    id: "1",
    name: "web-server-01",
    type: "EC2 Instance",
    provider: "aws",
    account: "Production AWS",
    region: "us-east-1",
    status: "running",
    cpu: "85%",
    memory: "67%",
    network: "2.4 GB/s",
    cost: "$47.20/month",
    tags: ["production", "web"],
    instanceType: "t3.medium",
    launchDate: "2024-01-15",
    uptime: "45 days",
    publicIp: "54.123.45.67",
    privateIp: "10.0.1.45",
    securityGroups: ["sg-web-servers", "sg-ssh-access"],
    costHistory: [
      { month: "Jan", cost: 42.3 },
      { month: "Feb", cost: 45.8 },
      { month: "Mar", cost: 47.2 },
    ],
    usageMetrics: {
      cpuUtilization: [
        { time: "00:00", value: 45 },
        { time: "04:00", value: 32 },
        { time: "08:00", value: 78 },
        { time: "12:00", value: 85 },
        { time: "16:00", value: 92 },
        { time: "20:00", value: 67 },
      ],
      memoryUtilization: [
        { time: "00:00", value: 55 },
        { time: "04:00", value: 48 },
        { time: "08:00", value: 62 },
        { time: "12:00", value: 67 },
        { time: "16:00", value: 71 },
        { time: "20:00", value: 59 },
      ],
      networkIn: "1.2 TB",
      networkOut: "890 GB",
      diskRead: "45 GB",
      diskWrite: "23 GB",
    },
  },
  {
    id: "2",
    name: "database-cluster",
    type: "RDS Database",
    provider: "aws",
    account: "Production AWS",
    region: "us-east-1",
    status: "running",
    cpu: "45%",
    memory: "78%",
    network: "1.2 GB/s",
    cost: "$156.80/month",
    tags: ["production", "database"],
    instanceType: "db.r5.large",
    launchDate: "2024-01-10",
    uptime: "50 days",
    engine: "PostgreSQL 14.9",
    storageSize: "500 GB",
    backupRetention: "7 days",
    costHistory: [
      { month: "Jan", cost: 148.5 },
      { month: "Feb", cost: 152.3 },
      { month: "Mar", cost: 156.8 },
    ],
    usageMetrics: {
      cpuUtilization: [
        { time: "00:00", value: 25 },
        { time: "04:00", value: 18 },
        { time: "08:00", value: 42 },
        { time: "12:00", value: 45 },
        { time: "16:00", value: 52 },
        { time: "20:00", value: 38 },
      ],
      memoryUtilization: [
        { time: "00:00", value: 72 },
        { time: "04:00", value: 68 },
        { time: "08:00", value: 75 },
        { time: "12:00", value: 78 },
        { time: "16:00", value: 81 },
        { time: "20:00", value: 74 },
      ],
      connections: "45/100",
      queries: "1,250/hour",
      storageUsed: "320 GB",
      iops: "2,400/sec",
    },
  },
  {
    id: "3",
    name: "load-balancer-main",
    type: "Application Load Balancer",
    provider: "aws",
    account: "Production AWS",
    region: "us-east-1",
    status: "active",
    cpu: "N/A",
    memory: "N/A",
    network: "5.6 GB/s",
    cost: "$22.50/month",
    tags: ["production", "networking"],
    instanceType: "Application Load Balancer",
    launchDate: "2024-01-20",
    uptime: "40 days",
    costHistory: [
      { month: "Jan", cost: 21.8 },
      { month: "Feb", cost: 22.1 },
      { month: "Mar", cost: 22.5 },
    ],
    usageMetrics: {
      requests: "15,000/hour",
      activeConnections: "1,250",
      networkIn: "2.1 TB",
      networkOut: "1.8 TB",
    },
  },
  {
    id: "4",
    name: "storage-bucket-assets",
    type: "S3 Bucket",
    provider: "aws",
    account: "Production AWS",
    region: "us-east-1",
    status: "active",
    cpu: "N/A",
    memory: "N/A",
    network: "890 MB/s",
    cost: "$34.20/month",
    tags: ["production", "storage"],
    instanceType: "S3 Standard",
    launchDate: "2024-01-05",
    uptime: "55 days",
    storageSize: "2.3 TB",
    costHistory: [
      { month: "Jan", cost: 31.2 },
      { month: "Feb", cost: 32.8 },
      { month: "Mar", cost: 34.2 },
    ],
    usageMetrics: {
      objects: "45,678",
      storageUsed: "2.3 TB",
      requests: "8,500/day",
      dataTransfer: "890 GB/month",
    },
  },
  {
    id: "5",
    name: "dev-vm-01",
    type: "Virtual Machine",
    provider: "azure",
    account: "Development Azure",
    region: "East US",
    status: "stopped",
    cpu: "0%",
    memory: "0%",
    network: "0 MB/s",
    cost: "$0.00/month",
    tags: ["development", "testing"],
    instanceType: "Standard_B2s",
    launchDate: "2024-02-01",
    uptime: "0 days",
    costHistory: [
      { month: "Jan", cost: 0 },
      { month: "Feb", cost: 28.5 },
      { month: "Mar", cost: 0 },
    ],
    usageMetrics: {
      cpuUtilization: [],
      memoryUtilization: [],
    },
  },
  {
    id: "6",
    name: "analytics-cluster",
    type: "Kubernetes Cluster",
    provider: "gcp",
    account: "Main GCP Project",
    region: "us-central1",
    status: "running",
    cpu: "62%",
    memory: "54%",
    network: "3.2 GB/s",
    cost: "$89.40/month",
    tags: ["analytics", "kubernetes"],
    instanceType: "GKE Standard",
    launchDate: "2024-01-25",
    uptime: "35 days",
    nodes: "6 nodes",
    costHistory: [
      { month: "Jan", cost: 82.3 },
      { month: "Feb", cost: 86.1 },
      { month: "Mar", cost: 89.4 },
    ],
    usageMetrics: {
      cpuUtilization: [
        { time: "00:00", value: 45 },
        { time: "04:00", value: 32 },
        { time: "08:00", value: 58 },
        { time: "12:00", value: 62 },
        { time: "16:00", value: 72 },
        { time: "20:00", value: 55 },
      ],
      memoryUtilization: [
        { time: "00:00", value: 48 },
        { time: "04:00", value: 42 },
        { time: "08:00", value: 51 },
        { time: "12:00", value: 54 },
        { time: "16:00", value: 58 },
        { time: "20:00", value: 49 },
      ],
      pods: "45 running",
      services: "12 active",
    },
  },
];

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

export default function ResourceDetail() {
  const { state } = useApp();
  const { id } = useParams();
  const resource = state.resources.find((r) => r.id === id);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Resource Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested resource could not be found.
            </p>
            <Link to="/resources">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const provider = providerInfo[resource.provider as keyof typeof providerInfo];
  const StatusIcon = statusIcons[resource.status as keyof typeof statusIcons];
  const TypeIcon =
    resourceTypeIcons[resource.type as keyof typeof resourceTypeIcons] ||
    Server;

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
              <Badge variant="secondary">Resource Details</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/resources">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Resources
                </Button>
              </Link>
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
        {/* Resource Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                  <TypeIcon className="h-8 w-8 text-primary" />
                  <span className="text-2xl">{provider.icon}</span>
                </div>
                <div>
                  <CardTitle className="text-2xl">{resource.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {resource.type}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center space-x-1 text-sm">
                      <Globe className="h-4 w-4" />
                      <span>{resource.region}</span>
                    </span>
                    <span>•</span>
                    <span className="text-sm">{resource.account}</span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <Badge
                  className={cn(
                    "text-sm",
                    statusColors[resource.status as keyof typeof statusColors],
                  )}
                >
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {resource.status}
                </Badge>
                <p className="text-lg font-bold">{resource.cost}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resource.cpu}</div>
              <Progress value={parseInt(resource.cpu)} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Memory Usage
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resource.memory}</div>
              <Progress value={parseInt(resource.memory)} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resource.network}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Current throughput
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resource.uptime}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Since {resource.launchDate}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Instance Type
                      </p>
                      <p className="font-medium">{resource.instanceType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Launch Date
                      </p>
                      <p className="font-medium">{resource.launchDate}</p>
                    </div>
                    {resource.publicIp && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Public IP
                        </p>
                        <p className="font-medium font-mono text-sm">
                          {resource.publicIp}
                        </p>
                      </div>
                    )}
                    {resource.privateIp && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Private IP
                        </p>
                        <p className="font-medium font-mono text-sm">
                          {resource.privateIp}
                        </p>
                      </div>
                    )}
                    {resource.engine && (
                      <div>
                        <p className="text-sm text-muted-foreground">Engine</p>
                        <p className="font-medium">{resource.engine}</p>
                      </div>
                    )}
                    {resource.storageSize && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Storage Size
                        </p>
                        <p className="font-medium">{resource.storageSize}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags & Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {resource.securityGroups && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Security Groups
                      </p>
                      <div className="space-y-1">
                        {resource.securityGroups.map((sg) => (
                          <Badge
                            key={sg}
                            variant="secondary"
                            className="block w-fit"
                          >
                            {sg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CPU Utilization (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resource.usageMetrics.cpuUtilization.map(
                      (metric, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{metric.time}</span>
                          <div className="flex items-center space-x-2 w-32">
                            <Progress value={metric.value} className="flex-1" />
                            <span className="text-sm w-10">
                              {metric.value}%
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Memory Utilization (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resource.usageMetrics.memoryUtilization.map(
                      (metric, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{metric.time}</span>
                          <div className="flex items-center space-x-2 w-32">
                            <Progress value={metric.value} className="flex-1" />
                            <span className="text-sm w-10">
                              {metric.value}%
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network & Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {resource.usageMetrics.networkIn && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Network In
                        </p>
                        <p className="text-lg font-semibold">
                          {resource.usageMetrics.networkIn}
                        </p>
                      </div>
                    )}
                    {resource.usageMetrics.networkOut && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Network Out
                        </p>
                        <p className="text-lg font-semibold">
                          {resource.usageMetrics.networkOut}
                        </p>
                      </div>
                    )}
                    {resource.usageMetrics.diskRead && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Disk Read
                        </p>
                        <p className="text-lg font-semibold">
                          {resource.usageMetrics.diskRead}
                        </p>
                      </div>
                    )}
                    {resource.usageMetrics.diskWrite && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Disk Write
                        </p>
                        <p className="text-lg font-semibold">
                          {resource.usageMetrics.diskWrite}
                        </p>
                      </div>
                    )}
                    {resource.usageMetrics.connections && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          DB Connections
                        </p>
                        <p className="text-lg font-semibold">
                          {resource.usageMetrics.connections}
                        </p>
                      </div>
                    )}
                    {resource.usageMetrics.queries && (
                      <div>
                        <p className="text-sm text-muted-foreground">Queries</p>
                        <p className="text-lg font-semibold">
                          {resource.usageMetrics.queries}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost History</CardTitle>
                  <CardDescription>
                    Monthly costs for the last 3 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resource.costHistory.map((cost, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{cost.month} 2024</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">${cost.cost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Current month cost analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Compute Cost</span>
                      <span className="font-semibold">
                        $
                        {(
                          parseFloat(
                            resource.cost.replace(/[$,\/month]/g, ""),
                          ) * 0.7
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Storage Cost</span>
                      <span className="font-semibold">
                        $
                        {(
                          parseFloat(
                            resource.cost.replace(/[$,\/month]/g, ""),
                          ) * 0.2
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Network Cost</span>
                      <span className="font-semibold">
                        $
                        {(
                          parseFloat(
                            resource.cost.replace(/[$,\/month]/g, ""),
                          ) * 0.1
                        ).toFixed(2)}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Monthly Cost</span>
                      <span>{resource.cost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Configuration</CardTitle>
                <CardDescription>
                  Detailed configuration and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Basic Configuration</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Resource ID
                        </p>
                        <p className="font-mono text-sm">{resource.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Instance Type
                        </p>
                        <p className="font-medium">{resource.instanceType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Region</p>
                        <p className="font-medium">{resource.region}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account</p>
                        <p className="font-medium">{resource.account}</p>
                      </div>
                    </div>
                  </div>

                  {resource.backupRetention && (
                    <div>
                      <h4 className="font-semibold mb-3">
                        Backup & Maintenance
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Backup Retention
                          </p>
                          <p className="font-medium">
                            {resource.backupRetention}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
