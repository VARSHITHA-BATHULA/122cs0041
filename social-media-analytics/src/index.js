const express = require("express");
const dotenv = require("dotenv");
const { getTopUsers, getPosts } = require("./analytics");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9877;

app.get("/users", async (req, res) => {
  try {
    const topUsers = await getTopUsers();
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/posts", async (req, res) => {
  const { type } = req.query;
  if (!["popular", "latest"].includes(type)) {
    return res.status(400).json({ error: "Invalid type parameter" });
  }

  try {
    const posts = await getPosts(type);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
