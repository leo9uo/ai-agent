'use client'
import { useMemo } from 'react';

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
    fetchIncomeStatement,
    fetchBasicFinancials,
    fetchCompanyProfile,
    fetchCompanyNews,
    fetchSecFiling,
    fetch10kSection
} from '@/lib/tools/tools_calls'
import type {
    IncomeStatementResponse,
    BasicFinancialsResponse,
    CompanyProfileResponse,
    CompanyNewsResponse,
    SecFilingResponse,
    SecSectionResponse
} from '@/lib/tools/tools_types'

export const useIncomeStatement = (symbol: string) => {
    return useQuery<IncomeStatementResponse, Error>({
        queryKey: ['incomeStatement', symbol],
        queryFn: () => fetchIncomeStatement(symbol),
    })
}

export const useBasicFinancials = (symbol: string, selectedColumns?: string[]) => {
    return useQuery<BasicFinancialsResponse, Error>({
        queryKey: ['basicFinancials', symbol, selectedColumns],
        queryFn: () => fetchBasicFinancials(symbol, selectedColumns),
    })
}

export const useCompanyProfile = (symbol: string) => {
    return useQuery<CompanyProfileResponse, Error>({
        queryKey: ['companyProfile', symbol],
        queryFn: () => fetchCompanyProfile(symbol),
    })
}

export const useCompanyNews = (symbol: string, startDate?: string, endDate?: string, maxNewsNum: number = 10) => {
    return useQuery<CompanyNewsResponse, Error>({
        queryKey: ['companyNews', symbol, startDate, endDate, maxNewsNum],
        queryFn: () => fetchCompanyNews(symbol, startDate, endDate, maxNewsNum),
    })
}

export const useSecFiling = (symbol: string, form?: string, fromDate?: string, toDate?: string) => {
    return useQuery<SecFilingResponse, Error>({
        queryKey: ['secFiling', symbol, form, fromDate, toDate],
        queryFn: () => fetchSecFiling(symbol, form, fromDate, toDate),
    })
}

const use10kSection = (html_report_url: string | undefined, section: string): UseQueryResult<SecSectionResponse | null, Error> => {
    return useQuery<SecSectionResponse | null, Error>({
        queryKey: ['10kSection', html_report_url, section],
        queryFn: async () => {
            if (!html_report_url) {
                return null;
            }
            return fetch10kSection(html_report_url, section);
        },
        enabled: !!html_report_url,
    });
};

export const useAggregatedStockData = (symbol: string) => {
    const incomeStatement = useIncomeStatement(symbol);
    const basicFinancials = useBasicFinancials(symbol, ['revenueTTm', 'debtEquityTTM', 'peRatioTTM', 'pegRatioTTM', 'priceToBookTTM', 'priceToSalesTTM', 'dividendYieldTTM', 'roeTTM']);
    const companyProfile = useCompanyProfile(symbol);
    const companyNews = useCompanyNews(symbol);
    const secFiling = useSecFiling(symbol, "10-K");

    const html_report_url = secFiling.data?.filing.filingUrl;

    const sections10k = ['7', '1A', '1', '3', '5'].map(section =>
        use10kSection(html_report_url, section)
    );

    const isLoading = [
        incomeStatement, basicFinancials, companyProfile, companyNews, secFiling,
        ...sections10k
    ].some(query => query.isLoading);

    const isError = [
        incomeStatement, basicFinancials, companyProfile, companyNews, secFiling,
        ...sections10k
    ].some(query => query.isError);

    const data = {
        incomeStatement: incomeStatement.data,
        basicFinancials: basicFinancials.data,
        companyProfile: companyProfile.data,
        companyNews: companyNews.data,
        secFiling: secFiling.data,
        // sections10k: Object.fromEntries(
        //     sections10k.map((query, index) => [['1A'][index], query.data])
        // ),
    };

    return { data, isLoading, isError };
};