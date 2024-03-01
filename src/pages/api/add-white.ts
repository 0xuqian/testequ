import Web3 from 'web3'
import { parse } from 'qs'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as https from 'https';

const config = {
  '5': {
    pre_url: 'https://goerli.etherscan.io/address/',
    factory_address: '0xa373C0460cD7c1A355E07a004c8f8651aDE8a3d3',
    setter_address: '0x994D95Ea4C37C4b586Fa9668211Daa4Aa03be060',
    setter_private_key: '',
    WETH: '0x308c1be1A89A144711cFE78dD67dBf8b7F179b17',
    gas_price: 10,
    node_url: 'https://ethereum-goerli.publicnode.com/',
    reg: /Creator Address \((.*?)\)'/
  },
  '56': {
    pre_url: 'https://bscscan.com/address/',
    factory_address: '',
    setter_address: '0x0cDDE7C9B8EE5Fc1AfA8D992cF800271FDCb6d99',
    setter_private_key: '',
    WETH: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    gas_price: 5,
    node_url: '',
    reg: /Creator Address">(.*?)</
  },
  '97': {
    pre_url: 'https://testnet.bscscan.com/address/',
    factory_address: '0xeff754Bd50d9FCb6e3F2B9594aCaACC089Aed652',
    setter_address: '0x0cDDE7C9B8EE5Fc1AfA8D992cF800271FDCb6d99',
    setter_private_key: '',
    WETH: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    gas_price: 10,
    node_url: 'https://bsc-testnet.publicnode.com',
    /* node_url: 'https://data-seed-prebsc-1-s3.binance.org:8545', */
    // reg: /Creator Address'>(.*?)</
    reg: /(?<=Creator Address[^>]*">[^"]*")0x[a-fA-F0-9]{40}/
  },
  '421613': {
    pre_url: 'https://goerli.arbiscan.io/address/',
    factory_address: '0x6941CD0d6EF3E4c1294b85fe6EF275AA6C4691fb',
    setter_address: '0x630c2F96a19B80e76e6Ebf15a2C9166265744320',
    setter_private_key: '',
    WETH: '0x2372aD6C4dD859bcce41d6D2451168eCF23Be3aB',
    gas_price: 10,
    node_url: 'https://goerli-rollup.arbitrum.io/rpc',
    reg: /Creator Address'>(.*?)</
  },
}

const FactoryABI = [
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'creater', type: 'address' },
    ],
    name: 'isWhite',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'creater', type: 'address' },
      { internalType: 'uint256', name: 'flag', type: 'uint256' },
    ],
    name: 'addWhiteList',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

async function creatorAddress(req: NextApiRequest): Promise<{ creatorAddress: string; alreadyExist: number }> {
  let crawlingCreatorAddress = ''
  let alreadyExist = -1

  const {
    token: argToken,
    chainId: argChainId,
    address: argAddress,
  } = parse(req.url.replace(/(.*)\?/g, '')) as { chainId: string; token: string; address: string; }

  const token = Web3.utils.toChecksumAddress(argToken)

  /* if (token === Web3.utils.toChecksumAddress(config[argChainId].WETH)) {
    alreadyExist = 0
  } */
  const web3 = new Web3(config[argChainId].node_url)
  const factoryAddress = Web3.utils.toChecksumAddress(config[argChainId].factory_address)
  const factoryContract = new web3.eth.Contract(FactoryABI as any, factoryAddress)

  try {
    alreadyExist = await factoryContract.methods
      .isWhite(token, argAddress)
      .call()
      .then((res) => {
        return Number(res)
      })
  } catch (error) {
    console.error('error', error)
  }

  if (token === Web3.utils.toChecksumAddress(config[argChainId].WETH)) {
    return { creatorAddress: crawlingCreatorAddress, alreadyExist }
  }

  const url = config[argChainId].pre_url + argToken
  //  const url =`https://testnet.bscscan.com/address/0x3b3bfe7413e6f6326670b72281d3d5f2d35488d7`

  //   const crawlingHtml = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then((response) => {
  //     return response.text()
  //   })

  ///
  console.log(`开始获取html`)
  // 用于存储获取到的 HTML 内容
  let crawlingHtml = '';

  const parsedUrl = new URL(url);
  console.log(`hostname:${parsedUrl.hostname},path"${parsedUrl.pathname}`)
  const options = {
    hostname: parsedUrl.hostname, // 根据实际URL修改
    path: parsedUrl.pathname, // 根据实际需要修改路径
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1', // Do Not Track request header
      'Connection': 'keep-alive'
    }
  };

  https.get(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    // 检查响应状态码是否为 200（OK）
    if (res.statusCode !== 200) {
      console.error(`Request Failed. Status Code: ${res.statusCode}`);
      res.resume(); // 消耗响应数据以释放内存
      return;
    }

    res.setEncoding('utf-8'); // 设置字符编码
    // 接收数据片段并拼接
    res.on('data', (chunk) => {
      crawlingHtml += chunk;
    });

    // 数据接收完毕，此时 crawlingHtml 中存储了完整的 HTML 内容
    res.on('end', () => {
      // 这里 crawlingHtml 已经包含了整个页面的 HTML，但我们不进行输出
      // 如果需要进一步处理 crawlingHtml，可以在这里进行
    });

  }).on('error', (err) => {
    console.error('Request Error:', err);
  });

  ///
  console.log(`crawlingHtml:${crawlingHtml}`)
  console.log(`argChainId:${argChainId}`)
  const regexpPattern = config[argChainId].reg
  console.log(`regexpPattern:${regexpPattern}`)
  console.log(`正则结果：${crawlingHtml.match(regexpPattern)?.[0]} and ${crawlingHtml.match(regexpPattern)?.[1]}`)
  crawlingCreatorAddress = crawlingHtml.match(regexpPattern)?.[0]
  console.log(`url:${url}\ncrawlingCreatorAddress:${crawlingCreatorAddress}`)
  return { creatorAddress: crawlingCreatorAddress, alreadyExist }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let rst
  try {
    rst = await creatorAddress(req)
  } catch (error) {
    console.log('error', error)
  }

  if (rst) {
    res.status(200).end(JSON.stringify(rst))
  } else {
    res.status(500).end()
  }
}