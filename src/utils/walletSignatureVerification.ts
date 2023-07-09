import Web3 from 'web3';

export function walletSignatureVerification(
  walletAddress: string,
  data: string,
  signature: string
): boolean {
  let isSignatureValid = false;

  try {
    const web3 = new Web3();

    const recoveredAddress = web3.eth.accounts.recover(data, signature);

    isSignatureValid = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('钱包签名验证失败:', error);
    isSignatureValid = false;
  }

  return isSignatureValid;
}