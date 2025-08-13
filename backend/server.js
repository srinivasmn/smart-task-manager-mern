import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import webpush from "web-push";

import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import authmiddleware from "./authmiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Web Push setup
webpush.setVapidDetails(
  `mailto:${process.env.ADMIN_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authmiddleware(req),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/api/graphql" });

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startServer();
