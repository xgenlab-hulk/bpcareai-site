/**
 * Google Search Console API Client
 * Wrapper for GSC API to fetch search analytics data
 */
import { google } from 'googleapis';
import { searchconsole_v1 } from 'googleapis';

/**
 * Initialize GSC client with service account credentials
 */
function getGSCClient(): searchconsole_v1.Searchconsole {
  // Parse service account key from environment variable
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }

  let credentials;
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    throw new Error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY: Invalid JSON');
  }

  // Create auth client
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  // Initialize Search Console client
  return google.searchconsole({
    version: 'v1',
    auth,
  });
}

/**
 * Get site URL from environment variable
 */
export function getSiteUrl(): string {
  if (!process.env.GSC_SITE_URL) {
    throw new Error('GSC_SITE_URL environment variable is not set');
  }
  return process.env.GSC_SITE_URL;
}

/**
 * Search Analytics Query Parameters
 */
export interface SearchAnalyticsParams {
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  dimensions?: Array<'query' | 'page' | 'country' | 'device' | 'date'>;
  filters?: searchconsole_v1.Schema$ApiDimensionFilter[];
  rowLimit?: number;
  startRow?: number;
}

/**
 * Search Analytics Row
 * Matches Google Search Console API response type
 * Note: All fields can be null as per Google API spec
 */
export interface SearchAnalyticsRow {
  keys?: string[] | null;
  clicks?: number | null;
  impressions?: number | null;
  ctr?: number | null;
  position?: number | null;
}

/**
 * Fetch search analytics data from GSC
 */
export async function fetchSearchAnalytics(
  params: SearchAnalyticsParams
): Promise<SearchAnalyticsRow[]> {
  const searchConsole = getGSCClient();
  const siteUrl = getSiteUrl();

  try {
    const response = await searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: params.startDate,
        endDate: params.endDate,
        dimensions: params.dimensions || ['query'],
        dimensionFilterGroups: params.filters ? [{ filters: params.filters }] : undefined,
        rowLimit: params.rowLimit || 1000,
        startRow: params.startRow || 0,
      },
    });

    return response.data.rows || [];
  } catch (error) {
    console.error('GSC API Error:', error);
    throw new Error(`Failed to fetch search analytics: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get total clicks and impressions for a date range
 */
export async function getTotalMetrics(
  startDate: string,
  endDate: string
): Promise<{
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
}> {
  const rows = await fetchSearchAnalytics({
    startDate,
    endDate,
    dimensions: [],  // No dimensions = totals
  });

  if (rows.length === 0) {
    return {
      totalClicks: 0,
      totalImpressions: 0,
      averageCTR: 0,
      averagePosition: 0,
    };
  }

  const row = rows[0];
  return {
    totalClicks: row.clicks || 0,
    totalImpressions: row.impressions || 0,
    averageCTR: row.ctr || 0,
    averagePosition: row.position || 0,
  };
}

/**
 * Get top performing queries
 */
export async function getTopQueries(
  startDate: string,
  endDate: string,
  limit: number = 10
): Promise<SearchAnalyticsRow[]> {
  return fetchSearchAnalytics({
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: limit,
  });
}

/**
 * Get performance for a specific page
 */
export async function getPagePerformance(
  pageUrl: string,
  startDate: string,
  endDate: string
): Promise<SearchAnalyticsRow[]> {
  return fetchSearchAnalytics({
    startDate,
    endDate,
    dimensions: ['query'],
    filters: [
      {
        dimension: 'page',
        expression: pageUrl,
        operator: 'equals',
      },
    ],
  });
}

/**
 * Get all pages performance
 */
export async function getAllPagesPerformance(
  startDate: string,
  endDate: string,
  limit: number = 1000
): Promise<SearchAnalyticsRow[]> {
  return fetchSearchAnalytics({
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: limit,
  });
}
