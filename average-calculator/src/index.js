const express = require("express");
const dotenv = require("dotenv");
const { fetchNumbers, calculateAverage } = require("./averageCalculator");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9876;

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  const validIds = ["p", "f", "e", "r"];

  if (!validIds.includes(numberid)) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  try {
    const result = await fetchNumbers(numberid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
