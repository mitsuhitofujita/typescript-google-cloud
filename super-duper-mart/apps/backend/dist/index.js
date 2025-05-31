"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/index.ts
const fastify_1 = __importDefault(require("fastify"));
const static_1 = __importDefault(require("@fastify/static"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const google_auth_library_1 = require("google-auth-library");
const firestore_1 = require("@google-cloud/firestore");
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify = (0, fastify_1.default)({
    logger: true,
});
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}
fastify.register(cookie_1.default, { secret: process.env.JWT_SECRET });
fastify.register(jwt_1.default, { secret: process.env.JWT_SECRET });
const firestore = new firestore_1.Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const oAuth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
// CORS設定
fastify.register(cors_1.default, {
    origin: "http://localhost:5173", // フロントエンドのURLに合わせてください
    credentials: true,
});
// 静的ファイル配信の設定
fastify.register(static_1.default, {
    root: node_path_1.default.join(__dirname, "../../frontend/dist"),
    prefix: "/",
    wildcard: false,
});
// 1. Google認証開始
fastify.get("/api/auth/google", async (req, reply) => {
    const url = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
    });
    reply.redirect(url);
});
// 2. Googleコールバック
fastify.get("/api/auth/google/callback", async (req, reply) => {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    if (!tokens.id_token) {
        return reply.code(400).send({ error: "ID token not found in Google response" });
    }
    const ticket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub) {
        return reply.code(400).send({ error: "Invalid Google user payload" });
    }
    // Firestoreにユーザー保存
    await firestore.collection("users").doc(payload.sub).set({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        lastLogin: new Date(),
    }, { merge: true });
    // JWT発行（例：userIdとemailだけ最小限）
    const token = fastify.jwt.sign({ userId: payload.sub, email: payload.email }, { expiresIn: "7d" });
    // HttpOnly CookieとしてJWT保存
    reply.setCookie("jwt", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7日
    });
    reply.redirect("/dashboard"); // ログイン後ページへ
});
// 3. ログイン状態確認API
fastify.get("/api/auth/me", async (req, reply) => {
    try {
        const jwt = req.cookies.jwt;
        if (!jwt)
            return reply.code(401).send({ authenticated: false });
        const payload = fastify.jwt.verify(jwt);
        // Firestoreからユーザー情報を取得
        const doc = await firestore.collection("users").doc(payload.userId).get();
        if (!doc.exists)
            return reply.code(401).send({ authenticated: false });
        return { authenticated: true, user: doc.data() };
    }
    catch (e) {
        return reply.code(401).send({ authenticated: false });
    }
});
// SPA のためのフォールバックルート
fastify.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith("/api")) {
        return reply.code(404).send({ message: "API route not found" });
    }
    return reply.type("text/html").sendFile("index.html");
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
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
