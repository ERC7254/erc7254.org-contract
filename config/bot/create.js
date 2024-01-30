require('dotenv').config({ path: '../../.env'});
var list_key = [
    process.env.PRIVATEKEY_1,
    process.env.PRIVATEKEY_2,
    process.env.PRIVATEKEY_3,
    process.env.PRIVATEKEY_4,
    process.env.PRIVATEKEY_5,
    process.env.PRIVATEKEY_6,
    process.env.PRIVATEKEY_7,
    process.env.PRIVATEKEY_8,
    process.env.PRIVATEKEY_9,
    process.env.PRIVATEKEY_10,
    process.env.PRIVATEKEY_11,
    process.env.PRIVATEKEY_12
]

// const Web3 = require('web3');

// const web3 = new Web3('https://rpc.ankr.com/blast_testnet_sepolia');
const ethers = require('ethers');
const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/blast_testnet_sepolia'); 

const abiFactory = require("../../artifacts/contracts/FactoryTokenRevenueSharing.sol/FactoryTokenRevenueSharing.json")
const addressFactory = '0x3Ff7C614BD1CE904DEda330a1851f4CDB4414361'
const contractFactory = new ethers.Contract(addressFactory, abiFactory.abi, provider)

var name = [
    'SOC',
    'Hommies',
    'Bounce',
    'VERA',
    'GROK',
    'Flooring',
    'Pond',
    'DORK',
    'XEN Crypto',
    'Wally',
    'SAND',
    'BEBE'
]

var symbol = [
    'SOC',
    "HOM",
    "BOUNCE",
    "VERA",
    "GROK",
    "FLOOR",
    "POND",
    "DORK",
    "XEN",
    "WALL",
    "SAND",
    "BEBE"
]

var totalSupply = '100000000000000000000000'

run()
async function run(){
    for(var i =0; i< list_key.length; i++){
        const wallet = new ethers.Wallet(list_key[i], provider)
        var tokenReward = '0x4200000000000000000000000000000000000023'
        const contractSigner = contractFactory.connect(wallet)
        const tx = await contractSigner.create(name[i], symbol[i], tokenReward, totalSupply);
        console.log("Mining transaction...");
        // Waiting for the transaction to be mined
        const receipt = await tx.wait();
        // The transaction is now on chain!
        console.log(`Mined in block ${receipt.blockNumber}`);
        // var contract = await contractFactory.methods.create(name[i], symbol[i], tokenReward, totalSupply)
        // await MakeTransaction(contract, addressFactory, list_key[i], account.address)
    }
}

async function MakeTransaction(contract, contractAddress, privatekey, publickey){
    try {
        const nonce = await web3.eth.getTransactionCount(publickey, "pending");
        const gasUser = await web3.eth.getGasPrice()
        const gasAdd = '200000';
        const options = {
            'to': contractAddress,
            'data': contract.encodeABI(),
            'gas': gasAdd,
            'gasPrice': gasUser,
            'nonce': nonce
        }; 
        const signed = await web3.eth.accounts.signTransaction(options, privatekey); 
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
        // console.log(receipt)
        if(receipt.status == false){
            await send_message("Network BSC: Make Transaction: false, from " + publickey)
        }
    } catch(err){
        await send_message("Insufficient funds BSC , from " + publickey)
        // console.log(err)
        console.log("Public Key " + publickey)
    }
}