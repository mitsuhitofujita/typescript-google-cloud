import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { getCorsOrigins, getJwtSecret, getStaticFilesPath } from "./env";

export function prepareFastify(fastify: FastifyInstance) {
	const jwtSecret = getJwtSecret();
	// JWTのシークレットを設定
	fastify.register(fastifyCookie, { secret: jwtSecret });
	fastify.register(fastifyJwt, { secret: jwtSecret });

	// CORS設定
	fastify.register(fastifyCors, {
		origin: getCorsOrigins(), // フロントエンドのURLに合わせてください
		credentials: true,
	});

	// 静的ファイル配信の設定
	fastify.register(fastifyStatic, {
		root: getStaticFilesPath(),
		prefix: "/",
		wildcard: false,
	});
}
