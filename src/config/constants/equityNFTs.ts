import { ChainId } from "config";


export const NFTsInfo = {
  [ChainId.BSC]: {
    BatchMintContract: "0x6E6CFb3A5b93367495D52aF339835739258b9295",
    NFTsContract: "0xc2452DB583AFB353cB44Ac6edC2f61Da7C23A8bB",
    MintPrice: 0.00022,
  },
  [ChainId.opBNB]: {
    BatchMintContract: "0xadeb8dbDA3199e3C280785Fca574ADEc5d30ea7e",
    NFTsContract: "0x8339B2aCCd521a0641C1De51f76AaD20303fea96",
    MintPrice: 0.00022,
  },
}