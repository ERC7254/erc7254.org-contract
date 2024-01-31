// 1 mint
// 2 update reward
// 3 getReward
// case1: token
// case2: eth

require('dotenv').config({ path: '../.env'});
const CONTRACTS = require("../scripts/contract.json")

const ethers = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(CONTRACTS["blast-sepolia"]["rpc"]); 

const abiToken = require("../artifacts/contracts/TokenRevenueSharing.sol/TokenRevenueSharing.json")
// block 786266: 0xcDed97AbBEe90194449CeC3E8Fb8cC1aCa5a2051
// block 786273: 0x8e8EDe548DE537659A823c199164C084BD060Aa8
const addressToken = '0xad570652B9B3cdd8BA598D0F4Bf9632b45b6839f' // token reward: 0xd2A96305296D9A01D6039662B300706b46bDEE3c
const contractToken = new ethers.Contract(addressToken, abiToken.abi, provider)


// wallet1: 0x34fddb808cbeed2cc91d340a826979ca2801b938ced1741427529ec89cde3fce 0x0659e243360baE10eD1717E6D0e51fE1CDF4D98d
// wallet2: 0xbb13c0467f51b9f6bdbdcb4bcab61cb2eda56d184a2daf514255f8430517bba5 0xC5AeEE2B6626AC0Fa781d97dF7C16a58aDd16b58
// wallet3: 0x7bfa0cfb590e6086561de701eae1c6dae17a2bfc74569c63d9229652505056b6 0x91478893C85f3F8ffa9Ee34a25AC5a7eABa53862

const PRIVATE_KEY = process.env.ADMIN //process.env.ADMIN
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
var contractSigner = contractToken.connect(wallet)

var listAddress = [
    '0x6AF2F94290e07014Ab0BC21C4F7c971f1CE539Be',
    '0x0659e243360baE10eD1717E6D0e51fE1CDF4D98d',
    '0xC5AeEE2B6626AC0Fa781d97dF7C16a58aDd16b58',
    '0x91478893C85f3F8ffa9Ee34a25AC5a7eABa53862'
]

var listPriveKey = [
    '0x25698b56f8aff68ee5e87c1b2d46214e57d4569ec8c0e0f786acec76e5787e78',
    '0x34fddb808cbeed2cc91d340a826979ca2801b938ced1741427529ec89cde3fce',
    '0xbb13c0467f51b9f6bdbdcb4bcab61cb2eda56d184a2daf514255f8430517bba5',
    '0x7bfa0cfb590e6086561de701eae1c6dae17a2bfc74569c63d9229652505056b6'
]

var amount = [
    '324736765767382',
    '273824763763746',
    '328738378473',
    '32733767467347'
]

run()
async function run(){
    // await mint()
    // await getBalance()
    // await getOwner()

    // await approve()

    // await updatereward()
    // await viewReward()
    await getReward()
    // await getCheck()
}

async function approve(){
    var tokenreward = '0xd2A96305296D9A01D6039662B300706b46bDEE3c'
    const contractApprove = new ethers.Contract(tokenreward, abiToken.abi, provider)
    var contractSignerApprove = contractApprove.connect(wallet)
    var tx = await contractSignerApprove.approve(addressToken, '328378993889438498348938944394')
    await tx.wait()
}

async function getOwner(){
    var result = await contractToken.owner()
    console.log(result)
}
async function getReward(){
    for(var i = 1 ; i < 4; i++){
        const prive = listPriveKey[i]
        const walletlist = new ethers.Wallet(prive, provider)
        var contractSignerList = contractToken.connect(walletlist)
        var weth = CONTRACTS["blast-sepolia"]["weth"]
        var tx = await contractSignerList.getReward([weth], wallet.address)
        const receipt = await tx.wait()
        console.log(receipt.blockNumber)
    }
}

async function viewReward(){
    console.log("View Reward")
    for(var i = 0 ; i < listAddress.length; i++){
        var result = await contractToken.viewReward(listAddress[i])
        console.log("Wallet " + listAddress[i] + " balance " + result.toString())
    }
}

async function updatereward(){
    // var weth = CONTRACTS["blast-sepolia"]["weth"]
    var tokenReward = '0xd2A96305296D9A01D6039662B300706b46bDEE3c'
    console.log(wallet.address)
    // var tx = await contractSigner.updateReward([tokenReward],[0], { value: ethers.utils.parseEther("0.002") });
    var tx = await contractSigner.updateReward([tokenReward], [ethers.utils.parseEther("20")])
    // tx.value = '10000000000000000'
    const receipt = await tx.wait();
    console.log(receipt.blockNumber)
}

async function getBalance(){
    for(var i = 0; i < listAddress.length; i++){
        var result = await contractToken.balanceOf(listAddress[i])
        console.log("Address " + listAddress[i] + " balance "  + result.toString())
    }
}

async function mint(){
    // console.log(wallet.address)
    for(var i = 0 ; i < listAddress.length; i++){
        const prive = listPriveKey[i]
        const walletlist = new ethers.Wallet(prive, provider)
        var contractSignerList = contractToken.connect(walletlist)
        var tx = await contractSignerList.mint(walletlist.address, amount[i])
        const receipt = await tx.wait();
        console.log(receipt)
    }
}