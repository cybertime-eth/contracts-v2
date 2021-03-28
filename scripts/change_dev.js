// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const {
    BigNumber,
    utils
  } = require("ethers");
  const {
    ethers
  } = require("hardhat");
  
  async function main() {
    const CTFFarm = await ethers.getContractAt("CybertimeNFTAuction", "0x57Bc258169b03047D7778c41014c9cF7779ACA76");
    const newDev = "0x7ee8B71f6af2Bd139EDc7Ca8CF9C651d3389E301"

    const changeDev = await CTFFarm.dev(newDev)

    console.log(changeDev)

    // await ctfFarm.dev()
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });