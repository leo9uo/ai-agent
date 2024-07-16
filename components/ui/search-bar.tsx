"use client"
import { FormEvent, useState } from "react"
import InputSymbolAutocomplete from "@/components/ui/input-autocomplete"
import { Button } from "@/components/ui/button"
import { useAppContext } from '@/context/AppProvider'
import { AlertCircle } from 'lucide-react'

interface SearchBarProps {
    onSymbolSelect: (symbol: string) => void;
}

export function SearchBar({ onSymbolSelect }: SearchBarProps) {
    const [selectedSymbol, setSelectedSymbol] = useState<string>("")
    const [error, setError] = useState<string>("")
    const { apiKeys } = useAppContext();


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (selectedSymbol && apiKeys.finnhubApiKey !== "" && apiKeys.secApiKey !== "" && apiKeys.mistralApiKey !== "") {
            onSymbolSelect(selectedSymbol);
        }
        else {
            setError("Missing api keys 👇")
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 mb-6 w-full">
            <div className="flex flex-col sm:flex-row flex-grow items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                <div className="w-full">
                    <InputSymbolAutocomplete handleSelectSymbol={setSelectedSymbol} />
                </div>
                <Button
                    type="submit"
                    className="whitespace-nowrap bg-blue-700 hover:bg-blue-800 w-full sm:w-auto"
                >
                    Generate
                </Button>
            </div>
            {error && (
                <div className="text-red-400 text-sm flex items-center self-start">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}
        </form>
    )
}