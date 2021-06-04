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

  const network = "testnet"

  const NFTL = await ethers.getContractFactory("TestERC20");
  const NFTLeague = await ethers.getContractFactory("NFTLeague");
  const AuctionContract = await ethers.getContractFactory(
    "CybertimeNFTAuction"
  );

  const owner = "0xa459C60D629d1857de858368B7960f35d7Ce1621";
  const team = "0xa459C60D629d1857de858368B7960f35d7Ce1621"

  // const nftl = await NFTL.deploy("testNFTL", "tNFTL", owner);
  const nftLeague = await NFTLeague.deploy();
  const auction = await AuctionContract.deploy(
    nftLeague.address,
    owner,
    team
  );

  await nftLeague.addAuction(auction.address);

  console.log("🎉 Contracts Deployed")
  console.log({
    // NFTL: nftl.address,
    auction: auction.address,
    nftLeague: nftLeague.address
  })

  console.log("💻 Commands to Verify Contracts")

  console.log({
    // NFTL: `npx hardhat verify --network ${network} ${nftl.address} "testNFTL" "tNFTL" ${owner}`,
    auction: `npx hardhat verify --network ${network} ${auction.address} "${nftLeague.address}" "${owner}" "${team}`,
    nftLeague: `npx hardhat verify --network ${network} ${nftLeague.address}`
  })
  
  // npx hardhat verify --network testnet 0xa4F56B3fe3F532D62De6E29e11436e9E230D0f62 "testNFTL" "tNFTL" "0x9876d5A1601D2E796e8Ed5151527609938070d9f"
  // npx hardhat verify --network testnet 0x1Ed12509dB9A0cE81e1dbE12430074BD85524EF8
  // npx hardhat verify --network testnet 0x14763Cbbf20c68C336169ac7F39cb2Fe5fbC55F4 "0x1Ed12509dB9A0cE81e1dbE12430074BD85524EF8" "0x9876d5A1601D2E796e8Ed5151527609938070d9f" "0x9876d5A1601D2E796e8Ed5151527609938070d9f"

  // const auctionContract = await AuctionContract.deploy(
  //   NFTL.address,
  //   "0x1BFb2b2D97FBD855a8EB2520Fd85547824634654"
  // );

  // const ipfsHash = "QmfWAN5ko19HQ8rNuoC6p43wm9Lp9YxcBxCZCHiJi54f1b"
  // const testNFT = await TestNFT.deploy(
  //   auctionContract.address,
  //   ipfsHash
  // );

  // await auctionContract.add(
  //     testNFT.address,
  //     "50",
  //     "100000000000000000000",
  //     "5000000000000000000",
  //     "5000000000000000000",
  //     "1616654363"
  // );

  // console.log("🎉 Contracts Deployed")
  // console.log({
  //   testNFTL: NFTL.address,
  //   testNFT: testNFT.address,
  //   auctionContract: auctionContract.address
  // })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
