#!/usr/bin/env node

/**
 * Configuration Check Script
 * Validates the setup of the Headache Forecast LIFF app
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
  } catch (error) {
    return null;
  }
}

function checkLiffConfig() {
  log('\n📱 LIFF設定チェック', 'blue');
  
  const liffContent = readFileContent('src/js/liff.js');
  if (!liffContent) {
    log('❌ src/js/liff.js が見つかりません', 'red');
    return false;
  }
  
  const liffIdMatch = liffContent.match(/const LIFF_ID = ["']([^"']+)["']/);
  if (!liffIdMatch) {
    log('❌ LIFF_ID が設定されていません', 'red');
    return false;
  }
  
  const liffId = liffIdMatch[1];
  if (liffId === 'your-liff-id-here') {
    log('❌ LIFF_ID がデフォルト値のままです', 'red');
    log('   LINE Developers ConsoleでLIFF IDを取得し、src/js/liff.jsで設定してください', 'yellow');
    return false;
  }
  
  log(`✅ LIFF ID: ${liffId.substring(0, 10)}...`, 'green');
  return true;
}

function checkGasConfig() {
  log('\n🔧 GAS設定チェック', 'blue');
  
  const files = ['src/js/app.js', 'src/js/weather.js'];
  let allConfigured = true;
  
  for (const file of files) {
    const content = readFileContent(file);
    if (!content) {
      log(`❌ ${file} が見つかりません`, 'red');
      allConfigured = false;
      continue;
    }
    
    const gasUrlMatch = content.match(/const GAS_WEB_APP_URL = ["']([^"']+)["']/);
    if (!gasUrlMatch) {
      log(`❌ ${file} でGAS_WEB_APP_URLが設定されていません`, 'red');
      allConfigured = false;
      continue;
    }
    
    const gasUrl = gasUrlMatch[1];
    if (gasUrl.includes('YOUR_SCRIPT_ID')) {
      log(`❌ ${file} のGAS_WEB_APP_URLがデフォルト値のままです`, 'red');
      log('   Google Apps ScriptでWebアプリをデプロイし、URLを設定してください', 'yellow');
      allConfigured = false;
      continue;
    }
    
    log(`✅ ${file}: GAS URL設定済み`, 'green');
  }
  
  return allConfigured;
}

function checkRequiredFiles() {
  log('\n📁 必須ファイルチェック', 'blue');
  
  const requiredFiles = [
    'src/index.html',
    'src/test.html',
    'src/css/style.css',
    'src/js/app.js',
    'src/js/liff.js',
    'src/js/weather.js',
    'src/js/headache.js',
    'src/js/prefectures.js',
    'src/manifest.json',
    '.github/workflows/deploy.yml'
  ];
  
  let allExists = true;
  
  for (const file of requiredFiles) {
    if (checkFileExists(file)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ ${file} が見つかりません`, 'red');
      allExists = false;
    }
  }
  
  return allExists;
}

function checkManifestConfig() {
  log('\n📱 PWAマニフェストチェック', 'blue');
  
  const manifestContent = readFileContent('src/manifest.json');
  if (!manifestContent) {
    log('❌ src/manifest.json が見つかりません', 'red');
    return false;
  }
  
  try {
    const manifest = JSON.parse(manifestContent);
    
    if (manifest.start_url === '/') {
      log('✅ PWAマニフェスト設定済み', 'green');
    } else {
      log('⚠️  PWAマニフェストの設定を確認してください', 'yellow');
    }
    
    return true;
  } catch (error) {
    log('❌ manifest.jsonの形式が正しくありません', 'red');
    return false;
  }
}

function checkGitHubActions() {
  log('\n🚀 GitHub Actions設定チェック', 'blue');
  
  const workflowContent = readFileContent('.github/workflows/deploy.yml');
  if (!workflowContent) {
    log('❌ .github/workflows/deploy.yml が見つかりません', 'red');
    return false;
  }
  
  if (workflowContent.includes('Deploy Headache Forecast')) {
    log('✅ GitHub Actionsワークフロー設定済み', 'green');
    return true;
  } else {
    log('⚠️  GitHub Actionsワークフローの設定を確認してください', 'yellow');
    return false;
  }
}

function generateSetupInstructions() {
  log('\n📋 セットアップ手順', 'blue');
  log('未設定の項目がある場合は、以下の手順に従ってください：\n', 'yellow');
  
  log('1. OpenWeatherMap APIキーの取得', 'bold');
  log('   https://openweathermap.org/api でアカウントを作成し、APIキーを取得');
  
  log('\n2. Google Apps Scriptの設定', 'bold');
  log('   - https://script.google.com で新しいプロジェクトを作成');
  log('   - gas_weather_api のコードをコピー&ペースト');
  log('   - setApiKey()関数でAPIキーを設定');
  log('   - Webアプリとしてデプロイ（アクセス権限：全員）');
  
  log('\n3. LINE LIFF設定', 'bold');
  log('   - https://developers.line.biz でLIFFアプリを作成');
  log('   - エンドポイントURL: https://your-username.github.io/headache-forecast/');
  log('   - スコープ: chat_message.write');
  
  log('\n4. 設定ファイルの更新', 'bold');
  log('   - src/js/liff.js: LIFF_ID を実際のIDに変更');
  log('   - src/js/app.js: GAS_WEB_APP_URL を実際のURLに変更');
  log('   - src/js/weather.js: GAS_WEB_APP_URL を実際のURLに変更');
  
  log('\n5. GitHub Pagesの有効化', 'bold');
  log('   - GitHubリポジトリの Settings > Pages');
  log('   - Source: GitHub Actions を選択');
  
  log('\n📝 詳細な手順はREADME.mdを参照してください', 'blue');
}

function main() {
  log('🌤️  頭痛予報アプリ - 設定チェック', 'bold');
  log('=====================================\n');
  
  const checks = [
    checkRequiredFiles(),
    checkLiffConfig(),
    checkGasConfig(),
    checkManifestConfig(),
    checkGitHubActions()
  ];
  
  const allPassed = checks.every(check => check);
  
  log('\n' + '='.repeat(40), 'blue');
  
  if (allPassed) {
    log('🎉 すべての設定チェックが完了しました！', 'green');
    log('アプリケーションをデプロイする準備ができています。', 'green');
  } else {
    log('⚠️  一部の設定が未完了です', 'yellow');
    generateSetupInstructions();
  }
  
  log('\n💡 テストページでリアルタイム確認: /test.html', 'blue');
  log('🔧 開発サーバー起動: npm run dev', 'blue');
}

if (require.main === module) {
  main();
}

module.exports = {
  checkLiffConfig,
  checkGasConfig,
  checkRequiredFiles,
  checkManifestConfig,
  checkGitHubActions
};
