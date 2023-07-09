import {useCallback, useEffect, useState, useRef, useMemo} from 'react'
import {CurrencyAmount, ETHER, TokenAmount} from "@pancakeswap/sdk";
import {useWeb3React} from "@web3-react/core";
import {useTranslation} from "@pancakeswap/localization";
import useActiveWeb3React from "./useActiveWeb3React";
import {useCallWithGasPrice} from "./useCallWithGasPrice";

import useToast from "./useToast";
import { MINT_ADDRESS, HAND_NFT_ADDRESS } from "../config/constants/exchange";
import useCatchTxError from "./useCatchTxError";
import { useMintContract, useNFTHandContract } from './useContract';

export const useCircleProject = () => {
  const { chainId, account } = useActiveWeb3React()

  const [projects, setProjects] = useState(null)

  const fetchProjects = useCallback(async () => {
    try {
      const res: any = await fetch(
          `https://www.equityswap.club/app/index/currencies`,
          {
            method: 'post',
            body: JSON.stringify({
              net: account ? `evm--${Number(chainId)}` : `evm--97`,
              page: 1,
              size: 10000,
              sortName: '',
              sortOrder: '',
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          },
      )
      const obj = await res.json()
      if (obj?.code === 0) {
        setProjects(obj?.datas?.list)
      }

    } catch (error) {
      console.error(`Failed to fetch list`, error)
      return {
        error: true,
      }
    }
    return {
      error: false,
    }
  }, [chainId, account])


  useEffect(() => {
    fetchProjects()
  }, [chainId, account])

  return { projects }
}

export const useCircleProjectInfo = (projectAddress) => {
  const { chainId, account } = useActiveWeb3React()

  const [project, setProject] = useState(null)

  const fetchProjects = useCallback(async () => {
    try {
      const res: any = await fetch(
          `https://www.equityswap.club/app/index/currencies`,
          {
            method: 'post',
            body: JSON.stringify({
              net: account ? `evm--${Number(chainId)}` : `evm--97`,
              page: 1,
              size: 10000,
              sortName: '',
              sortOrder: '',
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          },
      )
      const obj = await res.json()
      if (obj?.code === 0) {
        setProject(obj?.datas?.list?.find((item) => {return projectAddress === item?.token_addr}))
      }
    } catch (error) {
      console.error(`Failed to fetch list`, error)
      return {
        error: true,
      }
    }
    return {
      error: false,
    }
  }, [chainId, account, projectAddress])


  useEffect(() => {
    fetchProjects()
  }, [chainId, account, projectAddress])

  return { project }
}

export const useCircleListInfo = (userAddressList) => {
  const { chainId, account } = useActiveWeb3React()

  const [listInfo, setListInfo] = useState(null)

  const fetchList = useCallback(async () => {
    try {
      const res: any = await fetch(
          `https://www.equityswap.club/app/user/batch_userinfo`,
          {
            method: 'post',
            body: JSON.stringify({
              net: account ? `evm--${Number(chainId)}` : `evm--97`,
              targetWallet: userAddressList
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          },
      )
      const obj = await res.json()
      if (obj?.code === 0) {
        setListInfo(obj?.datas?.user_list)
      }
    } catch (error) {
      console.error(`Failed to fetch list`, error)
      return {
        error: true,
      }
    }
    return {
      error: false,
    }
  }, [chainId, account, JSON.stringify(userAddressList)])


  useEffect(() => {
    if (!userAddressList || userAddressList.length === 0 || !account) {
      return
    }
    fetchList()
  }, [chainId, account, JSON.stringify(userAddressList)])

  return listInfo
}

export const useCircleInv = (projectAddress) => {
  const { chainId, account } = useActiveWeb3React()

  const [inv, setInv] = useState(null)

  const fetchInv = useCallback(async () => {
    setInv(null)
    try {
      const res: any = await fetch(
          `https://www.equityswap.club/app/user/getinv`,
          {
            method: 'post',
            body: JSON.stringify({
              net: account ? `evm--${Number(chainId)}` : `evm--97`,
              target_wallet: account,
              pro_addr: projectAddress,
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          },
      )
      const obj = await res.json()
      if (obj?.code === 0) {
        setInv(obj?.data)
      }
    } catch (error) {
      console.error(`Failed to fetch list`, error)
      return {
        error: true,
      }
    }
    return {
      error: false,
    }
  }, [chainId, account, projectAddress])

  useEffect(() => {
    if (!projectAddress || !account) {
      return
    }
    fetchInv()
  }, [chainId, account, projectAddress])

  return inv
}

export const useMint = (projectAddrress) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const mintContract = useMintContract(MINT_ADDRESS[chainId])
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isLoading } = useCatchTxError()
  const [mintCallback, setMintCallback] = useState(null)

  const mint = useCallback(async (listCopy): Promise<void> => {
    if (!mintContract) {
      console.error('mintContract is null')
      return
    }

    if (!listCopy) {
      console.error('list is null')
      return
    }

    if (!account) {
      console.error('web3 not connet')
      return
    }

    const list = listCopy.map((item) => {return item.addr})
    const from = listCopy.map((item) => {return account})
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(mintContract, 'mintNfts', [HAND_NFT_ADDRESS[chainId], projectAddrress, from, list])
    })
    if (receipt?.status) {
      setMintCallback(true)
    } else {
      setMintCallback(false)
    }
  }, [account, mintContract, chainId])

  return {
    callback: mint,
    mintCallback,
    isLoading
  }
}

export const useCircleNftInfo = () => {
  const { chainId, account } = useActiveWeb3React()

  const [already, setAlready] = useState(null)
  const [waiting, setWaiting] = useState(null)
  const [history, setHistory] = useState(null)

  const fetchList = useCallback(async () => {
    try {
      const res: any = await fetch(
          `https://www.equityswap.club/app/index/nft`,
          {
            method: 'post',
            body: JSON.stringify({
              net: account ? `evm--${Number(chainId)}` : `evm--97`,
              addr: account.toLowerCase()
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          },
      )
      const obj = await res.json()
      if (obj?.code === 0) {
        setAlready(obj?.datas?.draw_list_already)
        setWaiting(obj?.datas?.draw_list_waiting)
        setHistory(obj?.datas?.histroy_list)
      }
    } catch (error) {
      console.error(`Failed to fetch Nft info`, error)
      return {
        error: true,
      }
    }
    return {
      error: false,
    }
  }, [chainId, account])


  useEffect(() => {
    if (!account) {
      return
    }
    fetchList()
  }, [chainId, account])

  return {
    already,
    waiting,
    history
  }
}

export const useClaim = () => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const claimContract = useNFTHandContract(HAND_NFT_ADDRESS[chainId])
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: isLoading } = useCatchTxError()
  const [claimCallback, setClaimCallback] = useState(null)

  const claim = useCallback(async (NftId): Promise<void> => {
    if (!claimContract) {
      console.error('claimContract is null')
      return
    }

    if (!NftId) {
      console.error('NftId is null')
      return
    }

    if (!account) {
      console.error('web3 not connet')
      return
    }

    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(claimContract, 'claim', [NftId])
    })
    if (receipt?.status) {
      setClaimCallback(true)
    } else {
      setClaimCallback(false)
    }
  }, [account, claimContract, chainId])

  return {
    callback: claim,
    claimCallback,
    isLoading
  }
}

