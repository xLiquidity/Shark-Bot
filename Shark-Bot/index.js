require("dotenv").config();
const express = require("express");
const http = require("http");
const Web3 = require("web3");
const { checkPair } = require("./helpers/helpers");

// SERVER CONFIG
const PORT = process.env.PORT || 5000;
const app = express();
const server = http
    .createServer(app)
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL);

let priceMonitor;
let monitoringPrice = false;

async function monitorPrice() {
    if (monitoringPrice) {
        return;
    }

    console.log("Checking prices...");
    monitoringPrice = true;

    try {
        // ADD CUSTOM TOKEN PAIRS HERE

        await checkPair({
            inputTokenSymbol: "ETH",
            inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            outputTokenSymbol: "MKR",
            outputTokenAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
            inputAmount: web3.utils.toWei("1", "ETHER"),
        });

        await checkPair({
            inputTokenSymbol: "ETH",
            inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            outputTokenSymbol: "DAI",
            outputTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
            inputAmount: web3.utils.toWei("1", "ETHER"),
        });

        await checkPair({
            inputTokenSymbol: "ETH",
            inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            outputTokenSymbol: "KNC",
            outputTokenAddress: "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
            inputAmount: web3.utils.toWei("1", "ETHER"),
        });

        await checkPair({
            inputTokenSymbol: "ETH",
            inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            outputTokenSymbol: "LINK",
            outputTokenAddress: "0x514910771af9ca656af840dff83e8264ecf986ca",
            inputAmount: web3.utils.toWei("1", "ETHER"),
        });

        await checkPair({
            inputTokenSymbol: "ETH",
            inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            outputTokenSymbol: "WBTC",
            outputTokenAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
            inputAmount: web3.utils.toWei("1", "ETHER"),
        });

        await checkPair({
            inputTokenSymbol: "ETH",
            inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            outputTokenSymbol: "USDC",
            outputTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            inputAmount: web3.utils.toWei("1", "ETHER"),
        });

        await checkPair({
            inputTokenSymbol: "ETH",
            inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            outputTokenSymbol: "BAC",
            outputTokenAddress: "0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a",
            inputAmount: web3.utils.toWei("1", "ETHER"),
        });
    } catch (error) {
        console.error(error);
        monitoringPrice = false;
        clearInterval(priceMonitor);
        return;
    }

    monitoringPrice = false;
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000; // 3 Seconds
priceMonitor = setInterval(async () => {
    await monitorPrice();
}, POLLING_INTERVAL);
