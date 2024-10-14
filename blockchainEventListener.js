require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const { Client } = require("pg");

const app = express();
const PORT = process.env.PORT || 4000;

const INFURA_PROJECT_ID = process.env.INFURA_API_KEY;
const provider = new ethers.providers.InfuraProvider(
  "mainnet",
  INFURA_PROJECT_ID
);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect((err) => {
  if (err) {
    console.error("Connection error:", err.stack);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

const contractAddress = "0xd9a442856c234a39a81a089c06451ebaa4306a72";
const abi = [
  "function totalAssets() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
];
const contract = new ethers.Contract(contractAddress, abi, provider);

provider.on("block", async (blockNumber) => {
  try {
    console.log(`New block detected: ${blockNumber}`);
    const totalAssets = await contract.totalAssets();
    const totalSupply = await contract.totalSupply();
    const result = totalAssets / totalSupply;

    const query = `INSERT INTO contract_data (totalAssets, totalSupply, result, timestamp) VALUES ($1, $2, $3, NOW())`;
    const values = [
      totalAssets.toString(),
      totalSupply.toString(),
      result.toString(),
    ];

    client.query(query, values, (err, res) => {
      if (err) {
        console.error("Error inserting data into database:", err.stack);
      } else {
        console.log("New data saved at timestamp:", new Date().toISOString());
      }
    });
  } catch (error) {
    console.error("Error handling block event:", error);
  }
});

app.get("/contract-history", (req, res) => {
  const query = `SELECT * FROM contract_data ORDER BY timestamp DESC`;
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching data from database:", err.stack);
      res.status(500).json({ error: "Error fetching data from database" });
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
