// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  // Step 0: Make sure you've NFTL deployd already
  // Step 1: Deploy NFTLeague
  // Step 2: Deploy Auction
  // Step 3: Add auction address to NFTLeague
  // Step 4: Add auction

  const TestNFTL = await ethers.getContractFactory("TestERC20");
  const NFTL = await ethers.getContractFactory("NFTLToken")

  const owner = "0xB8D3F150b949449BC5D850583F81fd6D22065059";

  const testNFTL = await TestNFTL.deploy("testNFTL", "tNFTL", owner);

  const nftl = await NFTL.deploy(
      owner,
      owner,
      "1000000000000000000",
      testNFTL.address,
  )


  console.log("🎉 Contracts Deployed")
  console.log({
    testNFTL: testNFTL.address,
    NFTL: nftl.address,
  })


//   const nftLeague = await NFTLeague.deploy();
//   const auction = await AuctionContract.deploy(
//     nftLeague.address,
//     owner,
//     team
//   );

//   await nftLeague.addAuction(auction.address);

//   console.log("🎉 Contracts Deployed")
//   console.log({
//     NFTL: nftl.address,
//     auction: auction.address,
//     nftLeague: nftLeague.address
//   })
  
  // npx hardhat verify --network testnet 0x19D9D5F4138e47F9e2Aa7c87C79236A5682ee14C "testNFTL" "tNFTL" "0xB8D3F150b949449BC5D850583F81fd6D22065059"
  // npx hardhat verify --network testnet 0xFe0b070321f47262D0f9e31505eC30C51f3C5250 "0xB8D3F150b949449BC5D850583F81fd6D22065059" "0xB8D3F150b949449BC5D850583F81fd6D22065059" "1000000000000000000" "0x19D9D5F4138e47F9e2Aa7c87C79236A5682ee14C"
  // npx hardhat verify --network testnet 0x14763Cbbf20c68C336169ac7F39cb2Fe5fbC55F4 "0x1Ed12509dB9A0cE81e1dbE12430074BD85524EF8" "0x9876d5A1601D2E796e8Ed5151527609938070d9f" "0x9876d5A1601D2E796e8Ed5151527609938070d9f"
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
