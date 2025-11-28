/**
 * 一次性脚本：生成 Google Search Console API Refresh Token
 *
 * 使用方式：
 *   1. 确保 credentials.json 在项目根目录
 *   2. 运行：npx tsx scripts/generate-gsc-token.ts
 *   3. 按照提示在浏览器中授权
 *   4. 获取 refresh token 并保存到 .env.local
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function main() {
  // 1. 读取 credentials.json
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ Error: credentials.json not found!');
    console.error('Please download it from Google Cloud Console and save it to the project root.');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  // 2. 创建 OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris ? redirect_uris[0] : 'urn:ietf:wg:oauth:2.0:oob'
  );

  // 3. 生成授权 URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // 强制显示同意屏幕以获取 refresh token
  });

  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   Generate Google Search Console API Refresh Token   ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📝 Step 1: Authorize this app by visiting this URL:\n');
  console.log(authUrl);
  console.log('\n');

  // 4. 等待用户输入授权码
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('📋 Step 2: Enter the authorization code from the page: ', async (code) => {
    rl.close();

    try {
      // 5. 用授权码换取 tokens
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // 6. 保存 token 到文件
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log('\n✅ Token saved to:', TOKEN_PATH);

      // 7. 显示环境变量配置
      console.log('\n╔═══════════════════════════════════════════════════════╗');
      console.log('║              Configuration Complete!                  ║');
      console.log('╚═══════════════════════════════════════════════════════╝\n');

      console.log('📝 Add these to your .env.local file:\n');
      console.log(`GOOGLE_SEO_CLIENT_ID=${client_id}`);
      console.log(`GOOGLE_SEO_CLIENT_SECRET=${client_secret}`);
      console.log(`GOOGLE_SEO_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log(`GSC_SITE_URL=https://bpcareai.com`);
      console.log('\n');

      console.log('🔒 For GitHub Actions, add these as repository secrets:');
      console.log('   - GOOGLE_SEO_CLIENT_ID');
      console.log('   - GOOGLE_SEO_CLIENT_SECRET');
      console.log('   - GOOGLE_SEO_REFRESH_TOKEN');
      console.log('   - GSC_SITE_URL\n');

      console.log('✅ Setup complete! You can now run: npm run sync:gsc\n');
    } catch (error) {
      console.error('❌ Error retrieving access token:', error);
      process.exit(1);
    }
  });
}

main().catch(console.error);
