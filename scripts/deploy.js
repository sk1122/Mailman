// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

let abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "messageHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "timestamp",
        "type": "string"
      }
    ],
    "name": "MessageEvent",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      }
    ],
    "name": "getPublicKey",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "mails",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_messageHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_timestamp",
        "type": "string"
      }
    ],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "pubKey",
        "type": "string"
      }
    ],
    "name": "setPublicKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const contractAddress = '0x7c3CFa1E94d258F44A70Cf5df6747d42Cf63007B'

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // const [addr1, addr2] = await hre.ethers.getSigners();
  const [addr1, addr2] = ['0xF3A5D2ae4BfCb6784d14944f987D1FeC83ffA886', '0x4e7f624C9f2dbc3bcf97D03E765142Dd46fe1C46']

  // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy();
  const wallet = new ethers.Wallet('0deeb28bb0125df571c3817760ded64965ed18374ac8e9b3637ebc3c4401fa3d', hre.ethers.provider);
  const signer = wallet.connect(hre.ethers.provider);
  let greeter = new hre.ethers.Contract(contractAddress, abi, signer);
  console.log(greeter)

  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);
  
  // greeter = greeter.connect(signer)
  console.log("1")
  const message = await greeter.sendMessage(addr1, addr2, '43gy5v43kjh5v34u5v435ci43t5cjvhj657b567jhb', 0, new Date().toISOString())
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
