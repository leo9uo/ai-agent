'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode, createContext, useContext } from 'react'

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24

interface ApiKeys {
    mistralApiKey: string;
    finnhubApiKey: string;
    secApiKey: string;
}

interface AppContextType {
    apiKeys: ApiKeys;
    setApiKeys: (keys: ApiKeys) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: ONE_DAY_IN_MS,
                gcTime: ONE_DAY_IN_MS,
            },
        },
    }))

    const [apiKeys, setApiKeys] = useState<ApiKeys>({
        mistralApiKey: '',
        finnhubApiKey: '',
        secApiKey: '',
    });

    return (
        <AppContext.Provider value={{ apiKeys, setApiKeys }}>
            <QueryClientProvider client={queryClient}>
                {children}
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}