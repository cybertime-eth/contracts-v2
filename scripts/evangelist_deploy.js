// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  const CyberTimeEvangelist = await ethers.getContractFactory(
    "CyberTimeEvangelist"
  );

  // metadata
  const legendary =
    "https://ipfs.io/ipfs/QmR4mPgKucBDi3pyChVLgU3mWKxVAzNNYx7tFkEGyZ8RD3";
  const epic =
    "https://ipfs.io/ipfs/QmVyuCVXFQW6gcTy8oRAAtENv7hTuf7h2KRmiGBkL86szH";
  const rare =
    "https://ipfs.io/ipfs/Qmf2DSvm516odESDDFEzgVYjm57sGMXe8iwtTG8mzZ9564";
  const dev = "0xE26953DA6DD88E8Bb7778549d73fd06f9A4AB189";

  const evangelistContract = await CyberTimeEvangelist.deploy(
    dev
  );

  console.log("🎉 Contract Deployed", evangelistContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // npx 
