// apps/backend/src/index.ts
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";

const fastify = Fastify({
	logger: true,
});

// 静的ファイル配信の設定
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "../../frontend/dist"),
	prefix: "/",
	wildcard: false,
	decorateReply: false,
});

// SPA のためのフォールバックルート
fastify.setNotFoundHandler(async (request, reply) => {
	if (request.url.startsWith("/api")) {
		reply.code(404).send({ message: "API route not found" });
	} else {
		reply.sendFile("index.html");
	}
});

// 既存のAPIルート
fastify.get("/api/hello", async (request, reply) => {
	return { message: "Hello from Fastify!" };
});

const start = async () => {
	try {
		// 環境変数からポートを取得、設定されていなければ3000を使用
		const port = Number.parseInt(process.env.PORT || "3000", 10);
		await fastify.listen({ port: port, host: "0.0.0.0" }); // 0.0.0.0をリッスンすることで、コンテナ外部からのアクセスを許可
		fastify.log.info(`Server listening on http://localhost:${port}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
