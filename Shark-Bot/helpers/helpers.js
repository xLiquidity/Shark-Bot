const axios = require("axios");

const ONE_SPLIT_API_URL = `https://api.1inch.exchange/v2.0/`;

/***
 * gets the output amount from a one inch api quote request
 *
 */
async function getQuoteOutput(inputTokenAddress, outputTokenAddress, inputAmount) {
    const { data } = await axios.get(
        `${ONE_SPLIT_API_URL}quote?fromTokenAddress=` +
            inputTokenAddress +
            "&toTokenAddress=" +
            outputTokenAddress +
            "&amount=" +
            inputAmount
    );
    return data;
}

function formatTradeReturn(tradeOutput) {
    return tradeOutput.toTokenAmount / 10 ** tradeOutput.toToken.decimals;
}

module.exports = { getQuoteOutput, formatTradeReturn };
