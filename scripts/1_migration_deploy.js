// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber, utils } = require("ethers");
const { ethers } = require("hardhat");

async function main() {
  // Step 0: Deploy CTF
  // Step 1: Deploy NFTL
  // Step 2: Add farming Contract to NFTL
  // Step 3 Add farming contract to CTF

  // CheckList:
  // 0. Use new private key
  // 1. Use new NFTL

  const CTF = await ethers.getContractFactory("CyberTimeFinanceToken");
  const NFTL = await ethers.getContractFactory("NFTLToken");
  const CTFFarming = await ethers.getContractFactory("CTFFarm");
  const NFTLFarming = await ethers.getContractFactory("NFTLFarm");

  const network = "mainnet";
  const constructor = {
    ctfToken: {
      owner: "0xae81CEd679690051392AF955E0Fe9b94452563D5", // updated
      initialReceiver: "0xae81CEd679690051392AF955E0Fe9b94452563D5", //updated
      initialMintAmount: "0", // updated
      oldCTFAddress: "0x299baC24C8ad5635586fDe6619efF7891a6c8969", //updated
    },
    nftlToken: {
      owner: "0xae81CEd679690051392AF955E0Fe9b94452563D5", // updated
      initialReceiver: "0xae81CEd679690051392AF955E0Fe9b94452563D5", // updated
      initialMintAmount: "0", //updated
      oldNFTLAddress: "0x2f7b4C618Dc8E0bBA648E54cDADce3D8361f9816", //updated
    },
  };

  const ctf = await CTF.deploy(
    constructor.ctfToken.owner,
    constructor.ctfToken.initialReceiver,
    constructor.ctfToken.initialMintAmount,
    constructor.ctfToken.oldCTFAddress
  );

  const nftl = await NFTL.deploy(
    constructor.nftlToken.owner,
    constructor.nftlToken.initialReceiver,
    constructor.nftlToken.initialMintAmount,
    constructor.nftlToken.oldNFTLAddress
  );

  const farmingConstructor = {
    ctf: {
      tokenAddress: ctf.address,
      devAddress: "0xb77549FD4D20b6FCeeA883ecE79b5e593dcca37D", // updated
      lpFeeReceiver: "0x43C66F79d1aF337ac72d35e24Bb57292ba139384", // updated
      ctfPerBlock: "16111100000000000", // updated
      startBlock: "6457236",
      bonusEndBlock: "6457236",
    },
    nftl: {
      tokenAddress: nftl.address,
      devAddress: "0xb77549FD4D20b6FCeeA883ecE79b5e593dcca37D", // updated
      teamRewardReceiver: "0x7ee8B71f6af2Bd139EDc7Ca8CF9C651d3389E301", //updated
      nftlPerBlock: "21428571430000000000", //updated
      teamShare: "0", // updated
      startBlock: "6457236", //updated
      bonusEndBlock: "6457236", // updated
    },
  };

  const ctfFarm = await CTFFarming.deploy(
    farmingConstructor.ctf.tokenAddress,
    farmingConstructor.ctf.devAddress,
    farmingConstructor.ctf.lpFeeReceiver,
    farmingConstructor.ctf.ctfPerBlock,
    farmingConstructor.ctf.startBlock,
    farmingConstructor.ctf.bonusEndBlock
  );

  const nftlFarm = await NFTLFarming.deploy(
    farmingConstructor.nftl.tokenAddress,
    farmingConstructor.nftl.devAddress,
    farmingConstructor.nftl.teamRewardReceiver,
    farmingConstructor.nftl.nftlPerBlock,
    farmingConstructor.nftl.teamShare,
    farmingConstructor.nftl.startBlock,
    farmingConstructor.nftl.bonusEndBlock
  );

  console.log("🎉 Contracts Deployed");
  console.log({
    CTFToken: ctf.address,
    NFTLToken: nftl.address,
    CTFFarming: ctfFarm.address,
    NFTLFarming: nftlFarm.address,
  });

  await ctf.addFarmingContract(ctfFarm.address);
  console.log("✅ CTF Farming Contract Added");

  await nftl.addFarmingContract(nftlFarm.address);
  console.log("✅ NFTL Farming Contract Added");

  // contract verification commands
  console.log("💻 Verification Commands");
  console.log({
    CTFToken: `npx hardhat verify --network ${network} ${ctf.address} "${constructor.ctfToken.owner}" "${constructor.ctfToken.initialReceiver}" "${constructor.ctfToken.initialMintAmount}" "${constructor.ctfToken.oldCTFAddress}"`,
    NFTLToken: `npx hardhat verify --network ${network} ${nftl.address} "${constructor.nftlToken.owner}" "${constructor.nftlToken.initialReceiver}" "${constructor.nftlToken.initialMintAmount}" "${constructor.nftlToken.oldNFTLAddress}"`,
    CTFFarming: `npx hardhat verify --network ${network} ${ctfFarm.address} "${farmingConstructor.ctf.tokenAddress}" "${farmingConstructor.ctf.devAddress}" "${farmingConstructor.ctf.lpFeeReceiver}" "${farmingConstructor.ctf.ctfPerBlock}" "${farmingConstructor.ctf.startBlock}" "${farmingConstructor.ctf.bonusEndBlock}"`,
    NFTLFarming: `npx hardhat verify --network ${network} ${nftlFarm.address} "${farmingConstructor.nftl.tokenAddress}" "${farmingConstructor.nftl.devAddress}" "${farmingConstructor.nftl.teamRewardReceiver}" "${farmingConstructor.nftl.nftlPerBlock}" "${farmingConstructor.nftl.teamShare}" "${farmingConstructor.nftl.startBlock}" "${farmingConstructor.nftl.bonusEndBlock}"`,
  });

  //   const NFTL = await ethers.getContractFactory("TestERC20");
  //   const NFTLeague = await ethers.getContractFactory("NFTLeague");
  //   const AuctionContract = await ethers.getContractFactory(
  //     "CybertimeNFTAuction"
  //   );

  //   const owner = "0x9876d5A1601D2E796e8Ed5151527609938070d9f";
  //   const team = "0x9876d5A1601D2E796e8Ed5151527609938070d9f"

  //   const nftl = await NFTL.deploy("testNFTL", "tNFTL", owner);
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
