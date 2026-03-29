# 家計簿APP - プロジェクト指示書

## プロジェクト概要
- **プロジェクト名**：家計簿APP
- **目的**：家族の家計管理を効率化するWebアプリケーション
- **現段階**：Phase 1 - 家族用プロトタイプ開発
- **将来展開**：ユーザーフィードバック後、品質向上を経て公開検討

## チーム構成
- **開発規模**：プロフェッショナル開発者5名
- **体制**：各担当者が責任を持って開発、UT実施、ソースレビュー実施

## 推奨技術スタック

### フロントエンド
- **フレームワーク**：React 18+ with TypeScript
- **ビルドツール**：Vite（高速開発、最適化されたビルド）
- **スタイリング**：Tailwind CSS
- **状態管理**：Zustand（軽量で直感的）
- **UIライブラリ**：Material-UI or Headless UI（オプション）

### データベース
- **DBMS**：SQLite（指定）
- **ライブラリ**：
  - PWA環境：sql.js（ブラウザで実行）
  - デスクトップ化時：better-sqlite3（同期API）
- **ORM/クエリビルダー**：Prisma（SQLiteサポート）or raw SQL

### テスト・品質保証
- **ユニットテスト**：Vitest
- **UI テスト**：React Testing Library
- **E2E テスト**：Playwright or Cypress
- **コード品質**：ESLint + Prettier
- **カバレッジ目標**：80%以上

### その他
- **パッケージマネージャー**：pnpm（高速、効率的）
- **バージョン管理**：Git（主流ブランチ保護、PR必須）
- **CI/CD**：GitHub Actions（テスト自動実行）

## ファイル構成
```
家計簿APP/
├── CLAUDE.md（本ファイル）
├── src/
│   ├── components/         # React コンポーネント
│   ├── pages/             # ページコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── services/          # API・DB操作ロジック
│   ├── store/             # 状態管理（Zustand）
│   ├── utils/             # ユーティリティ関数
│   ├── types/             # TypeScript型定義
│   ├── styles/            # グローバルスタイル
│   └── App.tsx
├── tests/
│   ├── unit/              # ユニットテスト
│   ├── integration/        # 統合テスト
│   └── e2e/               # E2Eテスト
├── public/                # 静的ファイル
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## 開発ガイドライン

### 命名規則
- **コンポーネント**：PascalCase（例：UserProfile.tsx）
- **関数・変数**：camelCase（例：calculateTotal）
- **定数**：UPPER_SNAKE_CASE（例：MAX_TRANSACTIONS）
- **ファイル**：kebab-case（例：user-profile.tsx）

### コード品質基準
1. **TypeScript**：strictモードを有効化、型安全性を徹底
2. **ESLint + Prettier**：全員統一ルールで自動フォーマット
3. **テスト**：
   - 全関数にユニットテスト必須
   - 重要な機能は統合テストも実施
   - テスト駆動開発（TDD）を推奨
4. **コメント**：ロジックが自明でない場合のみ記述

### Pull Request（レビュー）プロセス
1. 機能ごとにフィーチャーブランチを作成
2. テストを全て合格させ、カバレッジ確認
3. PullRequestを作成し、最低2名以上のレビューを必須
4. CI/CDがパス、レビュー承認後にマージ
5. mainブランチへのマージは保護ルール適用

### ユニットテスト（UT）の実施
- 各担当者が開発した関数・コンポーネントについてテスト記述
- テスト実行：`pnpm test`
- カバレッジ確認：`pnpm test --coverage`
- CI/CDにて自動実行、fail時はマージブロック

### 改修後の公開フロー
- **必須**: 機能実装後は必ず `git commit` → `git push` して GitHub Pages に反映させる
- デプロイ前の動作確認後、本番反映完了までを開発フローの一部とする
- Claude側で自動的にコミット・プッシュまで実施すること

### リリース規則
- **Phase 1完了**：家族で1ヶ月以上運用、フィードバック収集
- **改善サイクル**：フィードバック反映、テスト追加、レビュー実施
- **公開判定**：安定性、使い勝手、セキュリティを総合判定

## グローバル指示との関係
- 応答スタイル：グローバルCLAUDE.mdに準拠
- 推論アプローチ：グローバルCLAUDE.mdに準拠
- 質問・確認：日本語で実施、秘書的丁寧さを保持

## その他の注意事項
- **セキュリティ**：家計情報の機密性を重視。実装時にはXSS・SQLインジェクション対策を必須
- **パフォーマンス**：SQLiteクエリ最適化、React再レンダー最小化
- **アクセシビリティ**：WCAG 2.1 Level AA以上を目指す
- **ドキュメント**：各モジュール・関数に簡潔な説明を記載
