import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, ExternalLink, Calendar, Star, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useMindfulStore } from '../stores/mindfulStore';
import { nftService, NFTReward } from '../services/nftService';
import toast from 'react-hot-toast';

const NFTGallery: React.FC = () => {
  const { userProfile, userResponses, feedbackHistory, gameScores, addMintedNFT } = useMindfulStore();
  const [eligibleRewards, setEligibleRewards] = useState<NFTReward[]>([]);
  const [allRewards, setAllRewards] = useState<NFTReward[]>([]);
  const [isMinting, setIsMinting] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const rewards = nftService.getAvailableRewards();
    setAllRewards(rewards);

    // Calculate comprehensive user stats
    const stats = {
      totalAssessments: userProfile.totalQuizzes,
      streakDays: userProfile.streakDays,
      aiInsights: feedbackHistory.length,
      avgMoodScore: calculateMoodScore(),
      chatSessions: 0, // This would be tracked in a real implementation
      breathingExercises: gameScores['breathing'] || 0,
      memoryGames: gameScores['memory'] || 0,
      mathGames: gameScores['math'] || 0,
      reactionGames: gameScores['reaction'] || 0,
      totalScore: userProfile.tokensEarned
    };

    const eligible = nftService.checkEligibleRewards(stats);
    setEligibleRewards(eligible);
  }, [userProfile, feedbackHistory, userResponses, gameScores]);

  const calculateMoodScore = () => {
    if (!userResponses) return 0;
    const totalCards = userResponses.often.length + userResponses.sometimes.length + userResponses.rarely.length;
    if (totalCards === 0) return 0;
    const moodPoints = (userResponses.often.length * 3) + (userResponses.sometimes.length * 2) + (userResponses.rarely.length * 1);
    return Math.round((moodPoints / (totalCards * 3)) * 100);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await nftService.connectWallet();
      setWalletAddress(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMintNFT = async (reward: NFTReward) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsMinting(reward.id);
    
    try {
      // Use real minting instead of simulation
      const mintedNFT = await nftService.mintNFT(reward, walletAddress);
      if (mintedNFT) {
        addMintedNFT(mintedNFT);
      }
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      toast.error('Failed to mint NFT');
    } finally {
      setIsMinting(null);
    }
  };

  const isNFTMinted = (rewardId: string) => {
    return userProfile.mintedNFTs?.some(nft => nft.id === rewardId) || false;
  };

  const getRarityGradient = (rarity: string) => {
    return nftService.getRarityColor(rarity);
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return '👑';
      case 'legendary':
        return '⭐';
      case 'epic':
        return '💎';
      case 'rare':
        return '🔮';
      case 'common':
        return '🏅';
      default:
        return '🏅';
    }
  };

  // Group NFTs by category for better organization
  const categorizeNFTs = (rewards: NFTReward[]) => {
    const categories = {
      'Assessment & Learning': rewards.filter(r => r.requirement.type === 'assessments'),
      'Consistency & Streaks': rewards.filter(r => r.requirement.type === 'streak'),
      'AI Interaction': rewards.filter(r => ['insights', 'chat_sessions'].includes(r.requirement.type)),
      'Cognitive Games': rewards.filter(r => ['memory_games', 'math_games', 'reaction_games'].includes(r.requirement.type)),
      'Wellness Activities': rewards.filter(r => r.requirement.type === 'breathing_exercises'),
      'Mood & Achievement': rewards.filter(r => ['mood_score', 'total_score'].includes(r.requirement.type))
    };
    return categories;
  };

  const categorizedRewards = categorizeNFTs(allRewards);

  return (
    <div className="space-y-8">
      {/* Wallet Connection Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wallet Connection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your wallet to mint NFTs on Base Sepolia testnet
            </p>
          </div>
          <div>
            {walletAddress ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Minted NFTs Section */}
      {userProfile.mintedNFTs && userProfile.mintedNFTs.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Award className="w-6 h-6 mr-2 text-yellow-500" />
            Your NFT Collection ({userProfile.mintedNFTs.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProfile.mintedNFTs.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getRarityGradient(nft.attributes.find(attr => attr.trait_type === 'Rarity')?.value as string || 'common')}`}>
                      {getRarityIcon(nft.attributes.find(attr => attr.trait_type === 'Rarity')?.value as string || 'common')} {nft.attributes.find(attr => attr.trait_type === 'Rarity')?.value}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{nft.name}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">{nft.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(nft.mintedAt).toLocaleDateString()}
                      </div>
                      {nft.tokenId && (
                        <div className="flex items-center">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          #{nft.tokenId}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Rewards by Category */}
      {Object.entries(categorizedRewards).map(([category, rewards]) => (
        rewards.length > 0 && (
          <div key={category}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward, index) => {
                const isEligible = eligibleRewards.some(r => r.id === reward.id);
                const isMinted = isNFTMinted(reward.id);
                const isCurrentlyMinting = isMinting === reward.id;
                
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl overflow-hidden transition-all hover:shadow-2xl ${
                      isEligible && !isMinted ? 'ring-2 ring-purple-500' : ''
                    }`}>
                      <div className="relative">
                        <img
                          src={reward.image}
                          alt={reward.name}
                          className={`w-full h-48 object-cover transition-all ${
                            !isEligible || isMinted ? 'grayscale opacity-60' : ''
                          }`}
                        />
                        
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getRarityGradient(reward.rarity)}`}>
                          {getRarityIcon(reward.rarity)} {reward.rarity}
                        </div>
                        
                        {isMinted && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              Minted
                            </div>
                          </div>
                        )}
                        
                        {isEligible && !isMinted && (
                          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                            Ready to Mint!
                          </div>
                        )}
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gray-900 dark:text-white">{reward.name}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">{reward.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Requirement:</strong> {getRequirementText(reward)}
                          </div>
                          
                          {isEligible && !isMinted && (
                            <button
                              onClick={() => handleMintNFT(reward)}
                              disabled={isCurrentlyMinting || !walletAddress}
                              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {isCurrentlyMinting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Minting...
                                </>
                              ) : !walletAddress ? (
                                'Connect Wallet First'
                              ) : (
                                <>
                                  <Award className="w-4 h-4 mr-2" />
                                  Mint NFT
                                </>
                              )}
                            </button>
                          )}
                          
                          {!isEligible && !isMinted && (
                            <div className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-xl font-medium text-center">
                              Not Eligible Yet
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )
      ))}
    </div>
  );

  function getRequirementText(reward: NFTReward): string {
    switch (reward.requirement.type) {
      case 'assessments':
        return `Complete ${reward.requirement.value} wellness assessment${reward.requirement.value > 1 ? 's' : ''}`;
      case 'streak':
        return `Maintain ${reward.requirement.value}-day streak`;
      case 'insights':
        return `Receive ${reward.requirement.value} AI insights`;
      case 'mood_score':
        return `Achieve ${reward.requirement.value}% mood score`;
      case 'chat_sessions':
        return `Complete ${reward.requirement.value} chat session${reward.requirement.value > 1 ? 's' : ''}`;
      case 'breathing_exercises':
        return `Complete ${reward.requirement.value} breathing exercise${reward.requirement.value > 1 ? 's' : ''}`;
      case 'memory_games':
        return `Play ${reward.requirement.value} memory game${reward.requirement.value > 1 ? 's' : ''}`;
      case 'math_games':
        return `Complete ${reward.requirement.value} math game${reward.requirement.value > 1 ? 's' : ''}`;
      case 'reaction_games':
        return `Play ${reward.requirement.value} reaction game${reward.requirement.value > 1 ? 's' : ''}`;
      case 'total_score':
        return `Earn ${reward.requirement.value.toLocaleString()} total points`;
      default:
        return 'Unknown requirement';
    }
  }
};

export default NFTGallery;
