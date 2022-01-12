// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [addr1, addr2] = await hre.ethers.getSigners();


  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy();

  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);
  
  
  const message = await greeter.sendMessage(addr1.address, addr2.address, '43gy5v43kjh5v34u5v435ci43t5cjvhj657b567jhb', 0, new Date().toISOString())
  console.log("1221", message)
  const msg = await message.wait()
  
  const message1 = await greeter.sendMessage(addr1.address, addr2.address, '43gy5v43kjh5v34u5v435ci43t5cjvhj657b567jhb', 0, new Date().toISOString())
  const msg2 = await message1.wait()
  
  const event = msg.events?.find(event => event.event === 'MailEvent')
  const even1 = msg.events?.find(event => event.event === 'MessageEvent')
  
  console.log(event, even1, "dsasaddsa")

  console.log(await greeter.mails(0))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
