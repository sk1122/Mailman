import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import { bufferToHex } from 'ethereumjs-util'
import { encrypt } from '@metamask/eth-sig-util'
import { ethers } from 'ethers'

import abi from '../interfaces/contract.json'

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export default function Home() {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  
  const [account, setAccount] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [encrypted, setEncrypted] = useState('')
  const [message, setMessage] = useState('')

  var provider, signer, contract;

  const connectContract = () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer)
  }

  const checkWalletConnected = async () => {
		try {
			const { ethereum } = window
			
			if(!ethereum) {
				console.log('Install Metamask')
				return
			}
	
			const accounts = await ethereum.request({ method: 'eth_accounts' })
	
			if(accounts.length !== 0) {
				const account = accounts[0]
				console.log("Found Account, ", account)
				setAccount(account)
				setIsAuthenticated(true)
			} else {
				console.log("Create a Ethereum Account")
			}
		} catch (e) {
			console.log(e)
		}
	}

	const login = async () => {
		try {
			const { ethereum } = window
		
			if(!ethereum) {
				console.log("Install Metamask")
				return
			}
		
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
			
			console.log("Connected, ", accounts[0])
			setAccount(accounts[0])
			setIsAuthenticated(true)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
    checkWalletConnected()
  }, [])

  useEffect(() => {
    console.log(account, isAuthenticated)
  }, [account, isAuthenticated])


  // @dev: Sign Transaction for first time for getting Public Key
  const signTransaction = async () => {
    console.log(account)
    let encryptionPublicKey = await ethereum
      .request({
        method: 'eth_getEncryptionPublicKey',
        params: [account],
      })

    setEncrypted(encryptionPublicKey)

    return encryptionPublicKey
  }

  // @dev: Encrypt the Message with Public Key
  const encryptMessage = async () => {
    console.log(encrypted)
    const encryptedMessage = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt(
            {
              publicKey: encrypted,
              data: 'Hello world!',
              version: 'x25519-xsalsa20-poly1305'
            }
          )
        ),
        'utf8'
      )
    );

    setMessage(encryptedMessage)

    return encryptedMessage
  }

  // @dev: Decrypt the Message with Public Key
  const decryptMessage = async (encryptedMessage) => {
    let decryptedMessage = await ethereum.request({
        method: 'eth_decrypt',
        params: [message, account],
    })
    console.log(decryptedMessage)
    return decryptedMessage
  }

  // @dev: Fetch Data from Graph Protocol
  const fetchData = async () => {
    connectContract()

    // let message = await contract.sendMessage('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', '43gy5v43kjh5v34u5v435ci43t5cjvhj657b567jhb', 0, new Date().toISOString())
    // message = await contract.sendMessage('0x70997970c51812dc3a010c7d01b50e0d17dc79c8', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', '43gy5v43kjh5v34u5v435ci43t5cjvhj657b567jhb', 0, new Date().toISOString())
    // message = await message.wait()

    let messages = await contract.allMails(0)

    console.log(messages)
  }

  // @dev: Send Message to Contract
  const sendMessage = () => {
    connectContract()
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  return (
    <div>
      <button onClick={() => login()}>Connect Metamask</button>
      <button onClick={() => signTransaction()}>Sign</button>
      <button onClick={() => encryptMessage()}>Encrypt</button>
      <button onClick={() => decryptMessage()}>Decrypt</button>
    </div>
  )
}