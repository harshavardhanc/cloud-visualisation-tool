import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Plus, 
  CheckCircle, 
  ArrowRight, 
  Server, 
  Database, 
  Shield, 
  BarChart3,
  Zap,
  Globe,
  Eye,
  Settings,
  Sparkles,
  Loader2,
  Timer,
  Search,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

const onboardingSteps = [
  {
    id: 1,
    title: 'Welcome to CloudViz',
    description: 'Your multi-cloud infrastructure visualization platform',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Connect Your Account',
    description: 'Add AWS, Azure, or GCP account to get started',
    icon: Plus,
  },
  {
    id: 3,
    title: 'Discovering Resources',
    description: 'Scanning your cloud infrastructure',
    icon: Search,
  },
  {
    id: 4,
    title: 'Ready to Explore',
    description: 'Your dashboard is ready',
    icon: Eye,
  },
];

const connectionSteps = [
  { label: 'Validating credentials', progress: 20, icon: Shield },
  { label: 'Establishing connection', progress: 40, icon: Globe },
  { label: 'Discovering resources', progress: 60, icon: Search },
  { label: 'Organizing data', progress: 80, icon: Database },
  { label: 'Finalizing setup', progress: 100, icon: CheckCircle },
];

const cloudProviders = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    icon: '🟠',
    description: 'Connect your AWS account to monitor EC2, RDS, S3, and more',
    color: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
    fields: [
      { key: 'accessKey', label: 'Access Key ID', type: 'text', placeholder: 'AKIA...', required: true },
      { key: 'secretKey', label: 'Secret Access Key', type: 'password', placeholder: 'Your secret key', required: true },
      { key: 'region', label: 'Default Region', type: 'select', options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'], required: true },
    ],
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    icon: '🔵',
    description: 'Connect your Azure subscription to monitor VMs, databases, and storage',
    color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    fields: [
      { key: 'subscriptionId', label: 'Subscription ID', type: 'text', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', required: true },
      { key: 'accessKey', label: 'Client ID', type: 'text', placeholder: 'Your client ID', required: true },
      { key: 'secretKey', label: 'Client Secret', type: 'password', placeholder: 'Your client secret', required: true },
      { key: 'region', label: 'Default Region', type: 'select', options: ['East US', 'West Europe', 'Southeast Asia', 'Central India'], required: true },
    ],
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    icon: '🔴',
    description: 'Connect your GCP project to monitor Compute Engine, Cloud SQL, and storage',
    color: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
    fields: [
      { key: 'projectId', label: 'Project ID', type: 'text', placeholder: 'my-project-id', required: true },
      { key: 'accessKey', label: 'Service Account Key', type: 'textarea', placeholder: 'Paste your service account JSON key...', required: true },
      { key: 'region', label: 'Default Region', type: 'select', options: ['us-central1', 'us-east1', 'europe-west1', 'asia-southeast1'], required: true },
    ],
  },
];

const features = [
  {
    icon: Server,
    title: 'Resource Monitoring',
    description: 'Track all your cloud resources in one place',
  },
  {
    icon: BarChart3,
    title: 'Cost Analysis',
    description: 'Monitor and optimize your cloud spending',
  },
  {
    icon: Shield,
    title: 'Security Insights',
    description: 'Get security recommendations and alerts',
  },
  {
    icon: Zap,
    title: 'Performance Metrics',
    description: 'Real-time performance monitoring',
  },
];

