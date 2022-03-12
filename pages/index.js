import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Nav from './components/nav'
import Button from './components/button'
import Web3Modal from "web3modal"
import { providers, Contract } from 'ethers'
import { useRef, useState, useEffect } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'

export default function Home() {
  console.log(Web3Modal.onClose)
    const [ walletConnected, setWalletConnected ] = useState(false)
    const [ Signer,setSigner ] = useState()
    const [ sliderIndex, setSliderIndex ] = useState(0)
    
    const web3ModalRef = useRef()
    console.log(web3ModalRef.current)

    // getting signer or provider

    const getProviderOrSigner = async (needSigner = false) => {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      console.log( 2, web3Provider)
      const { chainId } = await web3Provider.getNetwork()
      if (chainId !== 4) {
        window.alert("Change the network to Rinkeby");
        throw new Error("Change the network to Rinkeby")
      }

      
      const signer = web3Provider.getSigner()
      console.log(1 ,signer.getAddress())
      setSigner(await signer.getAddress());
      
      return web3Provider;
    }
    const providerOptions = {
      walletconnect: WalletConnectProvider
    }
    // connecting wallet
    const connectWallet = async () => {
      try {
        web3ModalRef.current = new Web3Modal({
          network: "rinkeby",
          providerOptions,
          disableInjectedProvider: false,
        });
        await getProviderOrSigner();
        setWalletConnected(true);
      } catch (err) {
        console.error(err)
      }
    }

    // useEffecting those functions
    useEffect(() => {
      if (!walletConnected) {
        connectWallet();
      }
    },[])

    const shortenHash = (hash = '', charLength = 6, postCharLength) => {
      let shortendHash;
      if (postCharLength) {
        shortendHash =
          hash.slice(0, charLength) +
          '...' +
          hash.slice(hash.length - postCharLength, hash.length);
      } else {
        shortendHash = hash.slice(0, charLength);
      }
      return shortendHash;
    };

    const logout = async () => {
      await web3ModalRef.current.clearCachedProvider()
      setWalletConnected(false)
      console.log(2,web3ModalRef)
    }
    
    const wallet = () => {
      if (!walletConnected) {
        return(<Button onClick={connectWallet} text="Connect Wallet" />)
      } else {
        return(<Button onClick={logout} text={shortenHash(Signer,5,5)} />)
      }
    }

  return (
    <div>
      <Nav>
        {
        !walletConnected ?
          (<Button className={styles.btn} onClick={connectWallet} text="Connect Wallet" />)
        :
          (<Button className={styles.hashbtn} onClick={logout} text={shortenHash(Signer,5,5)} />)
        
        }
      </Nav>
      <div className={styles.container}>

        <div style={{
          width: "60%"
        }}>

          <h1 style={{
            textAlign: "center",
            fontSize: "48px"
          }}>Traveler's Quest</h1>
          <p>Aliquip elit ad aute ad officia dolore eiusmod sint laboris sint. Ipsum nisi et anim cupidatat sint commodo incididunt. Magna aute aute sunt exercitation culpa voluptate ex incididunt. Ex aliquip magna quis nisi aliquip proident. Amet est ut officia officia qui veniam est culpa nulla anim.</p>
          
        </div>
      </div>
    </div>
  )
}