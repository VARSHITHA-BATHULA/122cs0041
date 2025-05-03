const axios = require("axios");
require("dotenv").config();

const WINDOW_SIZE = 10;
let numberWindow = [];

const endpointMap = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

async function fetchNumbers(numberid) {
  const endpoint = endpointMap[numberid];
  const url = `${process.env.TEST_SERVER_URL}/${endpoint}`;
  const prevState = [...numberWindow];

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
      timeout: 500,
    });

    const newNumbers = response.data.numbers || [];
    const uniqueNumbers = [...new Set([...numberWindow, ...newNumbers])];

    numberWindow = uniqueNumbers.slice(-WINDOW_SIZE);

    const avg =
      numberWindow.length > 0
        ? (
            numberWindow.reduce((sum, num) => sum + num, 0) /
            numberWindow.length
          ).toFixed(2)
        : 0;

    return {
      windowPrevState: prevState,
      windowCurrState: numberWindow,
      numbers: newNumbers,
      avg: parseFloat(avg),
    };
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return {
      windowPrevState: prevState,
      windowCurrState: numberWindow,
      numbers: [],
      avg:
        numberWindow.length > 0
          ? (
              numberWindow.reduce((sum, num) => sum + num, 0) /
              numberWindow.length
            ).toFixed(2)
          : 0,
    };
  }
}

module.exports = { fetchNumbers };

async function calculateAverage() {
  const result = await fetchNumbers("p");
  return result.avg;
}