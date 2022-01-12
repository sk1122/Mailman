const ethers = require("ethers")

const pk =
 "0x0471c746523d16e93d4738f882d9b0beebf66c68caa0f895db15686b57b878cfc7b3e09813ba94f1bbfaa91a06566d3d18bbf69d10bcc947325bbcd6fea97ed692"
const ad = "0x4e7f624c9f2dbc3bcf97d03e765142dd46fe1c46"

getPubKey = async () => {
 const infuraProvider = new ethers.providers.JsonRpcProvider(
  "https://eth-rinkeby.alchemyapi.io/v2/lzcVm2ORixzPCjkWxrsSSl3UcL2Eacdy"
 )
 const tx = await infuraProvider.getTransaction(
  "0x897633586395b285deaf1e151e0ce35fef046fe4b1d6be673c1a09bf7575fed4"
 )

 console.log(tx)
 const expandedSig = {
  r: tx.r,
  s: tx.s,
  v: tx.v
 }
 const signature = ethers.utils.joinSignature(expandedSig)
 const txData = {
  gasPrice: tx.gasPrice,
  gasLimit: tx.gasLimit,
  value: tx.value,
  nonce: tx.nonce,
  data: tx.data,
  chainId: tx.chainId,
  to: tx.to
 }
 const rsTx = await ethers.utils.resolveProperties(txData)
 console.log("\n")
 console.log("\n")
 console.log(rsTx)
 console.log("\n")
 console.log("\n")
 const raw = ethers.utils.serializeTransaction(rsTx) // returns RLP encoded tx
 console.log(raw)
 console.log("\n")
 console.log("\n")
 const msgHash = ethers.utils.keccak256(raw) // as specified by ECDSA
 console.log(msgHash)
 console.log("\n")
 console.log("\n")
 const msgBytes = ethers.utils.arrayify(msgHash) // create binary hash
 console.log(msgBytes)
 console.log("\n")
 console.log("\n")
 const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature)
 const recoveredAddress = ethers.utils.recoverAddress(msgBytes, signature)
 console.log(recoveredAddress)
 console.log(recoveredPubKey)
 console.log("Correct public key:", recoveredPubKey === pk)
 console.log("Correct address:", recoveredAddress === ad)
}

getPubKey()