import {
    IncomeStatementResponse,
    SecSectionResponse,
    BasicFinancialsResponse,
    CompanyProfileResponse,
    CompanyNewsResponse,
    SecFilingResponse
} from "@/lib/tools/tools_types"


type ToolFunction = (...args: any[]) => any;
interface ToolsNames {
    [key: string]: ToolFunction;
}

export const TOOLS_NAMES: ToolsNames = {
    "get_company_profile_tool": fetchCompanyProfile,
    "get_company_news_tool": fetchCompanyNews,
    "get_basic_financials_tools": fetchBasicFinancials,
    "get_income_stmt_tool": fetchIncomeStatement,
    // "get_10k_section_tool": fetch10kSection,
    "get_sec_filing_tool": fetchSecFiling
}


interface ApiKeys {
    mistralApiKey: string;
    finnhubApiKey: string;
    secApiKey: string;
}



export async function fetchIncomeStatement(symbol: string, apiKeys: ApiKeys): Promise<IncomeStatementResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/py/get_income_statement?symbol=${symbol}`);

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error fetching income statement: ${errorDetails.detail}`);
    }

    const data: IncomeStatementResponse = await response.json();
    return data;
}

// export async function fetch10kSection(html_report_url: string, section: string): Promise<SecSectionResponse> {
//     const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const params = new URLSearchParams({
//         html_report_url,
//         section
//     });

//     // const response = await fetch(`${baseUrl}/api/py/get_10k_section?${params.toString()}`);

//     if (!response.ok) {
//         const errorDetails = await response.json();
//         throw new Error(`Error fetching 10-K section: ${errorDetails.detail}`);
//     }

//     const data: SecSectionResponse = await response.json();
//     return data;
// }

export async function fetchBasicFinancials(symbol: string, apiKeys: ApiKeys, selectedColumns?: string[]): Promise<BasicFinancialsResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const params = new URLSearchParams({ symbol });

    if (selectedColumns) {
        params.append('selected_columns', selectedColumns.join(','));
    }

    const response = await fetch(`${baseUrl}/api/py/get_basic_financials?${params.toString()}`, {
        headers: {
            'X-Finnhub-API-Key': apiKeys.finnhubApiKey
        }
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error fetching basic financials: ${errorDetails.detail}`);
    }

    const data: BasicFinancialsResponse = await response.json();
    return data;
}

export async function fetchCompanyProfile(symbol: string, apiKeys: ApiKeys): Promise<CompanyProfileResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/py/get_company_profile?symbol=${symbol}`, {
        headers: {
            'X-Finnhub-API-Key': apiKeys.finnhubApiKey
        }
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error fetching company profile: ${errorDetails.detail}`);
    }

    const data: CompanyProfileResponse = await response.json();
    return data;
}


export async function fetchCompanyNews(symbol: string, apiKeys: ApiKeys, start_date?: string, end_date?: string, max_news_num: number = 10): Promise<CompanyNewsResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const params = new URLSearchParams({ symbol });

    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    params.append('max_news_num', max_news_num.toString());

    const response = await fetch(`${baseUrl}/api/py/get_company_news?${params.toString()}`, {
        headers: {
            'X-Finnhub-API-Key': apiKeys.finnhubApiKey
        }
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error fetching company news: ${errorDetails.detail}`);
    }

    const data: CompanyNewsResponse = await response.json();
    return data;
}

export async function fetchSecFiling(symbol: string, apiKeys: ApiKeys, form?: string, fromDate?: string, toDate?: string): Promise<SecFilingResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const params = new URLSearchParams({ symbol });

    if (form) params.append('form', form);
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);

    const response = await fetch(`${baseUrl}/api/py/get_sec_filing?${params.toString()}`, {
        headers: {
            'X-Finnhub-API-Key': apiKeys.finnhubApiKey
        }
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error fetching SEC filing: ${errorDetails.detail}`);
    }

    const data: SecFilingResponse = await response.json();
    return data;
}