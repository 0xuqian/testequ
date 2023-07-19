/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from "react";
import useActiveWeb3React from "./useActiveWeb3React";


export interface NftHistory{
  claim_number: number;
  mint_number: number;
  pro_addr: string;
  pro_icon: string;
  pro_name: string;
}


export interface AllHistory{
  code: number;
  data:{
    all_nft_his: NftHistory[];
  }
  msg: string;
  other: object;
}


export const useHistoryNftInfo = (): AllHistory | null => {
  const {chainId,account} = useActiveWeb3React()
  const [projects, setProjects] = useState<AllHistory | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res: any = await fetch(`https://www.equityswap.club/app/user/nft_his`,
      {
        method: 'post',
        body: JSON.stringify({
          // net: account ? `evm--${Number(chainId)}` : `evm--97`,
          net: `evm--56`,
          miner: "0xF5CA1C5E074a99e7bc3d082709d0022dE09cA94c"
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      const obj: AllHistory = await res.json()
      if (obj?.code === 0) {
        setProjects(obj)
      }
    }catch (error) {
      console.error(`Failed to fetch list`, error)
    }
  },[])
  useEffect(() => {
    fetchData()
  }, [chainId, account, fetchData])
  return projects;
}


