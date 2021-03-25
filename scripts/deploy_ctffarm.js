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
  const CTFFarm = await ethers.getContractFactory("CTFFarm");

  const CTFTokenAddress = "0x299baC24C8ad5635586fDe6619efF7891a6c8969"
  const devAddress = "0x9F8eD94408A90e8efa12D2450FC8061EFc3c161e"
  const lpFeeReceiver = "0x43C66F79d1aF337ac72d35e24Bb57292ba139384"
  const ctfPerBlock = "4215625000000000" // total number of CTF per block
  const startBlock = "5184333" // the block at which farming should start


  const ctfToken = await ethers.getContractAt("CyberTimeFinanceToken", CTFTokenAddress)

  const ctfFarm = await CTFFarm.deploy(
    CTFTokenAddress,
    devAddress,
    lpFeeReceiver,
    ctfPerBlock,
    startBlock,
    startBlock,
  )

  await ctfToken.addFarmingContract(ctfFarm.address)

  console.log("🎉  Contracts Deployed")
  console.log({
    CTFFarmAddress: ctfFarm.address,
  })

  console.log("Adding Pools")

  const pools = {
    CTFPool: {
      allocPoint: "200",
      lpToken: "0x4709932b8a9a76187879856e8fd13eadc6c68b08",
      withUpdate: false,
    },
    NFTLPool: {
      allocPoint: "800",
      lpToken: "0xab5f212d945c6109be17a61a5598e2dd6f896bdf",
      withUpdate: false,
    }
  }

  await CTFFarm.add(pools.CTFPool.allocPoint, pools.CTFPool.allocPoint.lpToken, pools.CTFPool.withUpdate)
  await CTFFarm.add(pools.NFTLPool.allocPoint, pools.NFTLPool.allocPoint.lpToken, pools.NFTLPool.withUpdate)

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