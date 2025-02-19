/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

import { create as ipfsHttpClient } from "ipfs-http-client";

import { MarketAddress, MarketAddressABI } from "./constants";

const FormData = require("form-data");
require("dotenv").config();

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
export const NFTContext = React.createContext();
const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTProvider = ({ children }) => {
  const auth = useRef("");
  const client = useRef({});
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const nftCurrency = "ETH";

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No Accounts Found");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  // const uploadToIPFS = async (file) => {
  //   console.log("file", file);
  //   try {
  //     if (!file) {
  //       throw new Error("No file selected");
  //     }
  //     console.log("addidng file");

  //     const added = await client.current.add(file); // Uploading file to IPFS
  //     console.log("added", added);

  //     const url = `https://ipfs.io/ipfs/${added.path}`; // Constructing IPFS gateway URL

  //     console.log("File uploaded to IPFS:", url);
  //     return url;
  //   } catch (error) {
  //     console.error("Error uploading file to IPFS. Details:", error);
  //     return null;
  //   }
  // };

  const uploadToIPFS = async (file) => {
    try {
      if (!file) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("file", file);

      const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjODNkNmM4Zi02MWIxLTQ1NzUtYWQyOS1lMjM4N2I0Yjk1NmIiLCJlbWFpbCI6InZpa2FzaHNpbmhhMDQ1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhOGYwOTA0MzgyZDAwMGIxZmE2ZCIsInNjb3BlZEtleVNlY3JldCI6ImZkYTI5YTkwMTYyMjI1Y2NiYjI1YTAwMTY0NGM1NjBmOWQxYWM5YjgyZTAwNTNhNjcyN2Y5NWU3NDM0NWRiNWIiLCJleHAiOjE3NzE0NzgzOTF9.ACFnIDkWidVswxW_MxpXS6yFpSYJCbd-9tEiy4U0QU4";

      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxContentLength: Infinity,
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`, // Securely use JWT from .env
        //  ...formData.getHeaders(),
        },
      });

      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("✅ File uploaded to IPFS:", ipfsUrl);
      return ipfsUrl;
    } catch (error) {
      console.error("❌ Error uploading file to IPFS:", error.response?.data || error.message);
      return null;
    }
  };

  const fetchAuth = async () => {
    const response = await fetch("/api/secure");
    const data = await response.json();
    return data;
  };

  const getClient = (author) => {
    const responseClient = ipfsHttpClient({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      apiPath: "/api/v0",
      headers: {
        authorization: author,
      },
    });
    return responseClient;
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, "ether");
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();

    const transaction = !isReselling
      ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });

    setIsLoadingNFT(true);
    await transaction.wait();
  };

  const fetchNFTs = async () => {
    setIsLoadingNFT(false);

    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/fHSbv3bbFvYKePQqFNKBrCfxWLQsq8yQ");
    const contract = fetchContract(provider);

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), "ether");

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  // const createNFT = async (formInput, fileUrl, router) => {
  //   const { name, description, price } = formInput;

  //   if (!name || !description || !price || !fileUrl){ console.log("not present"); return;}
  //   console.log("name", name);
  //   console.log("description", description);
  //   console.log("price", price);
  //   console.log("fileUrl", fileUrl);

  //   const data = JSON.stringify({ name, description, image: fileUrl });
  //   const subdomain = 'https://gola-nft-marketplace.infura-ipfs.io';
  //   try {
  //     // console.log(data);
  //     const added = await client.current.add(file); // Uploading file to IPFS

  //     const url = `https://ipfs.io/ipfs/${added.path}`;
  //     await createSale(url, price, false, null);
  //     router.push('/');
  //   } catch (error) {
  //     console.error('Error uploading to file to IPFS. Details: ', error);
  //   }
  // };

  const convertToFile = async (fileString) => {
    try {
      const response = await fetch(fileString); // Fetch the file from the URL
      const blob = await response.blob(); // Convert response to Blob
      const filename = "nft-upload.png"; // Default filename (can be dynamic)

      return new File([blob], filename, { type: blob.type }); // Convert Blob to File
    } catch (error) {
      console.error("Error converting string to file:", error);
      return null;
    }
  };

  const createNFT = async (formInput, file, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !file) {
      console.log("Missing required fields");
      return;
    }

    console.log("Uploading file to IPFS via Pinata...");

    // Pinata API details
    const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjODNkNmM4Zi02MWIxLTQ1NzUtYWQyOS1lMjM4N2I0Yjk1NmIiLCJlbWFpbCI6InZpa2FzaHNpbmhhMDQ1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhOGYwOTA0MzgyZDAwMGIxZmE2ZCIsInNjb3BlZEtleVNlY3JldCI6ImZkYTI5YTkwMTYyMjI1Y2NiYjI1YTAwMTY0NGM1NjBmOWQxYWM5YjgyZTAwNTNhNjcyN2Y5NWU3NDM0NWRiNWIiLCJleHAiOjE3NzE0NzgzOTF9.ACFnIDkWidVswxW_MxpXS6yFpSYJCbd-9tEiy4U0QU4";

    const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    try {
      console.log("tryieng");
      const fileob = await convertToFile(file); // ✅ Convert string to File

      if (!fileob) {
        console.error("Failed to convert file string to File object.");
        return;
      }

      // ✅ Ensure the file is valid
      if (!(fileob instanceof File)) {
        console.error("Invalid file type", typeof fileob);
        return;
      }

      const formData = new FormData();
      formData.append("file", fileob, fileob.name); // ✅ Ensure correct file format
      console.log("Uploading:", fileob);

      const fileUploadResponse = await axios.post(PINATA_URL, formData, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("after aploading file", fileUploadResponse);

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${fileUploadResponse.data.IpfsHash}`;
      console.log("File uploaded to IPFS:", fileUrl);

      // Upload Metadata (JSON) to IPFS via Pinata
      const metadata = {
        name,
        description,
        image: fileUrl,
      };

      const metadataResponse = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      });

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
      console.log("Metadata uploaded to IPFS:", metadataUrl);

      // Call createSale function with metadata URL
      await createSale(metadataUrl, price, false, null);

      // Redirect to homepage
      router.push("/");
    } catch (error) {
      console.error("Error uploading file to IPFS via Pinata:", error);
    }
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });

    setIsLoadingNFT(true);
    await transaction.wait();
    setIsLoadingNFT(false);
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    setIsLoadingNFT(false);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === "fetchItemsListed"
      ? await contract.fetchItemsListed()
      : await contract.fetchMyNFTs();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), "ether");

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  useEffect(async () => {
    checkIfWalletIsConnected();
    const { data } = await fetchAuth();
    auth.current = data;
    client.current = getClient(auth.current);
  }, []);

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs, buyNFT, createSale, isLoadingNFT }}>
      {children}
    </NFTContext.Provider>
  );
};
