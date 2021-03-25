// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
    const NFTLFarm = await ethers.getContractFactory("NFTLFarm");
 

    const devAddress = "0x9F8eD94408A90e8efa12D2450FC8061EFc3c161e"
    const teamRewardsReceiver = "0x7ee8B71f6af2Bd139EDc7Ca8CF9C651d3389E301"
    const nftlPerBlock = "42857142000000000000"
    const teamShare = "0"
    const startBlock = "5184333"
    const NFTLTokenAddress = "0x2f7b4C618Dc8E0bBA648E54cDADce3D8361f9816"

    const nftlToken = await ethers.getContractAt("NFTLToken", NFTLTokenAddress)
    
    const tokenAddress = ""

    const nftlFarm = await NFTLFarm.deploy(
        NFTLTokenAddress,
        devAddress,
        teamRewardsReceiver,
        nftlPerBlock,
        teamShare,
        startBlock,
        startBlock,
    )

    console.log("adding farming contract")
    await nftlToken.addFarmingContract(nftlFarm.address)

    console.log("🎉  Contracts Deployed")

    console.log({
        NFTLFarmAddress: nftlFarm.address,
    })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });