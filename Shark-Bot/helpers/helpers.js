const axios = require("axios");
const Web3 = require("web3");
const moment = require("moment-timezone");
require("dotenv").config({path: "../.env"});

// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL);

// 1INCH API URL
const ONE_SPLIT_API_URL = `https://api.1inch.exchange/v2.0/`;

// DEFIPULSE GAS STATION API URL
const GAS_STATION_API_URL = `https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=`

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

/***
 * gets the average gas price from a defipulse gas station api quote request
 *
 */
async function getAverageGas() {
    const { data } = await axios.get(
        `${GAS_STATION_API_URL}` +
            process.env.DEFIPULSEAPIKEY
    );
    return data;
}

/***
 * Trade execution function - work in progress
 *
 */
// async function executeTrade(inputTokenAddress, outputTokenAddress, inputAmount) {
//     const { data } = await axios.get(
//         `${ONE_SPLIT_API_URL}swap?fromTokenAddress=` +
//             inputTokenAddress +
//             "&toTokenAddress=" +
//             outputTokenAddress +
//             "&amount=" +
//             inputAmount
//     );
//     return data;
// }

/***
 * Formats output token amount accordingly to it's decimals
 *
 */
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

    // Determines the total cost of gas (i.e. transaction fee) uses the current average fastest gas fee
    const totalTradeGas = tradeOne.estimatedGas + tradeTwo.estimatedGas;
    const gasStationData = await getAverageGas();
    const averageFastGasPrice = (gasStationData.fast / 10);
    const totalGasGwei = totalTradeGas * averageFastGasPrice
    const totalGasWei = web3.utils.toWei(totalGasGwei.toString(), "gwei");
    const totalGasEther = web3.utils.fromWei(totalGasWei.toString(), "ether");
    const totalGas = {
            Gwei: totalGasGwei,
            Wei: totalGasWei,
            Ether: totalGasEther
        }

    // Checks if the final output is greater than the input amount plus estimated total gas cost
    if (Number(inputAmount) + Number(totalGas.Wei) <= tradeTwo.toTokenAmount) {
        executable = true;
        console.log(Number(inputAmount) + Number(totalGas.Wei))
    }

    // Identifies the protocols used in the trades
    // const tradeOneProtocols = tradeOne.protocols;
    // const tradeOneProtocolsList = tradeOne.protocols[0].map(function(protocol){
    //     return protocol[0].name
    // });
    // const tradeTwoProtocols = tradeTwo.protocols;
    // const tradeTwoProtocolsList = tradeTwo.protocols[0].map(function(protocol){
    //     return protocol[0].name
    // });

    // Format tokens based on their respective decimals
    const tradeOneReturn = formatTradeReturn(tradeOne, tradeOne.decimals);
    const tradeTwoReturn = formatTradeReturn(tradeTwo, tradeTwo.decimals);

    // Creates table of above data plus timestamp    
    console.table([
        {
            "Input Token": inputTokenSymbol,
            "Output Token": outputTokenSymbol,
            "Input Amount": web3.utils.fromWei(inputAmount, "Ether"),
            "TradeOne Return": tradeOneReturn,
            // "TradeOne Protocols": tradeOneProtocolsList,
            "TradeTwo Return": tradeTwoReturn,
            // "TradeTwo Protocols": tradeTwoProtocolsList,
            "Total Gas Fee": totalGas.Ether,
            "Execute trade": executable,
            Timestamp: moment().tz("America/Chicago").format(),
        },
    ]);
}

module.exports = { getQuoteOutput, formatTradeReturn, checkPair };
