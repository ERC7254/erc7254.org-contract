const { ethers , upgrades } = require("hardhat");
// const hne = require("hardhat");
const CONTRACTS =  require("./contract.json")
async function main(){
    const Mint = await ethers.getContractFactory("contracts/FactoryTokenRevenueSharing.sol:FactoryTokenRevenueSharing");
    // Deploy single contract
    // console.log(Mint)
    // var param = CONTRACTS["blast-sepolia"];
    // var name = param["name"]
    // var sys = param["symbol"]
    // var reward = param["weth"]
    const mint = await Mint.deploy()
    // console.log(mint) 
    await mint.deployed(); 
    //End Deploy single contract

    console.log("Mint deployed to: ",mint.address)
}

main()