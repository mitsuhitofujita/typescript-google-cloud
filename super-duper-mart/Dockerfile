# apps/backend/package.json の engines.node で指定されている Node.js バージョンを使用
FROM node:20-slim as builder

# 作業ディレクトリを設定
WORKDIR /app

# pnpm をインストール
RUN npm install -g pnpm

# pnpm-workspace.yaml と package.json をコピーして依存関係をインストール
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/

# 依存関係をインストール
# --frozen-lockfile を使用して、pnpm-lock.yaml に基づいて正確に依存関係をインストールします。
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# フロントエンドのビルド
WORKDIR /app/apps/frontend
RUN pnpm build

# バックエンドのビルド
WORKDIR /app/apps/backend
RUN pnpm build


# 実行用イメージの作成
FROM node:20-slim

WORKDIR /app

# pnpm をインストール (必要であれば、本番環境でも使用する場合)
RUN npm install -g pnpm --silent

# アプリケーションの依存関係のみをコピー
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/frontend/node_modules ./apps/frontend/node_modules

# ビルド済みフロントエンド静的ファイルとバックエンドアプリケーションコードをコピー
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/src/index.ts ./apps/backend/src/index.ts

# Fastifyアプリケーションの起動コマンド
# Cloud Runはデフォルトでポート8080をリッスンします
ENV PORT 8080
EXPOSE 8080

WORKDIR /app/apps/backend
CMD [ "node", "dist/index.js" ]
