import React from 'react';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppProvider';

export const ApiKeysForm: React.FC = () => {
    const { apiKeys, setApiKeys } = useAppContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setApiKeys({ ...apiKeys, [name]: value });
    };

    return (
        <div className='flex flex-col rounded-lg p-8 gap-4'>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 flex items-start" role="alert">
                <div className="text-sm">
                    <p className="mb-2">
                        These API keys are necessary to retrieve stock information and generate memos. They allow us to access financial data from various sources.
                    </p>
                    <p>
                        The keys are stored only in your browser's memory and will be forgotten when you leave this page. We do not save this information anywhere else for your security.
                    </p>
                </div>
            </div>
            <div className='flex gap-2 justify-between sm:flex-row flex-col'>
                <div className='w-full'>
                    <Input
                        type="password"
                        name="mistralApiKey"
                        value={apiKeys.mistralApiKey}
                        onChange={handleInputChange}
                        placeholder="Mistral API key"
                    />
                    <span className="text-xs text-gray-400">
                        Get your Mistral API key: <a href="https://mistral.ai/fr/news/la-plateforme/" target='_blank' rel="noopener noreferrer" className="text-blue-400 hover:underline">https://mistral.ai/fr/news/la-plateforme/</a>
                    </span>
                </div>
                <div className='w-full'>
                    <Input
                        type="password"
                        name="finnhubApiKey"
                        value={apiKeys.finnhubApiKey}
                        onChange={handleInputChange}
                        placeholder="Finnhub API key"
                    />
                    <span className="text-xs text-gray-400">
                        Get a free Finnhub API key: <a href="https://finnhub.io/" target='_blank' rel="noopener noreferrer" className="text-blue-400 hover:underline">https://finnhub.io/</a>
                    </span>
                </div>
                <div className='w-full'>
                    <Input
                        type="password"
                        name="secApiKey"
                        value={apiKeys.secApiKey}
                        onChange={handleInputChange}
                        placeholder="SEC API key"
                    />
                    <span className="text-xs text-gray-400">
                        Get a free SEC API key: <a href="https://sec-api.io/" target='_blank' rel="noopener noreferrer" className="text-blue-400 hover:underline">https://sec-api.io/</a>
                    </span>
                </div>
            </div>
        </div>
    )
}