'use client'
import { useMemo } from 'react';

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
    fetchIncomeStatement,
    fetchBasicFinancials,
    fetchCompanyProfile,
    fetchCompanyNews,
    fetchSecFiling,
    // fetch10kSection
} from '@/lib/tools/tools_calls'
import type {
    IncomeStatementResponse,
    BasicFinancialsResponse,
    CompanyProfileResponse,
    CompanyNewsResponse,
    SecFilingResponse,
    SecSectionResponse
} from '@/lib/tools/tools_types'

interface ApiKeys {
    mistralApiKey: string;
    finnhubApiKey: string;
    secApiKey: string;
}

export const useIncomeStatement = (symbol: string, apiKeys: ApiKeys) => {
    return useQuery<IncomeStatementResponse, Error>({
        queryKey: ['incomeStatement', symbol],
        queryFn: () => fetchIncomeStatement(symbol, apiKeys),
    })
}

export const useBasicFinancials = (symbol: string, apiKeys: ApiKeys, selectedColumns?: string[]) => {
    return useQuery<BasicFinancialsResponse, Error>({
        queryKey: ['basicFinancials', symbol, selectedColumns],
        queryFn: () => fetchBasicFinancials(symbol, apiKeys, selectedColumns),
    })
}

export const useCompanyProfile = (symbol: string, apiKeys: ApiKeys) => {
    return useQuery<CompanyProfileResponse, Error>({
        queryKey: ['companyProfile', symbol],
        queryFn: () => fetchCompanyProfile(symbol, apiKeys),
    })
}

export const useCompanyNews = (symbol: string, apiKeys: ApiKeys, startDate?: string, endDate?: string, maxNewsNum: number = 10) => {
    return useQuery<CompanyNewsResponse, Error>({
        queryKey: ['companyNews', symbol, startDate, endDate, maxNewsNum],
        queryFn: () => fetchCompanyNews(symbol, apiKeys, startDate, endDate, maxNewsNum),
    })
}

export const useSecFiling = (symbol: string, apiKeys: ApiKeys, form?: string, fromDate?: string, toDate?: string) => {
    return useQuery<SecFilingResponse, Error>({
        queryKey: ['secFiling', symbol, form, fromDate, toDate],
        queryFn: () => fetchSecFiling(symbol, apiKeys, form, fromDate, toDate),
    })
}

// const use10kSection = (html_report_url: string | undefined, section: string): UseQueryResult<SecSectionResponse | null, Error> => {
//     return useQuery<SecSectionResponse | null, Error>({
//         queryKey: ['10kSection', html_report_url, section],
//         queryFn: async () => {
//             if (!html_report_url) {
//                 return null;
//             }
//             return fetch10kSection(html_report_url, section);
//         },
//         enabled: !!html_report_url,
//     });
// };

export const useAggregatedStockData = (symbol: string, apiKeys: ApiKeys) => {
    const incomeStatement = useIncomeStatement(symbol, apiKeys);
    const basicFinancials = useBasicFinancials(symbol, apiKeys, ['revenueTTm', 'debtEquityTTM', 'peRatioTTM', 'pegRatioTTM', 'priceToBookTTM', 'priceToSalesTTM', 'dividendYieldTTM', 'roeTTM']);
    const companyProfile = useCompanyProfile(symbol, apiKeys);
    const companyNews = useCompanyNews(symbol, apiKeys);
    const secFiling = useSecFiling(symbol, apiKeys, "10-K");

    const isLoading = [incomeStatement, basicFinancials, companyProfile, companyNews, secFiling].some(query => query.isLoading);
    const isError = [incomeStatement, basicFinancials, companyProfile, companyNews, secFiling].some(query => query.isError);

    const data = {
        incomeStatement: incomeStatement.data,
        basicFinancials: basicFinancials.data,
        companyProfile: companyProfile.data,
        companyNews: companyNews.data,
        secFiling: secFiling.data,
    };

    return { data, isLoading, isError };
};