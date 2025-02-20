import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

import ClipLoader from "react-spinners/ClipLoader";

import { NFTContext } from "../context/NFTContext";
import { Button, Input } from "../components"; // Removed unused Loader import

const ResellNFT = () => {
  const { createSale, isLoadingNFT } = useContext(NFTContext);
  const router = useRouter();
  const { tokenId, tokenURI } = router.query;
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const fetchNFT = async () => {
    if (!tokenURI) return;

    const { data } = await axios.get(tokenURI);

    setPrice(data.price);
    setImage(data.image);
  };

  useEffect(() => {
    if (tokenURI) fetchNFT();
  }, [tokenURI, fetchNFT]); // Added fetchNFT as a dependency

  const resell = async () => {
    await createSale(tokenURI, price, true, tokenId);
    router.push("/");
  };

  if (isLoadingNFT) {
    return (
      <div className="flexStart min-h-screen">
        <ClipLoader
          color="#FF1493" // DeepPink color
          cssOverride={{
            display: "block",
            margin: "0 auto",
          }}
          size={250} // Larger size for better visibility
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="font-poppins dark:text-white text-nft-black font-semibold text-2xl">
          Resell NFT
        </h1>
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) => setPrice(e.target.value)}
        />
        {image && <Image src={image} className="rounded mt-4" width={350} />}
        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="List NFT"
            classStyles="rounded-xl"
            handleClick={resell}
          />
        </div>
      </div>
    </div>
  );
};

export default ResellNFT;
