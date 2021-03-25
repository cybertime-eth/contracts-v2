// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  const AuctionContract = await ethers.getContractFactory(
    "CybertimeNFTAuction"
  );
  const TestERC20 = await ethers.getContractFactory("TestERC20");
  const TestNFT = await ethers.getContractFactory("TestNFT");


  const NFTL = await TestERC20.deploy(
    "testNFTL",
    "tNFTL",
    "0x1BFb2b2D97FBD855a8EB2520Fd85547824634654"
  );

  const auctionContract = await AuctionContract.deploy(
    NFTL.address,
    "0x1BFb2b2D97FBD855a8EB2520Fd85547824634654"
  );

  const ipfsHash = "QmfWAN5ko19HQ8rNuoC6p43wm9Lp9YxcBxCZCHiJi54f1b"
  const testNFT = await TestNFT.deploy(
    auctionContract.address,
    ipfsHash
  );

  await auctionContract.add(
      testNFT.address,
      "50",
      "100000000000000000000",
      "5000000000000000000",
      "5000000000000000000",
      "1616654363"
  );

  console.log("🎉 Contracts Deployed")
  console.log({
    testNFTL: NFTL.address,
    testNFT: testNFT.address,
    auctionContract: auctionContract.address
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
