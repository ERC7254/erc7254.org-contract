require('dotenv').config({ path: '../.env'});
const { ethers } = require("ethers");

// const INFURA_KEY = "YOUR_INFURA_KEY";
const PRIVATE_KEY = process.env.ADMIN;

const BlastBridgeAddress = "0xc644cc19d2A9388b71dd1dEde07cFFC73237Dca8";

// Providers for Sepolia and Blast networks
const sepoliaProvider = new ethers.providers.JsonRpcProvider(`https://rpc.ankr.com/eth_sepolia`);
const blastProvider = new ethers.providers.JsonRpcProvider("https://sepolia.blast.io");

// Wallet setup
const wallet = new ethers.Wallet(PRIVATE_KEY);
const sepoliaWallet = wallet.connect(sepoliaProvider);
const blastWallet = wallet.connect(blastProvider);

run()
async function run(){
    // Transaction to send 0.1 Sepolia ETH
    const tx = {
        to: BlastBridgeAddress,
        value: ethers.utils.parseEther("1.4")
    };

    const transaction = await sepoliaWallet.sendTransaction(tx);
    await transaction.wait();

    // Confirm the bridged balance on Blast
    const balance = await blastProvider.getBalance(wallet.address);
    console.log(`Balance on Blast: ${ethers.utils.formatEther(balance)} ETH`);
}

