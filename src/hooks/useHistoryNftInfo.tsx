/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from "react";
import useActiveWeb3React from "./useActiveWeb3React";


export interface NftHistory {
  claim_number: number;
  mint_number: number;
  pro_addr: string;
  pro_icon: string;
  pro_name: string;
}


export interface AllHistory {
  code: number;
  data: {
    x_axis: any[];
    y_axis: any[];
    all_nft_his: NftHistory[];
  }
  msg: string;
  other: object;
}


export const useHistoryNftInfo = (setNetwork): AllHistory | null => {
  const { chainId, account } = useActiveWeb3React()
  const [projects, setProjects] = useState<AllHistory | null>(null)

  const fetchData = useCallback(async () => {
    console.log(JSON.stringify({
      net: account ? `evm--${Number(chainId)}` : `evm--97`,
      miner: account
    }),)
    try {
      const res: any = await fetch(`https://www.equityswap.club/app/user/nft_his`,
        {
          method: 'post',
          body: JSON.stringify({
            net: account ? `evm--${Number(chainId)}` : `evm--97`,
            miner: account
          }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })
      const obj: AllHistory = await res.json()
      if (obj?.code === 0) {
        setProjects(obj)
      }
    } catch (error) {
      setNetwork(false);
      console.error(`Failed to fetch list`, error)
    }
  }, [chainId, account])

  useEffect(() => {
    fetchData()
  }, [chainId, account, fetchData])
  return projects;
}


export const useKLine = (): AllHistory | null => {

  const { chainId, account } = useActiveWeb3React()

  const [KData, setKData] = useState<AllHistory | null>(null)
  const fetchData = useCallback(async () => {
    try {
      const res: any = await fetch(`https://www.equityswap.club/app/k_line`,
        {
          method: 'post',
          body: JSON.stringify({
            token_addr: "0xd4FEc4cEf94F97d79Ec8E7C83445887833fC4d28",
            net: `evm--${Number(chainId)}`
          }),
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })
      const obj: AllHistory = await res.json()
      if (obj?.code === 0) {
        setKData(obj)
      }
    } catch (error) {
      console.error(`Failed to fetch list`, error)
    }
  }, [chainId, account])

  useEffect(() => {
    fetchData()
  }, [chainId, account, fetchData])

  return KData;
}