// apps/backend/src/index.ts
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';

// ① Fastify インスタンスの作成
const fastify = Fastify({
  logger: true,
});

// ② 静的ファイル配信の設定
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../../frontend/dist'), // dist ディレクトリへのパス
  prefix: '/', // ルートパスで配信
  wildcard: false, // SPA で重要な設定: ルートパスでファイルを直接解決しない
  decorateReply: false // 不要なプロパティの追加を防ぐ
});

// ③ SPA のためのフォールバックルート
// 上記の静的ファイル配信でファイルが見つからなかった場合、index.html を返す
fastify.setNotFoundHandler(async (request, reply) => {
  if (request.url.startsWith('/api')) {
    // API ルートの場合は 404 を返す
    reply.code(404).send({ message: 'API route not found' });
  } else {
    // それ以外のルートは index.html を返す (SPA のクライアントサイドルーティング用)
    reply.sendFile('index.html');
  }
});

// 既存のAPIルート
fastify.get('/api/hello', async (request, reply) => {
  return { message: 'Hello from Fastify!' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
