pragma solidity >=0.5.0;

contract PriceData {
    uint storedData; // state variable
    constructor() public {
        storedData;
    }

    // function can be only be called from within contract and contracts that inherit it
     function readPriceData() internal pure returns(string memory) {
        uint256 ethPriceKyber; 
        uint256 daiPriceKyber; 
        uint256 ethPriceUniswap;
        uint256 daiPriceUniswap;

        if(ethPriceKyber < daiPriceKyber) {
            return "Trade";
        }
        else if(ethPriceUniswap < daiPriceUniswap) {
            return "trade";   
             }
        else {
            return "No Trade";
        }

    }
}
   
