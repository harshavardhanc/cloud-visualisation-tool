import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// Types
export interface CloudAccount {
  id: string;
  name: string;
  provider: "aws" | "azure" | "gcp";
  region: string;
  accessKey: string;
  secretKey?: string;
  subscriptionId?: string;
  projectId?: string;
  status: "connected" | "connecting" | "error" | "disconnected";
  lastSync: string;
  resources: number;
  cost: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  provider: "aws" | "azure" | "gcp";
  account: string;
  accountId: string;
  region: string;
  status: "running" | "active" | "stopped" | "error";
  cpu?: string;
  memory?: string;
  network?: string;
  cost: string;
  tags: string[];
  createdAt: string;
}

export interface AppState {
  accounts: CloudAccount[];
  resources: Resource[];
  isOnboarded: boolean;
  loading: boolean;
  error: string | null;
  currentPage: "onboarding" | "dashboard" | "resources" | "accounts";
}

// Action types
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ACCOUNT"; payload: CloudAccount }
  | {
      type: "UPDATE_ACCOUNT";
      payload: { id: string; updates: Partial<CloudAccount> };
    }
  | { type: "REMOVE_ACCOUNT"; payload: string }
  | { type: "SET_ACCOUNTS"; payload: CloudAccount[] }
  | { type: "ADD_RESOURCE"; payload: Resource }
  | { type: "SET_RESOURCES"; payload: Resource[] }
  | { type: "SET_ONBOARDED"; payload: boolean }
  | { type: "SET_CURRENT_PAGE"; payload: AppState["currentPage"] }
  | { type: "INIT_APP" };