export default function ImprovedOnboarding() {
  const { state, actions } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [accountForm, setAccountForm] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [currentConnectionStep, setCurrentConnectionStep] = useState(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAddAccount = () => {
    setIsAddAccountOpen(true);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setAccountForm({ provider: providerId });
  };

  const handleFormChange = (key: string, value: string) => {
    setAccountForm(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const provider = cloudProviders.find(p => p.id === selectedProvider);
    if (!provider) return false;

    const requiredFields = provider.fields.filter(f => f.required);
    return requiredFields.every(field => accountForm[field.key]?.trim());
  };

  const simulateConnectionProgress = async () => {
    setConnectionProgress(0);
    setCurrentConnectionStep(0);
    
    for (let i = 0; i < connectionSteps.length; i++) {
      setCurrentConnectionStep(i);
      
      // Simulate realistic timing for each step
      const stepDuration = i === 2 ? 2000 : 1000; // Discovery takes longer
      
      await new Promise(resolve => {
        const interval = setInterval(() => {
          setConnectionProgress(prev => {
            const newProgress = Math.min(prev + 2, connectionSteps[i].progress);
            if (newProgress >= connectionSteps[i].progress) {
              clearInterval(interval);
              resolve(void 0);
            }
            return newProgress;
          });
        }, stepDuration / 50);
      });
      
      // Small pause between steps
      if (i < connectionSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  const handleConnectAccount = async () => {
    if (!selectedProvider || !validateForm()) return;

    setIsConnecting(true);
    setConnectionError(null);
    setCurrentStep(3);

    try {
      // Simulate connection progress
      await simulateConnectionProgress();

      const provider = cloudProviders.find(p => p.id === selectedProvider);
      const accountName = accountForm.name?.trim() || `${provider?.name} Account`;

      await actions.addAccount({
        name: accountName,
        provider: selectedProvider as any,
        region: accountForm.region || provider?.fields.find(f => f.key === 'region')?.options?.[0] || '',
        accessKey: accountForm.accessKey || '',
        secretKey: accountForm.secretKey,
        subscriptionId: accountForm.subscriptionId,
        projectId: accountForm.projectId,
        status: 'connected',
        lastSync: 'Just now',
        resources: 0,
        cost: '$0.00/month',
      });

      setCurrentStep(4);
      setIsAddAccountOpen(false);

      // Auto-redirect to dashboard after success
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Failed to add account:', error);
      setConnectionError('Failed to connect account. Please check your credentials and try again.');
      setCurrentStep(2);
    } finally {
      setIsConnecting(false);
    }
  };

  const selectedProviderData = cloudProviders.find(p => p.id === selectedProvider);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                CloudViz
              </h1>
            </div>
            <Badge variant="secondary">
              Step {currentStep} of {onboardingSteps.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={cn(
                    "w-24 h-0.5 mx-4 transition-all",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / onboardingSteps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Welcome to CloudViz</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The ultimate multi-cloud infrastructure visualization platform. Monitor, analyze, and optimize your AWS, Azure, and GCP resources from a single dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleNext} size="lg" className="px-8">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Connect Your First Account</h2>
              <p className="text-lg text-muted-foreground">
                Choose your cloud provider to start monitoring your infrastructure
              </p>
              {connectionError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{connectionError}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cloudProviders.map((provider) => (
                <Card 
                  key={provider.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    provider.color,
                    selectedProvider === provider.id && "ring-2 ring-primary"
                  )}
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{provider.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{provider.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedProvider && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedProviderData?.icon}</span>
                    <CardTitle>Connect {selectedProviderData?.name}</CardTitle>
                  </div>
                  <CardDescription>
                    Enter your credentials to connect your {selectedProviderData?.name} account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="accountName">Account Name (Optional)</Label>
                    <Input
                      id="accountName"
                      placeholder={`My ${selectedProviderData?.name} Account`}
                      value={accountForm.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  </div>

                  {selectedProviderData?.fields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {field.type === 'select' ? (
                        <Select onValueChange={(value) => handleFormChange(field.key, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={field.key}
                          className="w-full p-2 border rounded-md resize-none h-24 text-sm"
                          placeholder={field.placeholder}
                          value={accountForm[field.key] || ''}
                          onChange={(e) => handleFormChange(field.key, e.target.value)}
                        />
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={accountForm[field.key] || ''}
                          onChange={(e) => handleFormChange(field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-4">
                    <Button 
                      onClick={handleConnectAccount} 
                      disabled={!validateForm()} 
                      className="w-full"
                      size="lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connect Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Connecting Your Account</h2>
              <p className="text-lg text-muted-foreground">
                Please wait while we establish a secure connection and discover your resources
              </p>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">{selectedProviderData?.icon}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Connection Progress</span>
                    <span className="text-sm text-muted-foreground">{connectionProgress}%</span>
                  </div>
                  <Progress value={connectionProgress} className="h-3" />
                </div>

                <div className="space-y-3">
                  {connectionSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentConnectionStep;
                    const isCompleted = index < currentConnectionStep;
                    
                    return (
                      <div key={index} className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg transition-all",
                        isActive && "bg-primary/10 border border-primary/20",
                        isCompleted && "opacity-75"
                      )}>
                        <div className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full",
                          isCompleted ? "bg-green-100 text-green-600" : 
                          isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <StepIcon className="h-4 w-4" />
                          )}
                        </div>
                        <span className={cn(
                          "font-medium",
                          isActive && "text-primary"
                        )}>
                          {step.label}
                        </span>
                        {isActive && (
                          <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-green-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl mt-1">{selectedProviderData?.icon}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold">🎉 Successfully Connected!</h2>
              <p className="text-lg text-muted-foreground">
                Your {selectedProviderData?.name} account has been connected successfully. 
                We've discovered your resources and you're ready to explore your infrastructure.
              </p>
            </div>

            <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-sm text-muted-foreground">Resources Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${(Math.random() * 500 + 50).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Cost</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(Math.random() * 30) + 85}%
                  </div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Redirecting to your dashboard in a few seconds...
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Timer className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Auto-redirecting...</span>
              </div>
            </div>

            <Button onClick={() => window.location.reload()} size="lg" className="px-8">
              <BarChart3 className="h-4 w-4 mr-2" />
              Go to Dashboard Now
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
