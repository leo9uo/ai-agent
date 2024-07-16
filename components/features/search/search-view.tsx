import { SearchBar } from "@/components/ui/search-bar";

type SearchViewProps = {
    onSymbolSelect: (symbol: string) => void;
};

const SearchView: React.FC<SearchViewProps> = ({ onSymbolSelect }) => (
    <div className="flex flex-col items-center justify-center flex flex-col bg-slate-900 rounded-lg shadow-sm p-20 gap-4">
        <h1 className="text-6xl font-bold text-white text-center text-slate-100">Investment memo generator</h1>
        <p className="text-xl mb-8 text-center text-slate-100">
            Select a NASDAQ stock symbol to start analyzing and discussing financial data.
        </p>
        <div className="w-full max-w-md">
            <SearchBar onSymbolSelect={onSymbolSelect} />
        </div>
    </div>
);

export default SearchView;
