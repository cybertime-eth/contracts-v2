// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
    const CTFToken = await ethers.getContractFactory("CyberTimeFinanceToken")
    const NFTLToken = await ethers.getContractFactory("NFTLToken")

    const owner = "0x9F8eD94408A90e8efa12D2450FC8061EFc3c161e"

    const ctfToken = await CTFToken.deploy(owner, "0xc3B2eA9B0A0BF3885e74c225DA37dE9C7d4941Ae", "1000000000000000000")
    
    const nftlToken = await NFTLToken.deploy(owner, "0xc3B2eA9B0A0BF3885e74c225DA37dE9C7d4941Ae", "1000000000000000000")

    console.log("🎉 Contracts Deployed")

    console.log({
        ctfToken: ctfToken.address,
        nftlToken: nftlToken.address,
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

  