import cors from "@elysiajs/cors";

const allowedOrigins = [process.env.CORS_ORIGIN];

export const corsMiddleware = cors({
  origin: (request) => {
    const origin = request.headers.get("origin");
    return origin !== null && allowedOrigins.includes(origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Set-Cookie"],
  maxAge: 86400,
});
