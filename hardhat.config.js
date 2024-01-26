/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//  require('@nomicfoundation/hardhat-toolbox');
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require('hardhat-abi-exporter');

 const dotenv = require('dotenv');
 dotenv.config({ path: '.env' });
 
 module.exports = {
   defaultNetwork: "local",
   networks: {
    "blast-sepolia": {
      url: "https://rpc.ankr.com/blast_testnet_sepolia",
      accounts: [process.env.ADMIN],
      gasPrice: 1000000000,
    }
   },
 
   // include compiler version defined in your smart contract
   solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
   },
   solidityx: {
    compilerPath: "PATH_TO_SOLC_COMPILER",
    },
   paths: {
     sources: "./contracts",
     cache: "./cache",
     artifacts: "./artifacts",
   },
   mocha: {
     timeout: 20000,
   },
   etherscan : {
    apiKey: process.env.API_KEY
  }
 };