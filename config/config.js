require('dotenv').config({ path: '../.env'});
const CONTRACTS = require("../scripts/contract.json")

const ethers = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(CONTRACTS["blast-sepolia"]["rpc"]); 

const abiFactory = require("../artifacts/contracts/FactoryTokenRevenueSharing.sol/FactoryTokenRevenueSharing.json")
const addressFactory = CONTRACTS["blast-sepolia"]["factory"]
const contractFactory = new ethers.Contract(addressFactory, abiFactory.abi, provider)

const PRIVATE_KEY = process.env.ADMIN
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

// WEB3
const Web3 = require('web3')
const web3 = new Web3(CONTRACTS["blast-sepolia"]["rpc"])
const contractWeb3 = new web3.eth.Contract(abiFactory.abi, addressFactory)

// block 908394: 0x05e1147F6B7524fEaE00109dc8809C4284007405
run()
async function run(){
    // await mint()
    await getToken()
}

async function getToken(){
    // var result = await contractWeb3.getPastEvents("Create", { fromBlock: block, toBlock: block });
    // console.log(result)
    var result = await contractFactory.allRevenueSharingTokens(1)
    console.log(result.toString())
}

async function mint(){
    var nameToken = "Token Revenue Sharing"
    var symbol = "TRS"
    var tokenReward = CONTRACTS["blast-sepolia"]["weth"]
    var totalSupply = '100000000000000000000000'
    // var owner = wallet.address
    const contractSigner = contractFactory.connect(wallet)
    const tx = await contractSigner.create(nameToken, symbol, tokenReward, totalSupply);
    console.log("Mining transaction...");
    // Waiting for the transaction to be mined
    const receipt = await tx.wait();
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
}


