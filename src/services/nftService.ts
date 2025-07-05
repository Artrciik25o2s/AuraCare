
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// Updated NFT contract ABI for your deployed MindfulNFT contract
const MINDFUL_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mintNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Updated Base Sepolia testnet configuration
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

export interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  achievement: string;
  mintedAt: number;
  tokenId?: number;
}

export interface NFTReward {
  id: string;
  name: string;
  description: string;
  image: string;
  requirement: {
    type: 'assessments' | 'streak' | 'insights' | 'games' | 'mood_score' | 'chat_sessions' | 'breathing_exercises' | 'memory_games' | 'math_games' | 'reaction_games' | 'total_score';
    value: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

class NFTService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private nftContract: ethers.Contract | null = null;
  
  // Your deployed MindfulNFT contract address on Base Sepolia
  private readonly NFT_CONTRACT_ADDRESS = '0xf6154942c73bc15d839a1f719d51bc9c914a96cd';

  // Available NFT rewards - max 3 per category with attractive images
  private readonly NFT_REWARDS: NFTReward[] = [
    // Assessment & Learning NFTs (3)
    {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Completed your first wellness assessment',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'assessments', value: 1 },
      rarity: 'common'
    },
    {
      id: 'wellness_explorer',
      name: 'Wellness Explorer',
      description: 'Completed 10 wellness assessments',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'assessments', value: 10 },
      rarity: 'rare'
    },
    {
      id: 'wellness_master',
      name: 'Wellness Master',
      description: 'Completed 25+ assessments',
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'assessments', value: 25 },
      rarity: 'legendary'
    },

