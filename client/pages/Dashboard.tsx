import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Cloud, 
  Server, 
  Database, 
  Shield, 
  Activity, 
  Users, 
  Settings,
  Edit,
  Trash2,
  Key,
  Globe,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const accounts = [
  {
    id: '1',
    name: 'Production AWS',
    provider: 'aws',
    region: 'us-east-1',
    accessKey: 'AKIA***************',
    status: 'connected',
    lastSync: '2 minutes ago',
    resources: 147,
    cost: '$1,247',
  },
  {
    id: '2',
    name: 'Staging AWS',
    provider: 'aws',
    region: 'us-west-2',
    accessKey: 'AKIA***************',
    status: 'connected',
    lastSync: '5 minutes ago',
    resources: 89,
    cost: '$456',
  },
  {
    id: '3',
    name: 'Dev AWS',
    provider: 'aws',
    region: 'eu-west-1',
    accessKey: 'AKIA***************',
    status: 'error',
    lastSync: '2 hours ago',
    resources: 23,
    cost: '$89',
  },
  {
    id: '4',
    name: 'Production Azure',
    provider: 'azure',
    region: 'East US',
    accessKey: 'sub-***************',
    status: 'connected',
    lastSync: '3 minutes ago',
    resources: 98,
    cost: '$789',
  },
  {
    id: '5',
    name: 'Development Azure',
    provider: 'azure',
    region: 'West Europe',
    accessKey: 'sub-***************',
    status: 'syncing',
    lastSync: 'Syncing...',
    resources: 45,
    cost: '$234',
  },
  {
    id: '6',
    name: 'Main GCP Project',
    provider: 'gcp',
    region: 'us-central1',
    accessKey: 'project-***********',
    status: 'connected',
    lastSync: '1 minute ago',
    resources: 67,
    cost: '$567',
  },
];

const providerInfo = {
  aws: { name: 'AWS', icon: '🟠', color: 'text-orange-600' },
  azure: { name: 'Azure', icon: '🔵', color: 'text-blue-600' },
  gcp: { name: 'GCP', icon: '🔴', color: 'text-red-600' },
};

const statusInfo = {
  connected: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle2 },
  syncing: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
  error: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: AlertCircle },
};

export default function Dashboard() {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const filteredAccounts = selectedProvider === 'all' 
    ? accounts 
    : accounts.filter(account => account.provider === selectedProvider);

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
              <Badge variant="secondary">
                Account Management
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Cloud Account</DialogTitle>
                    <DialogDescription>
                      Connect a new cloud account to monitor your infrastructure.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="provider">Cloud Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">Amazon Web Services</SelectItem>
                          <SelectItem value="azure">Microsoft Azure</SelectItem>
                          <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Account Name</Label>
                      <Input id="name" placeholder="e.g., Production AWS" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="region">Default Region</Label>
                      <Input id="region" placeholder="e.g., us-east-1" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="credentials">Access Credentials</Label>
                      <Input id="credentials" type="password" placeholder="Access key or subscription ID" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={() => setIsAddAccountOpen(false)}>
                      Connect Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <Tabs value={selectedProvider} onValueChange={setSelectedProvider} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Accounts</TabsTrigger>
              <TabsTrigger value="aws">AWS</TabsTrigger>
              <TabsTrigger value="azure">Azure</TabsTrigger>
              <TabsTrigger value="gcp">GCP</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => {
            const provider = providerInfo[account.provider as keyof typeof providerInfo];
            const status = statusInfo[account.status as keyof typeof statusInfo];
            const StatusIcon = status.icon;

            return (
              <Card key={account.id} className="relative group hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Globe className="h-3 w-3" />
                          <span>{account.region}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className={cn("w-fit", status.color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {account.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Resources</p>
                      <p className="text-xl font-semibold">{account.resources}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Cost</p>
                      <p className="text-xl font-semibold">{account.cost}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Access Key</span>
                      <span className="font-mono text-xs">{account.accessKey}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span>{account.lastSync}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      View Resources
                    </Button>
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Account Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>
              Overview of all connected cloud accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{accounts.length}</div>
                <div className="text-sm text-muted-foreground">Total Accounts</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Server className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">
                  {accounts.filter(a => a.status === 'connected').length}
                </div>
                <div className="text-sm text-muted-foreground">Connected</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">
                  {accounts.filter(a => a.status === 'syncing').length}
                </div>
                <div className="text-sm text-muted-foreground">Syncing</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">
                  {accounts.filter(a => a.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
