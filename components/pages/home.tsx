"use client"
import { useState } from "react";
import SearchView from "@/components/features/search/search-view";
import ChatView from "@/components/features/chat/chat-view";
import { ChatProvider } from "@/context/ChatProvider";
import { AppProvider } from "@/context/AppProvider";
import { ApiKeysForm } from "@/components/features/search/api-keys-form";
import Image from "next/image";

const HomePage: React.FC = () => {
    const [selectedSymbol, setSelectedSymbol] = useState<string>("");

    return (
        <AppProvider>
            <main className="flex flex-col h-screen p-4 md:p-12 bg-gray-50">
                {!selectedSymbol ? (
                    <div className="flex flex-col h-full justify-between">
                        <SearchView onSymbolSelect={setSelectedSymbol} />
                        {/* <div >
                            <video controls preload="none">
                                <source src="demo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div> */}
                        <ApiKeysForm />
                    </div>
                ) : (
                    <ChatProvider>
                        <ChatView selectedSymbol={selectedSymbol} onReturn={() => setSelectedSymbol("")} />
                    </ChatProvider>
                )}
            </main>
        </AppProvider>

    );
};

export default HomePage;
