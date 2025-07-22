import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const resources = [
  {
    id: '1',
    name: 'web-server-01',
    type: 'EC2 Instance',
    provider: 'aws',
    account: 'Production AWS',
    region: 'us-east-1',
    status: 'running',
    cpu: '85%',
    memory: '67%',
    network: '2.4 GB/s',
    cost: '$47.20/month',
    tags: ['production', 'web'],
  },
  {
    id: '2',
    name: 'database-cluster',
    type: 'RDS Database',
    provider: 'aws',
    account: 'Production AWS',
    region: 'us-east-1',
    status: 'running',
    cpu: '45%',
    memory: '78%',
    network: '1.2 GB/s',
    cost: '$156.80/month',
    tags: ['production', 'database'],
  },
  {
    id: '3',
    name: 'load-balancer-main',
    type: 'Application Load Balancer',
    provider: 'aws',
    account: 'Production AWS',
    region: 'us-east-1',
    status: 'active',
    cpu: 'N/A',
    memory: 'N/A',
    network: '5.6 GB/s',
    cost: '$22.50/month',
    tags: ['production', 'networking'],
  },
  {
    id: '4',
    name: 'storage-bucket-assets',
    type: 'S3 Bucket',
    provider: 'aws',
    account: 'Production AWS',
    region: 'us-east-1',
    status: 'active',
    cpu: 'N/A',
    memory: 'N/A',
    network: '890 MB/s',
    cost: '$34.20/month',
    tags: ['production', 'storage'],
  },
  {
    id: '5',
    name: 'dev-vm-01',
    type: 'Virtual Machine',
    provider: 'azure',
    account: 'Development Azure',
    region: 'East US',
    status: 'stopped',
    cpu: '0%',
    memory: '0%',
    network: '0 MB/s',
    cost: '$0.00/month',
    tags: ['development', 'testing'],
  },
  {
    id: '6',
    name: 'analytics-cluster',
    type: 'Kubernetes Cluster',
    provider: 'gcp',
    account: 'Main GCP Project',
    region: 'us-central1',
    status: 'running',
    cpu: '62%',
    memory: '54%',
    network: '3.2 GB/s',
    cost: '$89.40/month',
    tags: ['analytics', 'kubernetes'],
  },
];

const statusColors = {
  running: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  stopped: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusIcons = {
  running: CheckCircle,
  active: CheckCircle,
  stopped: Circle,
  error: AlertTriangle,
};

const providerInfo = {
  aws: { name: 'AWS', icon: '🟠', color: 'text-orange-600' },
  azure: { name: 'Azure', icon: '🔵', color: 'text-blue-600' },
  gcp: { name: 'GCP', icon: '🔴', color: 'text-red-600' },
};

const resourceTypeIcons = {
  'EC2 Instance': Server,
  'RDS Database': Database,
  'Application Load Balancer': Network,
  'S3 Bucket': HardDrive,
  'Virtual Machine': Server,
  'Kubernetes Cluster': Cpu,
};

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProvider = selectedProvider === 'all' || resource.provider === selectedProvider;
    const matchesStatus = selectedStatus === 'all' || resource.status === selectedStatus;
    
    return matchesSearch && matchesProvider && matchesStatus;
  });

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
              <Badge variant="secondary">
                Resource Explorer
              </Badge>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
                  <SelectItem value="gcp">GCP</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resource Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredResources.length}</div>
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
                {filteredResources.filter(r => r.status === 'running' || r.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active resources
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${filteredResources.reduce((acc, r) => acc + parseFloat(r.cost.replace(/[$,\/month]/g, '')), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Providers</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(filteredResources.map(r => r.provider)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Cloud providers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Detailed view of your cloud infrastructure resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResources.map((resource) => {
                const provider = providerInfo[resource.provider as keyof typeof providerInfo];
                const StatusIcon = statusIcons[resource.status as keyof typeof statusIcons];
                const TypeIcon = resourceTypeIcons[resource.type as keyof typeof resourceTypeIcons] || Server;

                return (
                  <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="h-6 w-6 text-muted-foreground" />
                          <span className="text-xl">{provider.icon}</span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{resource.name}</h3>
                          <p className="text-sm text-muted-foreground">{resource.type}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center space-x-1">
                              <Globe className="h-3 w-3" />
                              <span>{resource.region}</span>
                            </span>
                            <span>•</span>
                            <span>{resource.account}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <Badge className={cn("w-fit", statusColors[resource.status as keyof typeof statusColors])}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {resource.status}
                        </Badge>
                        <p className="text-sm font-semibold">{resource.cost}</p>
                      </div>
                    </div>
                    
                    {resource.status === 'running' && (
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">CPU</p>
                          <p className="text-sm font-semibold">{resource.cpu}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Memory</p>
                          <p className="text-sm font-semibold">{resource.memory}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Network</p>
                          <p className="text-sm font-semibold">{resource.network}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
            
            {filteredResources.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No resources found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
