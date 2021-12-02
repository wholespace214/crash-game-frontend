import actions from './actions.json';
const enviroment = process.env.REACT_APP_ENVIRONMENT;

export const networkInfo = {
  mainnet: {
    chainId: 1,
    explorer: 'https://etherscan.io/',
    label: 'Mainnet',
    url: 'https://mainnet.infura.io/v3/f6acacf850c94276afe2351e85f61414',
    apiExplorer: 'https://api.etherscan.io/api',
    contractAddress: enviroment
      ? actions.default[enviroment].ethereum
      : actions.default.production.ethereum,
  },
  rinkeby: {
    chainId: 4,
    explorer: 'https://rinkeby.etherscan.io/',
    label: 'Rinkeby',
    url: 'https://rinkeby.infura.io/v3/f6acacf850c94276afe2351e85f61414',
    apiExplorer: 'https://api-rinkeby.etherscan.io/api',
    contractAddress: enviroment
      ? actions.default[enviroment].ethereum
      : actions.default.development.ethereum,
  },
  localhost: {
    chainId: 1337,
    explorer: '',
    label: 'Local Network',
    url: 'http://localhost:8545',
    apiExplorer: 'https://api.etherscan.io/api',
    contractAddress: enviroment
      ? actions.default[enviroment].ethereum
      : actions.default.development.ethereum,
  },
  goerli: {
    chainId: 5,
    explorer: 'https://goerli.etherscan.io/',
    label: 'Goerli',
    url: 'https://goerli.infura.io/v3/f6acacf850c94276afe2351e85f61414',
    apiExplorer: 'https://api-goerli.etherscan.io/api',
    contractAddress: enviroment
      ? actions.default[enviroment].ethereum
      : actions.default.development.ethereum,
  },
  polygon: {
    chainId: 137,
    explorer: 'https://polygonscan.com/',
    label: 'Polygon',
    url: 'https://polygon-rpc.com',
    apiExplorer: 'https://polygon-rpc.com',
    contractAddress: enviroment
      ? actions.default[enviroment].polygon
      : actions.default.development.polygon,
  },
  mumbai: {
    chainId: 80001,
    explorer: 'https://rpc-mumbai.maticvigil.com/',
    label: 'Mumbai Testnet',
    url: 'https://polygonscan.com',
    apiExplorer: 'https://polygonscan.com',
    contractAddress: enviroment
      ? actions.default[enviroment].polygon
      : actions.default.development.polygon,
  },
  kovan: {
    chainId: 42,
    explorer: 'https://kovan.etherscan.io/',
    label: 'Kovan',
    url: 'https://kovan.infura.io/v3/f6acacf850c94276afe2351e85f61414',
    apiExplorer: 'https://api-kovan.etherscan.io/api',
    contractAddress: enviroment
      ? actions.default[enviroment].polygon
      : actions.default.development.polygon,
  },
};

const currentChainSelected = window?.ethereum?.networkVersion || actions.network.chainId
const currentNetworkKey =
  Object.keys(networkInfo).find(
    value =>
      parseInt(networkInfo[value].chainId) === parseInt(currentChainSelected)
  ) || actions.network.name;

export const currentChainId = currentChainSelected;
export const currentNetwork = networkInfo[currentNetworkKey];

// export const WFAIRAddress = actions.token.address;
export const WFAIRAddress = currentNetwork.contractAddress;

export const lockAddresses = actions.locks.map(l => l.address);
export const lockInfo = Object.values(actions.locks).reduce(
  (obj, l) => Object.assign(obj, { [l.address]: { name: l.name } }),
  {}
);
