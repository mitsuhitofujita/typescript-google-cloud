# apps/backend/package.json の engines.node で指定されている Node.js バージョンを使用
FROM node:20-slim as builder

# Dockerコンテナ内の作業ディレクトリを設定
# このディレクトリは、最終的にアプリケーションが配置される場所です。
# リポジトリのサブディレクトリ構造をDockerコンテナ内にも反映させます。
WORKDIR /app/super-duper-mart

# pnpm をインストール
RUN npm install -g pnpm

# pnpm-workspace.yaml, package.json, pnpm-lock.yaml をコピー
# Dockerfileがリポジトリルートにあるため、コピー元パスはリポジトリルートからの相対パスです。
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
# Dockerビルドコンテキストの 'super-duper-mart' ディレクトリの内容を、
# コンテナ内の現在の WORKDIR (これも /app/super-duper-mart) にコピーします。
# 重要なのは、Dockerビルドコマンドはリポジトリのルートで実行されるため、
# COPY元のパスはリポジトリルートからの相対パスである必要がある点です。
COPY super-duper-mart/ .

# フロントエンドのビルド
# WORKDIR は /app/super-duper-mart なので、apps/frontend への相対パス
WORKDIR /app/super-duper-mart/apps/frontend
RUN pnpm build

# バックエンドのビルド
# WORKDIR は /app/super-duper-mart なので、apps/backend への相対パス
WORKDIR /app/super-duper-mart/apps/backend
RUN pnpm build


# 実行用イメージの作成
FROM node:20-slim

# Dockerコンテナ内の作業ディレクトリを設定
WORKDIR /app/super-duper-mart

# pnpm をインストール (必要であれば、本番環境でも使用する場合)
RUN npm install -g pnpm --silent

# アプリケーションの依存関係のみをコピー
# ビルドステージの /app/super-duper-mart からコピーします。
COPY --from=builder /app/super-duper-mart/pnpm-workspace.yaml ./
COPY --from=builder /app/super-duper-mart/package.json ./
COPY --from=builder /app/super-duper-mart/pnpm-lock.yaml ./
COPY --from=builder /app/super-duper-mart/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/super-duper-mart/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/super-duper-mart/node_modules ./node_modules
COPY --from=builder /app/super-duper-mart/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/super-duper-mart/apps/frontend/node_modules ./apps/frontend/node_modules

# ビルド済みフロントエンド静的ファイルとバックエンドアプリケーションコードをコピー
# dist ディレクトリは apps/frontend と apps/backend の中にある
COPY --from=builder /app/super-duper-mart/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/super-duper-mart/apps/backend/dist ./apps/backend/dist
# バックエンドのソースコードはビルド済みが dist にあるため、src ディレクトリ自体は不要です。
# ただし、もしソースコード（例えば src/index.ts）が dist に含まれず、
# 実行時に必要となる場合は含める必要があります。
# 今回の構成では dist/index.js を実行するため、src は不要です。
# COPY --from=builder /app/super-duper-mart/apps/backend/src ./apps/backend/src 

# Fastifyアプリケーションの起動コマンド
# Cloud Runはデフォルトでポート8080をリッスンします
ENV PORT 8080
EXPOSE 8080

# アプリケーションの起動ディレクトリをバックエンドのルートに設定
# dist/index.js を実行するためには、apps/backend ディレクトリをカレントにするのが適切です。
WORKDIR /app/super-duper-mart/apps/backend
CMD [ "node", "dist/index.js" ]
