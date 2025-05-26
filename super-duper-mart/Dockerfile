# apps/backend/package.json の engines.node で指定されている Node.js バージョンを使用
FROM node:20-slim as builder

# リポジトリルートから super-duper-mart ディレクトリを作業ディレクトリに設定
# これにより、以降の COPY や RUN コマンドは super-duper-mart の中を基準に動作します。
WORKDIR /super-duper-mart

# pnpm をインストール
RUN npm install -g pnpm

# pnpm-workspace.yaml, package.json, pnpm-lock.yaml をコピー
COPY super-duper-mart/pnpm-workspace.yaml ./
COPY super-duper-mart/package.json ./
COPY super-duper-mart/pnpm-lock.yaml ./

# apps ディレクトリ内の package.json もコピー
COPY super-duper-mart/apps/backend/package.json ./apps/backend/
COPY super-duper-mart/apps/frontend/package.json ./apps/frontend/


# 依存関係をインストール
# --frozen-lockfile を使用して、pnpm-lock.yaml に基づいて正確に依存関係をインストールします。
RUN pnpm install --frozen-lockfile

# ソースコードをコピー (super-duper-mart ディレクトリ以下をすべてコピー)
COPY super-duper-mart .

# フロントエンドのビルド
WORKDIR /super-duper-mart/apps/frontend
RUN pnpm build

# バックエンドのビルド
WORKDIR /super-duper-mart/apps/backend
RUN pnpm build


# 実行用イメージの作成
FROM node:20-slim

# リポジトリルートから super-duper-mart ディレクトリを作業ディレクトリに設定
WORKDIR /super-duper-mart

# pnpm をインストール (必要であれば、本番環境でも使用する場合)
RUN npm install -g pnpm --silent

# アプリケーションの依存関係のみをコピー
COPY --from=builder /super-duper-mart/pnpm-workspace.yaml ./
COPY --from=builder /super-duper-mart/package.json ./
COPY --from=builder /super-duper-mart/pnpm-lock.yaml ./
COPY --from=builder /super-duper-mart/apps/backend/package.json ./apps/backend/
COPY --from=builder /super-duper-mart/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /super-duper-mart/node_modules ./node_modules
COPY --from=builder /super-duper-mart/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /super-duper-mart/apps/frontend/node_modules ./apps/frontend/node_modules

# ビルド済みフロントエンド静的ファイルとバックエンドアプリケーションコードをコピー
# dist ディレクトリは apps/frontend と apps/backend の中にある
COPY --from=builder /super-duper-mart/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /super-duper-mart/apps/backend/dist ./apps/backend/dist
COPY --from=builder /super-duper-mart/apps/backend/src ./apps/backend/src # ソースコードをコピー (ビルド済みの index.js を参照するため)

# Fastifyアプリケーションの起動コマンド
# Cloud Runはデフォルトでポート8080をリッスンします
ENV PORT 8080
EXPOSE 8080

# アプリケーションの起動ディレクトリをバックエンドの dist に設定
WORKDIR /super-duper-mart/apps/backend
CMD [ "node", "dist/index.js" ]
