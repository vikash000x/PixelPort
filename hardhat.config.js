
require('@nomiclabs/hardhat-waffle');

const privateKey =  'bf71626dfbf7d852fe69491bb340cb6136559ff1d018c1083365171097dbf90b' ;

const ALCHEMY_API_KEY_URL = 'https://eth-sepolia.g.alchemy.com/v2/fHSbv3bbFvYKePQqFNKBrCfxWLQsq8yQ';

module.exports = {
  // networks: {
  //   hardhat: {
  //     chainId: 1337,
  //   },
  // },
  solidity: '0.8.4',
  networks: {
    sepolia: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [privateKey],
    },
  },
};


///https://sepolia.infura.io/v3/accd63e6ed1742e7889f3e4617b245f3