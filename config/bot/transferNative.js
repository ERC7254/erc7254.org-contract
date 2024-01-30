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

const Web3 = require('web3');
const web3 = new Web3('https://rpc.ankr.com/blast_testnet_sepolia');
const value = '100000000000000000'
var account = web3.eth.accounts.privateKeyToAccount(process.env.ADMIN)

// transferNative()
async function transferNative(){
    for(var i = 0; i< list_key.length; i++){
        console.log(i)      
        var to = web3.eth.accounts.privateKeyToAccount(list_key[i]) 
        await MakeValue(process.env.ADMIN, account.address, to.address, value) 
    }
}

async function MakeValue(privatekey, publickey, to, value){
    try {
        const nonce = await web3.eth.getTransactionCount(publickey, "pending");
        const gasUser = await web3.eth.getGasPrice()
        const gasAdd = '80000';
        const options = {
            'to': to,
            'gas': gasAdd,
            'gasPrice': gasUser,
            'value': value,
            'nonce': nonce
        }; 
        const signed = await web3.eth.accounts.signTransaction(options, privatekey); 
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
        console.log(receipt.status)
    } catch(err){
        console.log(err)
        console.log("Public Key " + publickey)
    }
}