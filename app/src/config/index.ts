import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export enum ChainId {
  ETHEREUM = 1,
  // RINKEBY = 4,
  GOERLI = 5,
  BSC = 56,
  BSC_TESTNET = 97,
  opBNB = 204,
  ARB_TESTNET = 421613,
  ARB = 42161,
  ZKSYNC = 324,
  ZKSYNC_TESTNET = 280,
}

export const BSC_BLOCK_TIME = 3

export const NETWORK_CONFIG = {
  [ChainId.GOERLI]: {
    name: 'Goerli',
    network: 'Goerli',
    scanURL: 'https://goerli.etherscan.io',
    rpcUrls: ['https://goerli.infura.io/v3/'],
    scan: 'ETHScan',
    decimals: 18,
    tokenName: 'ETH',
    symbol: 'ETH',
    multicall: {
      address: '0xd8855b79656E023F1D14E3697aBF1222d61ddD5d',
      blockCreated: 9105236,
    },
    testnet: true,
  },

  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    network: 'ether',
    scanURL: 'https://etherscan.io',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    scan: 'ETHScan',
    decimals: 18,
    tokenName: 'ETH',
    symbol: 'ETH',
    multicall: {
      address: '0xd8855b79656E023F1D14E3697aBF1222d61ddD5d',
      blockCreated: 9105236,
    },
    testnet: false,
  },

  [ChainId.BSC]: {
    name: 'BNB Smart Chain',
    network: 'bsc',
    scanURL: 'https://bscscan.com',
    rpcUrls: [
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed.binance.org',
    ],
    scan: 'BSCScan',
    tokenName: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    multicall: {
      address: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
      blockCreated: 7162653,
    },
    testnet: false,
  },
  [ChainId.BSC_TESTNET]: {
    name: 'BNB Smart Chain Testnet',
    network: 'bsc-testnet',
    scanURL: 'https://testnet.bscscan.com',
    rpcUrls: [
      'https://bsc-testnet.publicnode.com',
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545'
    ],
    scan: 'BSCTestScan',
    tokenName: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    blockExplorers: {
      default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
    },
    multicall: {
      address: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
      blockCreated: 9759845,
    },
    testnet: true,
  },
  [ChainId.opBNB]: {
    name: 'opBNB Mainnet',
    network: 'opBNB-Mainnet',
    scanURL: 'https://mainnet.opbnbscan.com/',
    rpcUrls: [
      'https://opbnb-mainnet-rpc.bnbchain.org'
    ],
    scan: 'opbnbscan',
    tokenName: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    blockExplorers: {
      default: { name: 'opbnbscan', url: 'https://mainnet.opbnbscan.com/' },
    },
    multicall: {
      address: '0x9C63ADb6C88F33317e7405c7a0c1c15cC752f093',
      blockCreated: 9759845,
    },
    testnet: true,
  },
  [ChainId.ARB_TESTNET]: {
    name: 'ARB Smart Chain Testnet',
    network: 'arb-testnet',
    scanURL: 'https://goerli.arbiscan.io',
    rpcUrls: [
      'https://goerli-rollup.arbitrum.io/rpc'
    ],
    scan: 'ARBScan',
    decimals: 18,
    tokenName: 'ETH',
    symbol: 'ETH',
    multicall: {
      address: '0x654dfDf027386296591b21b8d7E61977cD5571Ee',
      blockCreated: 20503403,
    },
    testnet: true,
  },
  [ChainId.ARB]: {
    name: 'ARB Smart Chain',
    network: 'arb mainnet',
    scanURL: 'https://arbiscan.io/',
    rpcUrls: [
      'https://arbitrum.public-rpc.com'
    ],
    scan: 'ARBScan',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH',
    },
    decimals: 18,
    multicall: {
      address: '0x654dfDf027386296591b21b8d7E61977cD5571Ee',
      blockCreated: 20503403,
    },
    testnet: false,
  },
  [ChainId.ZKSYNC]: {
    name: 'zkSync EAR',
    network: 'zkSyncera-mainnet',
    scanURL: 'https://explorer.zksync.io/',
    rpcUrls: [
      'https://mainnet.era.zksync.io'
    ],
    scan: 'explorer',
    decimals: 18,
    tokenName: 'ETH',
    symbol: 'ETH',
    multicall: {
      address: '',
      blockCreated: 0,
    },
    testnet: false,
  },
  [ChainId.ZKSYNC_TESTNET]: {
    name: 'zkSync EAR Testnet',
    network: 'zkSyncera-testnet',
    scanURL: 'https://goerli.explorer.zksync.io/',
    rpcUrls: [
      'https://testnet.era.zksync.dev'
    ],
    scan: 'explorer',
    decimals: 18,
    tokenName: 'ETH',
    symbol: 'ETH',
    multicall: {
      address: '',
      blockCreated: 0,
    },
    testnet: true,
  },
}

// CAKE_PER_BLOCK details
// 40 CAKE is minted per block
// 20 CAKE per block is sent to Burn pool (A farm just for burning cake)
// 10 CAKE per block goes to CAKE syrup pool
// 9 CAKE per block goes to Yield farms and lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const CAKE_PER_BLOCK = 40
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://equityswap.club'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_BSC_SCAN_URL = NETWORK_CONFIG[ChainId.BSC].scanURL
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 250000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
