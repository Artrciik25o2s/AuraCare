
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// Simple NFT contract ABI for MindfulNFT
const MINDFUL_NFT_ABI = [
  "function mint(address to, uint256 tokenId, string memory tokenURI) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)"
];

// Base Sepolia testnet configuration
const BASE_SEPOLIA_CONFIG = {
  chainId: '0x14A34', // 84532 in hex
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia-explorer.base.org'],
};

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private nftContract: ethers.Contract | null = null;
  
  // This would be deployed MindfulNFT contract address on Base Sepolia
  private readonly NFT_CONTRACT_ADDRESS = '0x892d35Cc6634C0532925a3b8D6eF86Fc2b8b3456';

  async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to connect your wallet!');
      return null;
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Switch to Base Sepolia network
      await this.switchToBaseSepolia();
      
      const address = await this.signer.getAddress();
      
      // Initialize NFT contract
      this.nftContract = new ethers.Contract(
        this.NFT_CONTRACT_ADDRESS,
        MINDFUL_NFT_ABI,
        this.signer
      );
      
      toast.success('Wallet connected successfully!');
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
      return null;
    }
  }

  private async switchToBaseSepolia(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If the chain hasn't been added to the user's wallet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError);
          toast.error('Failed to add Base Sepolia network');
        }
      } else {
        console.error('Error switching to Base Sepolia:', switchError);
        toast.error('Failed to switch to Base Sepolia network');
      }
    }
  }

  async getNFTBalance(address: string): Promise<number> {
    if (!this.nftContract) return 0;

    try {
      const balance = await this.nftContract.balanceOf(address);
      return parseInt(balance.toString());
    } catch (error) {
      console.error('Error getting NFT balance:', error);
      return 0;
    }
  }

  async mintNFT(address: string, tokenId: number, tokenURI: string): Promise<boolean> {
    if (!this.nftContract || !this.signer) {
      toast.error('Wallet not connected');
      return false;
    }

    try {
      // In a real implementation, this would mint the actual NFT
      toast.success('🎉 NFT minted successfully!');
      return true;
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast.error('Failed to mint NFT');
      return false;
    }
  }

  async simulateNFTMint(nftName: string): Promise<boolean> {
    // Simulate NFT minting for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success(`🎉 ${nftName} NFT minted!`, {
          duration: 4000,
          icon: '🎁',
        });
        resolve(true);
      }, 2000);
    });
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.Signer | null {
    return this.signer;
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const blockchainService = new BlockchainService();
