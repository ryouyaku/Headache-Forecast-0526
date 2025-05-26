#!/bin/bash

# 頭痛予報LIFFアプリ - セットアップスクリプト
# Headache Forecast LIFF App Setup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}${BOLD}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}${BOLD}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}${BOLD}[ERROR]${NC} $1"
}

print_header() {
    echo
    echo -e "${BOLD}======================================"
    echo -e "🌤️  頭痛予報LIFFアプリ セットアップ"
    echo -e "======================================${NC}"
    echo
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "前提条件をチェック中..."
    
    local missing_deps=()
    
    if ! command_exists git; then
        missing_deps+=("git")
    fi
    
    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "以下のツールがインストールされていません:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo
        echo "必要なツールをインストールしてから再実行してください。"
        exit 1
    fi
    
    print_success "前提条件チェック完了"
}

# Install dependencies
install_dependencies() {
    print_status "依存関係をインストール中..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "npm dependencies インストール完了"
    else
        print_warning "package.json が見つかりません。開発ツールはスキップします。"
    fi
}

# Validate file structure
validate_structure() {
    print_status "ファイル構造を確認中..."
    
    local required_files=(
        "src/index.html"
        "src/test.html"
        "src/css/style.css"
        "src/js/app.js"
        "src/js/liff.js"
        "src/js/weather.js"
        "src/js/headache.js"
        "src/js/prefectures.js"
        "src/manifest.json"
        ".github/workflows/deploy.yml"
    )
    
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        print_error "以下の必須ファイルが見つかりません:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        echo
        echo "すべてのファイルをダウンロードしてから再実行してください。"
        exit 1
    fi
    
    print_success "ファイル構造確認完了"
}

# Configuration setup
setup_configuration() {
    print_status "設定ファイルをチェック中..."
    
    # Check LIFF ID
    if grep -q "your-liff-id-here" src/js/liff.js; then
        print_warning "LIFF IDが未設定です"
        echo "1. LINE Developers Console (https://developers.line.biz/) でLIFFアプリを作成"
        echo "2. 取得したLIFF IDを src/js/liff.js に設定してください"
        echo
    else
        print_success "LIFF ID設定済み"
    fi
    
    # Check GAS URL
    if grep -q "YOUR_SCRIPT_ID" src/js/app.js; then
        print_warning "GAS Web App URLが未設定です"
        echo "1. Google Apps Script (https://script.google.com/) でプロジェクトを作成"
        echo "2. gas_weather_api のコードをデプロイ"
        echo "3. 取得したURLを src/js/app.js と src/js/weather.js に設定してください"
        echo
    else
        print_success "GAS Web App URL設定済み"
    fi
}

# Setup Git repository
setup_git() {
    print_status "Gitリポジトリをセットアップ中..."
    
    if [ ! -d ".git" ]; then
        git init
        print_success "Gitリポジトリを初期化"
    else
        print_success "Gitリポジトリ既存"
    fi
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        print_status "コミットする変更はありません"
    else
        git commit -m "Initial commit: Headache Forecast LIFF App setup"
        print_success "初期コミット完了"
    fi
}

# Start development server
start_dev_server() {
    print_status "開発サーバーを起動しますか？ (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        if command_exists npx; then
            print_status "開発サーバーを起動中... (http://localhost:3000)"
            npx http-server src -p 3000 -c-1 -o
        else
            print_warning "npx が見つかりません。手動でHTTPサーバーを起動してください。"
            echo "例: python -m http.server 3000 --directory src"
        fi
    fi
}

# Display next steps
show_next_steps() {
    echo
    echo -e "${BOLD}🎉 セットアップ完了！${NC}"
    echo
    echo "次の手順:"
    echo "1. 設定ファイルを確認・更新:"
    echo "   - LIFF ID (src/js/liff.js)"
    echo "   - GAS Web App URL (src/js/app.js, src/js/weather.js)"
    echo
    echo "2. 設定確認ページでテスト:"
    echo "   http://localhost:3000/test.html"
    echo
    echo "3. GitHubにプッシュ:"
    echo "   git remote add origin https://github.com/your-username/headache-forecast.git"
    echo "   git push -u origin main"
    echo
    echo "4. GitHub Pagesを有効化:"
    echo "   Settings > Pages > Source: GitHub Actions"
    echo
    echo "📚 詳細な手順: README.md"
    echo "🔧 設定チェック: npm run config:check"
    echo "🧪 テストページ: /test.html"
    echo
}

# Main setup function
main() {
    print_header
    
    check_prerequisites
    validate_structure
    install_dependencies
    setup_configuration
    setup_git
    
    show_next_steps
    
    # Optionally start dev server
    start_dev_server
}

# Check if running as source or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
