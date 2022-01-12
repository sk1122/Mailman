import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import { bufferToHex } from 'ethereumjs-util'
import { encrypt } from '@metamask/eth-sig-util'

import abi from '../interfaces/contract.json'

const CONTRACT_ADDRESS = '0xd5F6fE836132322B4f726D2AEfCd9EEfd47C103E'

export default function Home() {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  
  const [account, setAccount] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [encrypted, setEncrypted] = useState('')

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

    return encryptionPublicKey
  }

  // @dev: Encrypt the Message with Public Key
  const encryptMessage = async (publicKey, message) => {
    console.log(publicKey)
    const encryptedMessage = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt(
            {
              publicKey: publicKey,
              data: 'Hello world!',
              version: 'x25519-xsalsa20-poly1305'
            }
          )
        ),
        'utf8'
      )
    );

    return encryptedMessage
  }

  // @dev: Decrypt the Message with Public Key
  const decryptMessage = async (encryptedMessage) => {
    let decryptedMessage = await ethereum.request({
        method: 'eth_decrypt',
        params: [encryptedMessage, account],
    })

    return decryptedMessage
  }

  // @dev: Fetch Data from Graph Protocol
  const fetchData = () => {

  }

  // @dev: Send Message to Contract
  const sendMessage = () => {

  }
  
  return (
    <div>
      <button onClick={() => login()}>Connect Metamask</button>
      <button onClick={() => signn()}>Sign</button>
      <button onClick={() => decryptt()}>Decrypt</button>
    </div>
  )
}