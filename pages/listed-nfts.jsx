import { useState, useEffect, useContext } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { NFTContext } from "../context/NFTContext";
import { NFTCard } from "../components"; // Removed the unused Loader import

const ListedNFTs = () => {
  const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed").then((items) => {
      setNfts(items);
      setIsLoading(false);
    });
  }, [fetchMyNFTsOrListedNFTs]); // Added missing dependency

  console.log("heyyyli", nfts);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <ClipLoader
          color="#FF1493" // DeepPink color
          cssOverride={{
            display: "block",
            margin: "0 auto",
          }}
          size={250} // Larger size for visibility
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">
          No NFTs Listed for Sale
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">
            NFTs Listed for Sale
          </h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
