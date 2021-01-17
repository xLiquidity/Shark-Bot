const axios = require("axios");
const Web3 = require("web3");
const moment = require("moment-timezone");

// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL);

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

/***
 * PRICE CHECKING FUNCTION
 *
 */
async function checkPair(args) {
    const {
        inputTokenSymbol,
        inputTokenAddress,
        outputTokenSymbol,
        outputTokenAddress,
        inputAmount,
    } = args;

    // Sets the initial determination if a contract should execute or not
    let executable = false;

    // Calls the 1inch API to provide quote of swapping input token to intermediary token
    const tradeOne = await getQuoteOutput(
        inputTokenAddress,
        outputTokenAddress,
        inputAmount
    );

    // Calls the 1inch API to provide quote of swapping intermediary token back to input token
    const tradeTwo = await getQuoteOutput(
        outputTokenAddress,
        inputTokenAddress,
        tradeOne.toTokenAmount
    );

    // Checks if the final output is greater than the input amount by equal or greater than 5%
    if (Number(inputAmount) * 1.05 <= tradeTwo.toTokenAmount) {
        executable = true;
    }

    const tradeOneReturn = formatTradeReturn(tradeOne, tradeOne.decimals);
    const tradeTwoReturn = formatTradeReturn(tradeTwo, tradeTwo.decimals);

    // Creates table of above data plus timestamp
    console.table([
        {
            "Input Token": inputTokenSymbol,
            "Output Token": outputTokenSymbol,
            "Input Amount": web3.utils.fromWei(inputAmount, "Ether"),
            "TradeOne Return": tradeOneReturn,
            "TradeTwo Return": tradeTwoReturn,
            "Execute trade": executable,
            Timestamp: moment().tz("America/Chicago").format(),
        },
    ]);
}

module.exports = { getQuoteOutput, formatTradeReturn, checkPair };
