# 頭痛予報 (Headache Forecast) - GAS版

頭痛予報は、気象データに基づいて頭痛リスクを予測し、LINEで共有できるLIFFアプリケーションです。

## 技術スタック

- **フロントエンド**: HTML, CSS (Tailwind CSS), JavaScript
- **バックエンド**: Google Apps Script (GAS) Web App
- **API**: OpenWeatherMap API
- **統合**: LINE LIFF SDK
- **デプロイ**: GitHub Pages

## セットアップ手順

### 前提条件

- [GitHub](https://github.com/) アカウント
- [Google](https://www.google.com/) アカウント（GAS用）
- [OpenWeatherMap](https://openweathermap.org/) API キー
- [LINE Developers](https://developers.line.biz/) アカウント

### 1. OpenWeatherMap APIキーの取得

1. [OpenWeatherMap](https://openweathermap.org/api) にアクセス
2. アカウントを作成してログイン
3. 「API keys」タブから新しいAPIキーを生成
4. 生成されたAPIキーをメモ（後で使用）

### 2. Google Apps Script の設定

#### 2.1 GASプロジェクトの作成

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「頭痛予報API」に変更

#### 2.2 スクリプトの作成

1. デフォルトの `Code.gs` を削除
2. 新しいファイル `index.gs` を作成
3. 提供されたGASコード（`gas_weather_api`）をコピー＆ペースト

#### 2.3 APIキーの設定

1. GASエディタで以下のコードを実行してAPIキーを設定:

```javascript
function setApiKey() {
  const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY_HERE'; // 実際のAPIキーに置換
  PropertiesService.getScriptProperties().setProperty('WEATHER_API_KEY', apiKey);
  Logger.log('API Key set successfully');
}
```

2. 実行ボタンをクリックして関数を実行
3. 必要な権限を許可

#### 2.4 Webアプリとしてデプロイ

1. 右上の「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」で「ウェブアプリ」を選択
3. 設定:
   - **説明**: 頭痛予報API
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリック
5. **重要**: 表示されるWebアプリのURLをコピー（例: `https://script.google.com/macros/s/ABC123.../exec`）

### 3. LINE LIFF アプリケーションの作成

1. [LINE Developers Console](https://developers.line.biz/console/) にログイン
2. 新しいプロバイダーを作成（既存のものがあれば不要）
3. 新しいチャンネルを作成（タイプ: LIFFアプリ）
4. LIFFタブでLIFFアプリを追加:
   - **サイズ**: Full
   - **エンドポイントURL**: `https://your-username.github.io/headache-forecast/`
   - **スコープ**: chat_message.write を選択
   - **ボットリンク機能**: ON（任意）
5. 作成したLIFF IDをコピー

### 4. フロントエンドの設定

#### 4.1 コードの更新

1. `src/js/liff.js` ファイルを開く
2. LIFF_ID を実際のIDに変更:
   ```javascript
   const LIFF_ID = "your-liff-id-here";
   ```

3. `src/js/app.js` ファイルを開く
4. GAS_WEB_APP_URL を実際のURLに変更:
   ```javascript
   const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

5. `src/js/weather.js` ファイルを開く
6. 同様にGAS_WEB_APP_URLを更新:
   ```javascript
   const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### 5. GitHub Pagesでのデプロイ

#### 5.1 リポジトリの準備

```bash
git clone https://github.com/your-username/headache-forecast.git
cd headache-forecast

# 設定ファイルを更新した後
git add .
git commit -m "Update GAS URLs and LIFF ID"
git push origin main
```

#### 5.2 GitHub Pagesの有効化

1. GitHubリポジトリの **Settings** > **Pages** を開く
2. ソースとして **GitHub Actions** を選択
3. 既存の GitHub Actions ワークフローが自動実行される
4. 数分後に `https://your-username.github.io/headache-forecast/` でアクセス可能

### 6. LIFFアプリの設定完了

1. LINE Developers Console に戻る
2. LIFF設定で **エンドポイントURL** を GitHub Pages の実際のURLに更新:
   ```
   https://your-username.github.io/headache-forecast/
   ```
3. 設定を保存

### 7. テスト

#### 7.1 GAS API のテスト

1. ブラウザで以下のURLにアクセス:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?city=東京都
   ```
2. JSON形式でレスポンスが返ることを確認

#### 7.2 アプリのテスト

1. LINEアプリで自分自身にメッセージを送信
2. メッセージに以下のリンクを含める:
   ```
   https://liff.line.me/your-liff-id-here
   ```
3. リンクをタップしてアプリを開く
4. 都道府県と市区町村を選択し「予報を見る」をタップ
5. 結果が表示されることを確認
6. 「チャットに送信する」で共有機能をテスト

## トラブルシューティング

### よくある問題と解決方法

#### 1. 「地域名が正しくありません」エラー

**原因**: OpenWeatherMap APIで地域が見つからない

**解決方法**:
- GASの `generateSearchTerms` 関数で都道府県→主要都市のマッピングを確認
- APIキーが正しく設定されているか確認
- 異なる都道府県で試行

#### 2. 「ネットワーク接続に問題があります」エラー

**原因**: GAS Web App への接続失敗

**解決方法**:
- GAS Web App URLが正しいか確認
- GASデプロイ時に「アクセスできるユーザー: 全員」に設定されているか確認
- GASでAPIキーが正しく設定されているか確認

#### 3. LIFF初期化エラー

**原因**: LIFF IDまたはエンドポイントURLの設定ミス

**解決方法**:
- LIFF IDが正しく設定されているか確認
- GitHub Pagesの実際のURLとLIFFのエンドポイントURLが一致しているか確認

#### 4. CORS エラー

**原因**: ブラウザのCORS制限

**解決方法**:
- GASのWebアプリ設定で「アクセスできるユーザー: 全員」を確認
- ブラウザの開発者ツールでエラーメッセージを確認

### デバッグ機能

開発時は `app.js` の `DEBUG_MODE` を `true` に設定すると、デバッグパネルが表示されます:

```javascript
const DEBUG_MODE = true;
```

## プロジェクト構造

```
headache-forecast/
├── README.md                 # セットアップドキュメント
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages デプロイ設定
├── src/
│   ├── index.html           # メインHTMLファイル
│   ├── css/
│   │   └── style.css        # カスタムスタイル
│   └── js/
│       ├── app.js           # メインアプリ（GAS対応）
│       ├── liff.js          # LINE LIFF統合
│       ├── weather.js       # 天気データ取得（GAS対応）
│       ├── headache.js      # 頭痛リスク計算
│       └── prefectures.js   # 都道府県データ
└── gas/
    └── index.gs             # Google Apps Script コード
```

## 地域取得の改善点

この版では以下の改善を行いました:

1. **複数検索語の試行**: 都道府県名→主要都市名→英語名の順で複数パターンを試行
2. **詳細なエラーメッセージ**: 失敗理由に応じた具体的なエラーメッセージを表示
3. **フォールバック機能**: 一つの検索語で失敗しても他の候補を自動試行
4. **デバッグ機能強化**: 詳細なログでトラブルシューティングをサポート

## ライセンス

MIT License

## サポート

問題が発生した場合は、以下を確認してください:

1. 全ての設定値（LIFF ID、GAS URL、APIキー）が正しく設定されているか
2. GAS のログ（実行トランスクリプト）でエラーメッセージを確認
3. ブラウザの開発者ツールでネットワークエラーやJavaScriptエラーを確認

---

**注意**: このアプリは天気予報に基づく予測であり、医学的診断ではありません。実際の症状については医療専門家にご相談ください。
