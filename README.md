# 🌤️ 頭痛予報 (Headache Forecast) - LIFFアプリ

気象データに基づいて頭痛リスクを予測し、LINEで共有できるLIFFアプリケーションです。

[![Deploy to GitHub Pages](https://github.com/your-username/headache-forecast/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/headache-forecast/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 機能

- 📍 **地域選択**: 日本全国47都道府県・主要都市対応
- 🌡️ **天気情報**: 現在の天気・今日と明日の予報表示
- 🧠 **頭痛リスク予測**: 気圧と天気から頭痛リスクを計算
- 💡 **対策アドバイス**: リスクレベルに応じた具体的な対処法
- 📱 **LINE統合**: チャットにFlexメッセージとして結果を送信
- 🔍 **位置情報対応**: 現在地から自動的に地域を設定
- 📊 **テスト機能**: 設定確認・接続テスト用のページ

## 🏗️ 技術スタック

- **フロントエンド**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **バックエンド**: Google Apps Script
- **API**: OpenWeatherMap API
- **統合**: LINE LIFF SDK
- **デプロイ**: GitHub Pages + GitHub Actions
- **PWA**: Service Worker, Web App Manifest

## 📁 プロジェクト構造

```
headache-forecast/
├── README.md                     # プロジェクトドキュメント
├── LICENSE                       # MITライセンス
├── .gitignore                    # Git除外設定
├── package.json                  # 開発環境設定
├── setup.sh                     # セットアップスクリプト
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages デプロイ設定
├── scripts/
│   ├── build.js                 # ビルドスクリプト
│   └── check-config.js          # 設定チェックスクリプト
├── src/
│   ├── index.html              # メインアプリページ
│   ├── test.html               # 設定確認・テストページ
│   ├── favicon.svg             # アプリアイコン
│   ├── manifest.json           # PWAマニフェスト
│   ├── css/
│   │   └── style.css           # カスタムスタイル
│   └── js/
│       ├── app.js              # メインアプリケーション
│       ├── liff.js             # LINE LIFF統合
│       ├── weather.js          # 天気データ取得
│       ├── headache.js         # 頭痛リスク計算
│       └── prefectures.js      # 都道府県・市区町村データ
└── gas/
    └── index.js                # Google Apps Script コード
```

## 🚀 クイックスタート

### 1. 自動セットアップ（推奨）

```bash
# リポジトリをクローン
git clone https://github.com/your-username/headache-forecast.git
cd headache-forecast

# セットアップスクリプトを実行
chmod +x setup.sh
./setup.sh
```

### 2. 手動セットアップ

#### 前提条件
- [GitHub](https://github.com/) アカウント
- [Google](https://accounts.google.com/) アカウント
- [OpenWeatherMap](https://openweathermap.org/) APIキー
- [LINE Developers](https://developers.line.biz/) アカウント

## 📋 詳細セットアップ手順

### Step 1: OpenWeatherMap APIキーの取得

1. [OpenWeatherMap](https://openweathermap.org/api)にアクセス
2. アカウントを作成してログイン
3. 「API keys」から新しいAPIキーを生成
4. APIキーをコピー（後で使用）

### Step 2: Google Apps Script の設定

#### 2.1 GASプロジェクトの作成

1. [Google Apps Script](https://script.google.com/)にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「頭痛予報API」に変更

#### 2.2 コードの実装

1. デフォルトの `Code.gs` を削除
2. `gas/index.js` の内容をコピー＆ペースト
3. ファイル名を `index.gs` に変更

#### 2.3 APIキーの設定

```javascript
// GAS エディタで実行
function setApiKey() {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY_HERE'; // 実際のAPIキーに置換
  PropertiesService.getScriptProperties().setProperty('WEATHER_API_KEY', apiKey);
  Logger.log('API Key set successfully');
}
```

#### 2.4 Webアプリとしてデプロイ

1. 「デプロイ」→「新しいデプロイ」
2. 「種類の選択」で「ウェブアプリ」を選択
3. 設定:
   - **説明**: 頭痛予報API
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリック
5. **重要**: WebアプリのURLをコピー

### Step 3: LINE LIFF アプリの作成

1. [LINE Developers Console](https://developers.line.biz/console/)にログイン
2. 新しいプロバイダーを作成（必要に応じて）
3. LIFFアプリチャンネルを作成
4. LIFF アプリを追加:
   - **サイズ**: Full
   - **エンドポイントURL**: `https://your-username.github.io/headache-forecast/`
   - **スコープ**: `chat_message.write`
   - **ボットリンク機能**: ON（任意）
5. LIFF IDをコピー

### Step 4: 設定ファイルの更新

#### 4.1 LIFF ID の設定

`src/js/liff.js`:
```javascript
const LIFF_ID = "2006123456-abcdefgh"; // 実際のLIFF IDに変更
```

#### 4.2 GAS URL の設定

`src/js/app.js` と `src/js/weather.js`:
```javascript
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

### Step 5: GitHub Pages デプロイ

#### 5.1 リポジトリの準備

```bash
git add .
git commit -m "Configure LIFF ID and GAS URL"
git push origin main
```

#### 5.2 GitHub Pages の有効化

1. GitHubリポジトリの **Settings** → **Pages**
2. **Source**: GitHub Actions を選択
3. ワークフローが自動実行される

### Step 6: LIFF設定の完了

LINE Developers Console でエンドポイントURLを実際のGitHub PagesのURLに更新:
```
https://your-username.github.io/headache-forecast/
```

## 🧪 テストと検証

### 設定確認

```bash
# 設定チェックスクリプトを実行
npm run config:check

# または
node scripts/check-config.js
```

### 接続テスト

1. ブラウザで `https://your-username.github.io/headache-forecast/test.html` にアクセス
2. 各テストボタンをクリックして動作確認:
   - **GAS接続テスト**: 天気API接続の確認
   - **LIFF接続テスト**: LINE統合の確認
   - **天気データテスト**: 複数地域のデータ取得テスト

### LINE での動作確認

1. LINEアプリで自分にメッセージを送信
2. LIFF URLを含めて送信:
   ```
   https://liff.line.me/YOUR_LIFF_ID
   ```
3. リンクをタップしてアプリを開く
4. 地域を選択して予報を取得
5. 「チャットに送信」で共有機能をテスト

## 🛠️ 開発

### 開発環境の起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
# または
npm start
```

### 利用可能なスクリプト

```bash
npm run start          # 開発サーバー起動
npm run build          # プロダクションビルド
npm run test           # テスト実行
npm run lint           # コードチェック
npm run format         # コード整形
npm run config:check   # 設定確認
```

### デバッグモード

`src/js/app.js`でデバッグモードを有効化:
```javascript
const DEBUG_MODE = true; // 開発時はtrue
```

## 📊 頭痛リスク計算ロジック

### 気圧による基本リスク

- **980hPa未満**: 非常に高リスク (スコア: 8)
- **1000hPa未満**: 高リスク (スコア: 6)
- **1013hPa未満**: 中リスク (スコア: 3)
- **1020hPa未満**: 低リスク (スコア: 0)
- **1030hPa未満**: 最低リスク (スコア: -1)
- **1030hPa以上**: 高気圧影響 (スコア: 2)

### 天気による調整

- **嵐・雷雨・台風**: +5
- **雨・雪**: +3
- **曇り**: +2
- **霧・靄**: +2
- **晴れ**: +0

### 総合判定

- **8以上**: 非常に高い
- **6-7**: 高い
- **3-5**: 中程度
- **1-2**: やや注意
- **0以下**: 低い

## 🔧 カスタマイズ

### リスク計算の調整

`src/js/headache.js`でアルゴリズムをカスタマイズ:

```javascript
function calculatePressureRisk(pressure) {
  // 気圧リスクの計算ロジック
  if (pressure < 990) { // 閾値を調整
    score = 7; // スコアを調整
  }
  // ...
}
```

### UIのカスタマイズ

`src/css/style.css`でデザインを変更:

```css
:root {
  --line-green: #00B900;        /* LINE緑色 */
  --primary-blue: #1F76DC;      /* プライマリ青色 */
  --gradient-start: #a1c4fd;    /* グラデーション開始色 */
  --gradient-end: #c2e9fb;      /* グラデーション終了色 */
}
```

### 地域データの追加

`src/js/prefectures.js`で新しい都市を追加:

```javascript
const majorCities = {
  "13": [
    {name: "新宿区", english: "Shinjuku", popular: true},
    {name: "渋谷区", english: "Shibuya", popular: true},
    // 新しい都市を追加
    {name: "目黒区", english: "Meguro"}
  ]
};
```

## 🔍 トラブルシューティング

### よくある問題

#### 1. 「地域名が正しくありません」エラー

**原因**: OpenWeatherMap APIで地域が見つからない

**解決方法**:
- GASで複数の検索パターンを確認
- APIキーが正しく設定されているか確認
- 異なる都道府県で試行

#### 2. 「ネットワーク接続に問題があります」エラー

**原因**: GAS Web App への接続失敗

**解決方法**:
- GAS Web App URLが正しいか確認
- GAS デプロイ時の設定確認（アクセス権限：全員）
- ブラウザの開発者ツールでネットワークエラーを確認

#### 3. LIFF初期化エラー

**原因**: LIFF IDまたはエンドポイントURLの設定ミス

**解決方法**:
- LIFF IDが正しく設定されているか確認
- エンドポイントURLがGitHub PagesのURLと一致しているか確認
- LIFFアプリが有効化されているか確認

#### 4. チャット送信ができない

**原因**: LINE環境外での実行またはスコープ設定

**解決方法**:
- LINEアプリ内でアクセスしているか確認
- LIFFアプリのスコープに`chat_message.write`が含まれているか確認

### デバッグ手順

1. **設定確認**: `npm run config:check`を実行
2. **テストページ**: `/test.html`で各機能をテスト
3. **ブラウザコンソール**: F12でエラーメッセージを確認
4. **ネットワークタブ**: API呼び出しの状況を確認

## 🔐 セキュリティ

### APIキーの管理

- ✅ GAS環境変数に保存（PropertiesService）
- ❌ フロントエンドコードに直接記載しない
- ✅ GitHub Secretsは使用（必要に応じて）

### CORS設定

- GAS Web Appで適切なCORSヘッダーを設定
- 信頼できるドメインからのアクセスのみ許可

### データプライバシー

- 位置情報は一時的な使用のみ
- 個人データの永続化なし
- 医療情報の免責事項を明記

## 📈 パフォーマンス最適化

### キャッシュ戦略

- 天気データ: 5分間キャッシュ
- 都道府県データ: ブラウザキャッシュ
- 静的アセット: 長期キャッシュ

### 最適化技術

- 画像最適化（SVG使用）
- CSS/JSの最小化
- HTTP/2対応
- Service Worker（将来実装予定）

## 🤝 コントリビューション

プルリクエストやIssueの報告を歓迎します！

### 開発ガイドライン

1. 新機能はfeatureブランチで開発
2. コミットメッセージは明確に記述
3. テストページで動作確認
4. READMEの更新も忘れずに

### 報告すべきIssue

- バグ報告
- 新機能の提案
- パフォーマンス改善
- ドキュメント改善

## 📄 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照

## 🙏 クレジット

- **天気データ**: [OpenWeatherMap](https://openweathermap.org/)
- **UIフレームワーク**: [Tailwind CSS](https://tailwindcss.com/)
- **統合プラットフォーム**: [LINE LIFF SDK](https://developers.line.biz/)
- **アイコン**: [Lucide Icons](https://lucide.dev/)

## ⚠️ 免責事項

このアプリケーションは天気予報に基づく予測であり、医学的診断ではありません。実際の症状については医療専門家にご相談ください。

開発者は、このアプリケーションの使用によって生じた直接的または間接的な損害について責任を負いません。

## 📞 サポート

- **ドキュメント**: このREADME
- **Issues**: [GitHub Issues](https://github.com/your-username/headache-forecast/issues)
- **設定確認**: テストページ (`/test.html`)

---

**Happy Coding! 🚀**