    // Streak & Consistency NFTs (3)
    {
      id: 'daily_habit',
      name: 'Daily Habit',
      description: 'Maintained a 3-day wellness streak',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'streak', value: 3 },
      rarity: 'common'
    },
    {
      id: 'consistent_learner',
      name: 'Consistent Learner',
      description: 'Maintained a 14-day wellness streak',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'streak', value: 14 },
      rarity: 'epic'
    },
    {
      id: 'unstoppable_force',
      name: 'Unstoppable Force',
      description: 'Maintained a 30-day wellness streak',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'streak', value: 30 },
      rarity: 'mythic'
    },

    // AI Interaction NFTs (3)
    {
      id: 'ai_companion',
      name: 'AI Companion',
      description: 'Received 5 AI insights',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'insights', value: 5 },
      rarity: 'common'
    },
    {
      id: 'therapy_seeker',
      name: 'Therapy Seeker',
      description: 'Had 10 chat sessions with AI therapist',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'chat_sessions', value: 10 },
      rarity: 'rare'
    },
    {
      id: 'mindful_conversationalist',
      name: 'Mindful Conversationalist',
      description: 'Had 25 chat sessions with AI therapist',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'chat_sessions', value: 25 },
      rarity: 'legendary'
    },

    // Cognitive Games NFTs (3)
    {
      id: 'memory_master',
      name: 'Memory Master',
      description: 'Played 15 memory games',
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'memory_games', value: 15 },
      rarity: 'rare'
    },
    {
      id: 'math_wizard',
      name: 'Math Wizard',
      description: 'Completed 20 math lightning games',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'math_games', value: 20 },
      rarity: 'epic'
    },
    {
      id: 'quick_reflexes',
      name: 'Quick Reflexes',
      description: 'Played 15 reaction time games',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'reaction_games', value: 15 },
      rarity: 'rare'
    },

    // Wellness Activities NFTs (3)
    {
      id: 'zen_breathing',
      name: 'Zen Breathing',
      description: 'Completed 10 breathing exercises',
      image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'breathing_exercises', value: 10 },
      rarity: 'common'
    },
    {
      id: 'breath_master',
      name: 'Breath Master',
      description: 'Completed 50 breathing exercises',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'breathing_exercises', value: 50 },
      rarity: 'epic'
    },
    {
      id: 'meditation_guru',
      name: 'Meditation Guru',
      description: 'Completed 100 breathing exercises',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'breathing_exercises', value: 100 },
      rarity: 'mythic'
    },

    // Mood & Achievement NFTs (3)
    {
      id: 'mood_improver',
      name: 'Mood Improver',
      description: 'Achieved 70% average mood score',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'mood_score', value: 70 },
      rarity: 'common'
    },
    {
      id: 'happiness_seeker',
      name: 'Happiness Seeker',
      description: 'Achieved 85% average mood score',
      image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'mood_score', value: 85 },
      rarity: 'epic'
    },
    {
      id: 'bliss_achiever',
      name: 'Bliss Achiever',
      description: 'Achieved 95% average mood score',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&q=80',
      requirement: { type: 'mood_score', value: 95 },
      rarity: 'legendary'
    }
  ];

  async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to connect your wallet!');
      return null;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      await this.switchToBaseSepolia();
      
      const address = await this.signer.getAddress();
      
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
      }
    }
  }

  getAvailableRewards(): NFTReward[] {
    return this.NFT_REWARDS;
  }

  checkEligibleRewards(userStats: {
    totalAssessments: number;
    streakDays: number;
    aiInsights: number;
    avgMoodScore: number;
    chatSessions?: number;
    breathingExercises?: number;
    memoryGames?: number;
    mathGames?: number;
    reactionGames?: number;
    totalScore?: number;
  }): NFTReward[] {
    return this.NFT_REWARDS.filter(reward => {
      switch (reward.requirement.type) {
        case 'assessments':
          return userStats.totalAssessments >= reward.requirement.value;
        case 'streak':
          return userStats.streakDays >= reward.requirement.value;
        case 'insights':
          return userStats.aiInsights >= reward.requirement.value;
        case 'mood_score':
          return userStats.avgMoodScore >= reward.requirement.value;
        case 'chat_sessions':
          return (userStats.chatSessions || 0) >= reward.requirement.value;
        case 'breathing_exercises':
          return (userStats.breathingExercises || 0) >= reward.requirement.value;
        case 'memory_games':
          return (userStats.memoryGames || 0) >= reward.requirement.value;
        case 'math_games':
          return (userStats.mathGames || 0) >= reward.requirement.value;
        case 'reaction_games':
          return (userStats.reactionGames || 0) >= reward.requirement.value;
        case 'total_score':
          return (userStats.totalScore || 0) >= reward.requirement.value;
        default:
          return false;
      }
    });
  }

  private async uploadMetadataToIPFS(metadata: any): Promise<string> {
    // In a real implementation, you would upload to IPFS
    // For now, we'll create a JSON string that represents the metadata
    // In production, use services like Pinata, Infura IPFS, or web3.storage
    
    const jsonString = JSON.stringify(metadata, null, 2);
    console.log('NFT Metadata to be uploaded:', jsonString);
    
    // Simulate IPFS hash - in production, this would be the actual IPFS hash
    const simulatedIPFSHash = `ipfs://QmTempHash${Date.now()}`;
    
    // You would replace this with actual IPFS upload
    /*
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_PINATA_JWT_TOKEN`
        },
        body: jsonString
      });
      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw error;
    }
    */
    
    return simulatedIPFSHash;
  }

  async mintNFT(reward: NFTReward, userAddress: string): Promise<NFTMetadata | null> {
    if (!this.nftContract || !this.signer) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      toast.loading('Preparing NFT metadata...', { id: 'mint-nft' });
      
      // Create metadata
      const metadata = {
        name: reward.name,
        description: reward.description,
        image: reward.image,
        attributes: [
          { trait_type: 'Rarity', value: reward.rarity },
          { trait_type: 'Achievement', value: reward.name },
          { trait_type: 'Mint Date', value: new Date().toISOString() },
          { trait_type: 'Category', value: reward.requirement.type },
          { trait_type: 'Requirement Value', value: reward.requirement.value }
        ]
      };

      // Upload metadata to IPFS (simulated)
      const tokenURI = await this.uploadMetadataToIPFS(metadata);
      
      toast.loading('Minting NFT on blockchain...', { id: 'mint-nft' });
      
      // Call the mintNFT function on your contract
      const tx = await this.nftContract.mintNFT(userAddress, tokenURI);
      
      toast.loading('Waiting for transaction confirmation...', { id: 'mint-nft' });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the token ID from the transaction logs
      let tokenId = null;
      for (const log of receipt.logs) {
        try {
          const parsedLog = this.nftContract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'Transfer') {
            tokenId = parsedLog.args.tokenId.toString();
            break;
          }
        } catch (e) {
          // Log might not be from our contract
          continue;
        }
      }

      const nftMetadata: NFTMetadata = {
        id: reward.id,
        name: reward.name,
        description: reward.description,
        image: reward.image,
        attributes: [
          { trait_type: 'Rarity', value: reward.rarity },
          { trait_type: 'Achievement', value: reward.name },
          { trait_type: 'Mint Date', value: new Date().toISOString() }
        ],
        achievement: reward.name,
        mintedAt: Date.now(),
        tokenId: tokenId ? parseInt(tokenId) : undefined
      };
      
      toast.success(`🎉 ${reward.name} NFT minted successfully!`, { 
        id: 'mint-nft',
        duration: 5000 
      });
      
      // Log transaction details
      console.log('NFT Minted successfully!');
      console.log('Transaction Hash:', receipt.hash);
      console.log('Token ID:', tokenId);
      console.log('Block Explorer:', `https://sepolia-explorer.base.org/tx/${receipt.hash}`);
      
      return nftMetadata;
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      
      let errorMessage = 'Failed to mint NFT';
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas fees';
      } else if (error.message?.includes('execution reverted')) {
        errorMessage = 'Contract execution failed';
      }
      
      toast.error(errorMessage, { id: 'mint-nft' });
      return null;
    }
  }

  async simulateMint(reward: NFTReward): Promise<NFTMetadata | null> {
    // Simulate minting for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        const metadata: NFTMetadata = {
          id: reward.id,
          name: reward.name,
          description: reward.description,
          image: reward.image,
          attributes: [
            { trait_type: 'Rarity', value: reward.rarity },
            { trait_type: 'Achievement', value: reward.name },
            { trait_type: 'Mint Date', value: new Date().toISOString() }
          ],
          achievement: reward.name,
          mintedAt: Date.now(),
          tokenId: Date.now()
        };
        
        toast.success(`🎉 ${reward.name} NFT minted!`, {
          duration: 4000,
          icon: '🎁',
        });
        
        resolve(metadata);
      }, 2000);
    });
  }

  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-orange-600';
      case 'mythic':
        return 'from-pink-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  getContractAddress(): string {
    return this.NFT_CONTRACT_ADDRESS;
  }
}

export const nftService = new NFTService();
