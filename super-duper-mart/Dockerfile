# apps/backend/package.json の engines.node で指定されている Node.js バージョンを使用
FROM node:20-slim as builder

# Dockerコンテナ内の作業ディレクトリを設定
# このディレクトリは、最終的にアプリケーションが配置される場所です。
# /app を使うのが一般的です
WORKDIR /app

# pnpm をインストール
RUN npm install -g pnpm

# pnpm-workspace.yaml, package.json, pnpm-lock.yaml をコピー
# GitHub Actions の working-directory により、super-duper-mart がビルドコンテキストのルートになるため、
# 直接ファイル名を指定します。
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# apps ディレクトリ内の package.json もコピー
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/


# 依存関係をインストール
# --frozen-lockfile を使用して、pnpm-lock.yaml に基づいて正確に依存関係をインストールします。
RUN pnpm install --frozen-lockfile

# ソースコードをコピー (super-duper-mart ディレクトリ以下をすべてコピー)
# ビルドコンテキストのルート（super-duper-mart の中身）をコンテナの現在の WORKDIR (/app) にコピー
COPY . .

# フロントエンドのビルド
WORKDIR /app/apps/frontend
RUN pnpm build

# バックエンドのビルド
WORKDIR /app/apps/backend
RUN pnpm build


# 実行用イメージの作成
FROM node:20-slim

# Dockerコンテナ内の作業ディレクトリを設定
WORKDIR /app

# pnpm をインストール (必要であれば、本番環境でも使用する場合)
RUN npm install -g pnpm --silent

# アプリケーションの依存関係のみをコピー
# ビルドステージの /app からコピー
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/frontend/node_modules ./apps/frontend/node_modules

# ビルド済みフロントエンド静的ファイルとバックエンドアプリケーションコードをコピー
# dist ディレクトリは apps/frontend と apps/backend の中にある
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Fastifyアプリケーションの起動コマンド
# Cloud Runはデフォルトでポート8080をリッスンします
ENV PORT 8080
EXPOSE 8080

# アプリケーションの起動ディレクトリをバックエンドのルートに設定
WORKDIR /app/apps/backend
CMD [ "node", "dist/index.js" ]
