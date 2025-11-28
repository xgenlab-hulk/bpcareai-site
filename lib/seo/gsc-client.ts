/**
 * Google Search Console API Client
 * 封装 GSC API 调用，处理认证和数据获取
 */

import { google } from 'googleapis';
import type { searchconsole_v1 } from 'googleapis';
import type { GSCQuery, GSCRow, GSCResponse } from './types';

export class GSCClient {
  private searchConsole: searchconsole_v1.Searchconsole;
  private siteUrl: string;

  constructor() {
    // 从环境变量读取配置
    const clientId = process.env.GOOGLE_SEO_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SEO_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_SEO_REFRESH_TOKEN;
    this.siteUrl = process.env.GSC_SITE_URL || '';

    if (!clientId || !clientSecret || !refreshToken || !this.siteUrl) {
      throw new Error(
        'Missing required environment variables: GOOGLE_SEO_CLIENT_ID, GOOGLE_SEO_CLIENT_SECRET, GOOGLE_SEO_REFRESH_TOKEN, GSC_SITE_URL'
      );
    }

    // 创建 OAuth2 客户端
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'urn:ietf:wg:oauth:2.0:oob'
    );

    // 设置 refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    // 创建 Search Console API 实例
    this.searchConsole = google.searchconsole({
      version: 'v1',
      auth: oauth2Client,
    });
  }

  /**
   * 查询 GSC 数据（通用方法）
   */
  async query(params: GSCQuery): Promise<GSCResponse> {
    try {
      const response = await this.searchConsole.searchanalytics.query({
        siteUrl: this.siteUrl,
        requestBody: {
          startDate: params.startDate,
          endDate: params.endDate,
          dimensions: params.dimensions,
          rowLimit: params.rowLimit || 25000,
          startRow: params.startRow || 0,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('GSC API Error:', error.message);
      throw new Error(`Failed to query GSC: ${error.message}`);
    }
  }

  /**
   * 获取网站级数据（按日期维度）
   */
  async getWebsiteMetrics(startDate: string, endDate: string): Promise<GSCRow[]> {
    const response = await this.query({
      startDate,
      endDate,
      dimensions: ['date'],
      rowLimit: 1000,
    });

    return response.rows || [];
  }

  /**
   * 获取所有页面的数据（按页面维度）
   */
  async getPageMetrics(startDate: string, endDate: string): Promise<GSCRow[]> {
    const response = await this.query({
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 25000,
    });

    return response.rows || [];
  }

  /**
   * 获取指定页面的关键词数据
   */
  async getPageKeywords(
    pageUrl: string,
    startDate: string,
    endDate: string
  ): Promise<GSCRow[]> {
    try {
      const response = await this.searchConsole.searchanalytics.query({
        siteUrl: this.siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          dimensionFilterGroups: [
            {
              filters: [
                {
                  dimension: 'page',
                  expression: pageUrl,
                  operator: 'equals',
                },
              ],
            },
          ],
          rowLimit: 1000,
        },
      });

      return response.data.rows || [];
    } catch (error: any) {
      console.error(`Error fetching keywords for ${pageUrl}:`, error.message);
      return [];
    }
  }

  /**
   * 测试连接
   */
  async testConnection(): Promise<boolean> {
    try {
      // 获取最近7天的数据作为测试
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      await this.query({
        startDate: this.formatDate(startDate),
        endDate: this.formatDate(endDate),
        dimensions: ['date'],
        rowLimit: 1,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 格式化日期为 YYYY-MM-DD
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * 获取站点 URL
   */
  getSiteUrl(): string {
    return this.siteUrl;
  }
}
