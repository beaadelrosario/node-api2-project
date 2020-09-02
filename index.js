const express = require("express");
const posts_router = require("./posts/posts-router");
const server = express();
const db = require("./data/db");

server.use(express.json());
server.use("/api/posts", posts_router)

server.use("/", (req, res) => res.send("API is running"));
server.listen(9000, () => console.log("Listening on port 9000"));