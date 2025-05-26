#!/usr/bin/env node

/**
 * Build Script for Headache Forecast LIFF App
 * Validates files, optimizes assets, and prepares for deployment
 */

const fs = require('fs');
const path = require('path');

// Build configuration
const BUILD_CONFIG = {
  srcDir: 'src',
  buildDir: 'dist',
  validateHtml: true,
  validateJs: true,
  minifyAssets: false, // Set to true for production builds
  generateSitemap: true
};

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

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  ensureDirectoryExists(destDir);
  fs.copyFileSync(src, dest);
}

function copyDirectory(src, dest) {
  ensureDirectoryExists(dest);
  
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function validateHtmlFiles() {
  log('\n📝 HTMLファイル検証', 'blue');
  
  const htmlFiles = [
    'src/index.html',
    'src/test.html'
  ];
  
  let isValid = true;
  
  for (const file of htmlFiles) {
    if (!fs.existsSync(file)) {
      log(`❌ ${file} が見つかりません`, 'red');
      isValid = false;
      continue;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Basic HTML validation
    if (!content.includes('<!DOCTYPE html>')) {
      log(`⚠️  ${file}: DOCTYPE宣言がありません`, 'yellow');
    }
    
    if (!content.includes('<meta charset="UTF-8">')) {
      log(`⚠️  ${file}: 文字エンコーディング指定がありません`, 'yellow');
    }
    
    if (!content.includes('<meta name="viewport"')) {
      log(`⚠️  ${file}: ビューポート設定がありません`, 'yellow');
    }
    
    log(`✅ ${file}: 基本的な構造は正常`, 'green');
  }
  
  return isValid;
}

function validateJavaScriptFiles() {
  log('\n🔧 JavaScriptファイル検証', 'blue');
  
  const jsFiles = [
    'src/js/app.js',
    'src/js/liff.js',
    'src/js/weather.js',
    'src/js/headache.js',
    'src/js/prefectures.js'
  ];
  
  let isValid = true;
  
  for (const file of jsFiles) {
    if (!fs.existsSync(file)) {
      log(`❌ ${file} が見つかりません`, 'red');
      isValid = false;
      continue;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Basic JavaScript validation
    try {
      // Simple syntax check - this won't catch all issues but helps with basic errors
      new Function(content);
      log(`✅ ${file}: 構文エラーなし`, 'green');
    } catch (error) {
      log(`❌ ${file}: 構文エラー - ${error.message}`, 'red');
      isValid = false;
    }
  }
  
  return isValid;
}

function validateConfiguration() {
  log('\n⚙️  設定ファイル検証', 'blue');
  
  let isValid = true;
  
  // Check LIFF configuration
  const liffContent = fs.readFileSync('src/js/liff.js', 'utf8');
  if (liffContent.includes('your-liff-id-here')) {
    log('❌ LIFF IDが設定されていません', 'red');
    isValid = false;
  } else {
    log('✅ LIFF ID設定済み', 'green');
  }
  
  // Check GAS configuration
  const appContent = fs.readFileSync('src/js/app.js', 'utf8');
  if (appContent.includes('YOUR_SCRIPT_ID')) {
    log('❌ GAS Web App URLが設定されていません', 'red');
    isValid = false;
  } else {
    log('✅ GAS Web App URL設定済み', 'green');
  }
  
  return isValid;
}

function generateSitemap() {
  log('\n🗺️  サイトマップ生成', 'blue');
  
  const baseUrl = 'https://your-username.github.io/headache-forecast';
  const pages = [
    '',
    '/test.html'
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(path.join(BUILD_CONFIG.buildDir, 'sitemap.xml'), sitemap);
  log('✅ sitemap.xml生成完了', 'green');
}

function generateRobotsTxt() {
  log('\n🤖 robots.txt生成', 'blue');
  
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://your-username.github.io/headache-forecast/sitemap.xml

# Disallow test pages from search engines
User-agent: *
Disallow: /test.html

# Allow specific health-related crawlers
User-agent: HealthBot
Allow: /
`;
  
  fs.writeFileSync(path.join(BUILD_CONFIG.buildDir, 'robots.txt'), robotsTxt);
  log('✅ robots.txt生成完了', 'green');
}

function generateBuildInfo() {
  const buildInfo = {
    buildTime: new Date().toISOString(),
    version: require('../package.json').version,
    environment: process.env.NODE_ENV || 'development',
    gitCommit: process.env.GITHUB_SHA || 'unknown',
    files: []
  };
  
  // List all files in build directory
  function listFiles(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(prefix, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        listFiles(fullPath, relativePath);
      } else {
        const stats = fs.statSync(fullPath);
        buildInfo.files.push({
          path: relativePath.replace(/\\/g, '/'),
          size: stats.size,
          modified: stats.mtime.toISOString()
        });
      }
    }
  }
  
  listFiles(BUILD_CONFIG.buildDir);
  
  fs.writeFileSync(
    path.join(BUILD_CONFIG.buildDir, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
  );
  
  log('✅ ビルド情報生成完了', 'green');
}

function cleanBuildDirectory() {
  if (fs.existsSync(BUILD_CONFIG.buildDir)) {
    fs.rmSync(BUILD_CONFIG.buildDir, { recursive: true, force: true });
  }
  ensureDirectoryExists(BUILD_CONFIG.buildDir);
}

function main() {
  log('🏗️  頭痛予報アプリ - ビルド開始', 'bold');
  log('====================================\n');
  
  try {
    // Clean build directory
    log('🧹 ビルドディレクトリクリア', 'blue');
    cleanBuildDirectory();
    log('✅ クリア完了', 'green');
    
    // Validate files
    if (BUILD_CONFIG.validateHtml) {
      if (!validateHtmlFiles()) {
        log('❌ HTMLファイル検証に失敗しました', 'red');
        process.exit(1);
      }
    }
    
    if (BUILD_CONFIG.validateJs) {
      if (!validateJavaScriptFiles()) {
        log('❌ JavaScriptファイル検証に失敗しました', 'red');
        process.exit(1);
      }
    }
    
    if (!validateConfiguration()) {
      log('⚠️  設定ファイルに未設定項目があります', 'yellow');
      log('本番環境では正しく動作しない可能性があります', 'yellow');
    }
    
    // Copy source files to build directory
    log('\n📁 ファイルコピー', 'blue');
    copyDirectory(BUILD_CONFIG.srcDir, BUILD_CONFIG.buildDir);
    
    // Copy additional files
    const additionalFiles = [
      'README.md',
      'LICENSE',
      '.gitignore'
    ];
    
    for (const file of additionalFiles) {
      if (fs.existsSync(file)) {
        copyFile(file, path.join(BUILD_CONFIG.buildDir, file));
        log(`✅ ${file}をコピー`, 'green');
      }
    }
    
    // Generate additional files
    if (BUILD_CONFIG.generateSitemap) {
      generateSitemap();
      generateRobotsTxt();
    }
    
    generateBuildInfo();
    
    log('\n' + '='.repeat(40), 'blue');
    log('🎉 ビルド完了！', 'green');
    log(`📦 ビルドファイル: ${BUILD_CONFIG.buildDir}/`, 'blue');
    log('🚀 GitHub Pagesにデプロイ可能です', 'green');
    
  } catch (error) {
    log(`\n❌ ビルドエラー: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateHtmlFiles,
  validateJavaScriptFiles,
  validateConfiguration,
  generateSitemap,
  generateBuildInfo
};
