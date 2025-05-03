const axios = require("axios");
require("dotenv").config();

async function fetchData(endpoint) {
  const url = `${process.env.TEST_SERVER_URL}/${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      timeout: 500,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return [];
  }
}

async function getTopUsers() {
  const users = await fetchData("users");
  const userCommentCounts = [];

  for (const user of users) {
    const posts = await fetchData(`users/${user.id}/posts`);
    let totalComments = 0;

    for (const post of posts.posts) {
      const comments = await fetchData(`posts/${post.id}/comments`);
      totalComments += comments.comments.length;
    }

    userCommentCounts.push({ user, commentCount: totalComments });
  }

  return userCommentCounts
    .sort((a, b) => b.commentCount - a.commentCount)
    .slice(0, 5)
    .map(({ user }) => user);
}

async function getPosts(type) {
  const users = await fetchData("users");
  const allPosts = [];

  for (const user of users) {
    const posts = await fetchData(`users/${user.id}/posts`);
    for (const post of posts.posts) {
      const comments = await fetchData(`posts/${post.id}/comments`);
      allPosts.push({
        ...post,
        commentCount: comments.comments.length,
        createdAt: new Date(), // Simulate timestamp
      });
    }
  }

  if (type === "popular") {
    const maxComments = Math.max(...allPosts.map((post) => post.commentCount));
    return allPosts.filter((post) => post.commentCount === maxComments);
  } else {
    return allPosts.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  }
}

module.exports = { getTopUsers, getPosts };