// Initial state
const initialState: AppState = {
  accounts: [],
  resources: [],
  isOnboarded: false,
  loading: false,
  error: null,
  currentPage: "onboarding",
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "ADD_ACCOUNT":
      const newAccounts = [...state.accounts, action.payload];
      return {
        ...state,
        accounts: newAccounts,
        isOnboarded: newAccounts.length > 0,
        currentPage: newAccounts.length > 0 ? "dashboard" : "onboarding",
      };

    case "UPDATE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.id
            ? { ...account, ...action.payload.updates }
            : account,
        ),
      };

    case "REMOVE_ACCOUNT":
      const filteredAccounts = state.accounts.filter(
        (account) => account.id !== action.payload,
      );
      return {
        ...state,
        accounts: filteredAccounts,
        isOnboarded: filteredAccounts.length > 0,
        currentPage: filteredAccounts.length > 0 ? "dashboard" : "onboarding",
      };

    case "SET_ACCOUNTS":
      return {
        ...state,
        accounts: action.payload,
        isOnboarded: action.payload.length > 0,
        currentPage: action.payload.length > 0 ? "dashboard" : "onboarding",
      };

    case "ADD_RESOURCE":
      return {
        ...state,
        resources: [...state.resources, action.payload],
      };

    case "SET_RESOURCES":
      return { ...state, resources: action.payload };

    case "SET_ONBOARDED":
      return { ...state, isOnboarded: action.payload };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "INIT_APP":
      return { ...state, loading: false };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    addAccount: (
      account: Omit<CloudAccount, "id" | "createdAt">,
    ) => Promise<void>;
    removeAccount: (id: string) => Promise<void>;
    updateAccount: (
      id: string,
      updates: Partial<CloudAccount>,
    ) => Promise<void>;
    syncAccount: (id: string) => Promise<void>;
    loadAccounts: () => Promise<void>;
    loadResources: () => Promise<void>;
  };
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadAccountsFromStorage();
    loadResourcesFromStorage();
    dispatch({ type: "INIT_APP" });
  }, []);

  // Save to localStorage whenever accounts change
  useEffect(() => {
    if (state.accounts.length > 0) {
      localStorage.setItem("cloudviz-accounts", JSON.stringify(state.accounts));
    }
  }, [state.accounts]);

  // Save to localStorage whenever resources change
  useEffect(() => {
    if (state.resources.length > 0) {
      localStorage.setItem(
        "cloudviz-resources",
        JSON.stringify(state.resources),
      );
    }
  }, [state.resources]);

  const loadAccountsFromStorage = () => {
    try {
      const saved = localStorage.getItem("cloudviz-accounts");
      if (saved) {
        const accounts = JSON.parse(saved);
        dispatch({ type: "SET_ACCOUNTS", payload: accounts });
      }
    } catch (error) {
      console.error("Failed to load accounts from storage:", error);
    }
  };

  const loadResourcesFromStorage = () => {
    try {
      const saved = localStorage.getItem("cloudviz-resources");
      if (saved) {
        const resources = JSON.parse(saved);
        dispatch({ type: "SET_RESOURCES", payload: resources });
      }
    } catch (error) {
      console.error("Failed to load resources from storage:", error);
    }
  };

  const actions = {
    addAccount: async (accountData: Omit<CloudAccount, "id" | "createdAt">) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newAccount: CloudAccount = {
          ...accountData,
          id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          status: "connected",
          lastSync: "Just now",
          resources: Math.floor(Math.random() * 100) + 10,
          cost: `$${(Math.random() * 500 + 50).toFixed(2)}/month`,
        };

        dispatch({ type: "ADD_ACCOUNT", payload: newAccount });

        // Generate some mock resources for the new account
        const mockResources = generateMockResources(newAccount);
        mockResources.forEach((resource) => {
          dispatch({ type: "ADD_RESOURCE", payload: resource });
        });

        dispatch({ type: "SET_ERROR", payload: null });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to add account" });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    removeAccount: async (id: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatch({ type: "REMOVE_ACCOUNT", payload: id });

        // Remove associated resources
        const updatedResources = state.resources.filter(
          (resource) => resource.accountId !== id,
        );
        dispatch({ type: "SET_RESOURCES", payload: updatedResources });

        dispatch({ type: "SET_ERROR", payload: null });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to remove account" });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    updateAccount: async (id: string, updates: Partial<CloudAccount>) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        dispatch({ type: "UPDATE_ACCOUNT", payload: { id, updates } });
        dispatch({ type: "SET_ERROR", payload: null });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to update account" });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    syncAccount: async (id: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Simulate sync operation
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const updates = {
          lastSync: "Just now",
          resources: Math.floor(Math.random() * 100) + 10,
          cost: `$${(Math.random() * 500 + 50).toFixed(2)}/month`,
        };

        dispatch({ type: "UPDATE_ACCOUNT", payload: { id, updates } });
        dispatch({ type: "SET_ERROR", payload: null });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to sync account" });
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    loadAccounts: async () => {
      loadAccountsFromStorage();
    },

    loadResources: async () => {
      loadResourcesFromStorage();
    },
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Helper function to generate mock resources
function generateMockResources(account: CloudAccount): Resource[] {
  const resourceTypes = {
    aws: [
      "EC2 Instance",
      "RDS Database",
      "S3 Bucket",
      "Lambda Function",
      "Load Balancer",
    ],
    azure: [
      "Virtual Machine",
      "SQL Database",
      "Storage Account",
      "Function App",
      "Application Gateway",
    ],
    gcp: [
      "Compute Engine",
      "Cloud SQL",
      "Cloud Storage",
      "Cloud Functions",
      "Load Balancer",
    ],
  };

  const types = resourceTypes[account.provider];
  const count = Math.floor(Math.random() * 8) + 3;
  const resources: Resource[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const resource: Resource = {
      id: `res_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`,
      name: `${type.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
      type,
      provider: account.provider,
      account: account.name,
      accountId: account.id,
      region: account.region,
      status: ["running", "active", "stopped"][
        Math.floor(Math.random() * 3)
      ] as any,
      cpu:
        Math.random() > 0.3
          ? `${Math.floor(Math.random() * 80) + 10}%`
          : undefined,
      memory:
        Math.random() > 0.3
          ? `${Math.floor(Math.random() * 80) + 10}%`
          : undefined,
      network:
        Math.random() > 0.5
          ? `${(Math.random() * 5 + 0.1).toFixed(1)} GB/s`
          : undefined,
      cost: `$${(Math.random() * 200 + 10).toFixed(2)}/month`,
      tags: ["production", "development", "staging", "test"].slice(
        0,
        Math.floor(Math.random() * 3) + 1,
      ),
      createdAt: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
    resources.push(resource);
  }

  return resources;
}
