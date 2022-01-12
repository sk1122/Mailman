const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Mail Contract", function () {
  let Mail, mail, a1, a2, a3


  beforeEach(async function () {
    Mail = await hre.ethers.getContractFactory("Greeter");
    mail = await Mail.deploy();  
    [a1, a2, a3] = await ethers.getSigners()
  })

  it("deploys", async function () {
    const Mail = await ethers.getContractFactory("Greeter");
    const mail = await Mail.deploy();
    await mail.deployed();
  });

  it("create mail first time", async function () {
    const message = await mail.sendMessage(a1.address, a2.address, '43gy5v43kjh5v34u5v435ci43t5cjvhj657b567jhb', 0, new Date().toISOString())
    assert.equal(typeof(message) == 'object', true)
  })
  
});
