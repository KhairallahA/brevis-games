'use client';

import { useState } from 'react';

export default function ChainDetective() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <GameContent />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold text-white mb-4">
        🔍 Chain Detective
      </h1>
      <p className="text-xl text-purple-200">
        Solve cross-chain mysteries using <span className="text-cyan-400 font-semibold">Brevis zkCoprocessor</span>
      </p>
    </div>
  );
}

function GameContent() {
  const [gameState, setGameState] = useState('intro'); // intro, playing, querying, results, solved
  const [selectedMystery, setSelectedMystery] = useState(null);
  const [selectedChains, setSelectedChains] = useState([]);
  const [queryProgress, setQueryProgress] = useState(null);
  const [queryResults, setQueryResults] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentVolumes, setCurrentVolumes] = useState(null);

  const mysteries = [
    {
      id: 1,
      title: "🐋 The Whale Bridge Mystery",
      description: "A mysterious whale bridged 1000 ETH across multiple chains in 24 hours. Track their movements!",
      requiredChains: ['ethereum', 'arbitrum', 'base'],
      correctAnswer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      hint: "Look for large ETH transfers that happened sequentially across Ethereum → Arbitrum → Base",
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "🎯 The Multi-Chain Wash Trading Ring",
      description: "A wash trading ring is operating across 4 chains using multiple wallets to fake volume. Calculate the TOTAL suspicious trading volume in the last 7 days.",
      requiredChains: [], // Will be set dynamically with 4 random chains
      correctAnswer: "0", // Will be calculated dynamically
      hint: "Query the chains shown in the hint, find the suspicious volume on each chain, then ADD them together",
      difficulty: "Medium",
      type: "calculation",
      unit: "USDC"
    }
  ];

  const chains = [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500', icon: '⟠' },
    { id: 'arbitrum', name: 'Arbitrum', color: 'bg-cyan-500', icon: '◆' },
    { id: 'base', name: 'Base', color: 'bg-indigo-500', icon: '⬡' },
    { id: 'optimism', name: 'Optimism', color: 'bg-red-500', icon: '◉' },
    { id: 'polygon', name: 'Polygon', color: 'bg-purple-500', icon: '⬢' }
  ];

  const startMystery = (mysteryToStart) => {
    if (mysteryToStart.id === 2) {
      const allChains = ['Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon'];
      const shuffled = [...allChains].sort(() => Math.random() - 0.5);
      const selectedChainNames = shuffled.slice(0, 4); // Take first 4
      
      const allVolumes = {
        ethereum: (Math.floor(Math.random() * 8) + 10) * 1000000, // 10M-17M
        arbitrum: (Math.floor(Math.random() * 6) + 6) * 1000000,  // 6M-11M
        base: (Math.floor(Math.random() * 10) + 12) * 1000000,    // 12M-21M
        optimism: (Math.floor(Math.random() * 5) + 4) * 1000000,  // 4M-8M
        polygon: (Math.floor(Math.random() * 5) + 3) * 1000000    // 3M-7M
      };
      
      const total = selectedChainNames.reduce((sum, chain) => {
        return sum + allVolumes[chain.toLowerCase()];
      }, 0);
      
      const shuffledOrder = [...selectedChainNames].sort(() => Math.random() - 0.5);
      
      setCurrentVolumes({ ...allVolumes, total, chainOrder: shuffledOrder, selectedChains: selectedChainNames });
      
      const hintText = `Query these 4 chains. Results will show: ${shuffledOrder.join(' → ')}. Add up ALL the suspicious volumes to get the total.`;
      
      const requiredChains = selectedChainNames.map(name => name.toLowerCase());
      
      mysteryToStart = { 
        ...mysteryToStart, 
        correctAnswer: total.toString(),
        hint: hintText,
        requiredChains: requiredChains
      };
    }
    
    setSelectedMystery(mysteryToStart);
    setSelectedChains([]);
    setQueryResults(null);
    setUserAnswer('');
    setGameState('playing');
  };

  const toggleChain = (chainId) => {
    if (selectedChains.includes(chainId)) {
      setSelectedChains(selectedChains.filter(c => c !== chainId));
    } else {
      setSelectedChains([...selectedChains, chainId]);
    }
  };

  const runBrevisQuery = async () => {
    if (selectedChains.length === 0) {
      alert('Please select at least one chain to query!');
      return;
    }

    const requiredChains = selectedMystery.requiredChains;
    const hasAllRequired = requiredChains.every(chain => selectedChains.includes(chain));
    
    if (!hasAllRequired) {
      const missing = requiredChains.filter(chain => !selectedChains.includes(chain));
      const missingNames = missing.map(id => chains.find(c => c.id === id).name).join(', ');
      alert(`❌ No data found! You're missing: ${missingNames}\n\nHint: The pulsing chains are involved in this mystery.`);
      return;
    }

    setGameState('querying');
    
    const steps = [
      { step: 1, name: 'Query Submission', description: 'Submitting cross-chain query to Brevis...', duration: 500 },
      { step: 2, name: 'Data Collection', description: `Collecting historical data from ${selectedChains.length} chains...`, duration: 1000 },
      { step: 3, name: 'ZK Proof Generation', description: 'Generating zero-knowledge proof of computation...', duration: 1500 },
      { step: 4, name: 'Verification', description: 'Verifying proof on-chain...', duration: 800 },
      { step: 5, name: 'Results Ready', description: 'Query complete! Delivering verified results...', duration: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      setQueryProgress(steps[i]);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    const results = generateMockResults(selectedMystery, selectedChains);
    setQueryResults(results);
    setGameState('results');
  };

  const generateMockResults = (mystery, chains) => {
    if (mystery.id === 1) {
      return {
        totalTransactions: 3,
        timeRange: '24 hours',
        suspectWallet: mystery.correctAnswer,
        transactions: [
          {
            chain: 'Ethereum',
            type: 'Bridge Out',
            amount: '1000 ETH',
            timestamp: '2024-10-20 14:23:15 UTC',
            txHash: '0xabc...123',
            to: 'Arbitrum Bridge'
          },
          {
            chain: 'Arbitrum',
            type: 'Bridge In',
            amount: '999.8 ETH',
            timestamp: '2024-10-20 14:35:42 UTC',
            txHash: '0xdef...456',
            from: 'Ethereum Bridge'
          },
          {
            chain: 'Arbitrum',
            type: 'Bridge Out',
            amount: '999.8 ETH',
            timestamp: '2024-10-20 18:12:33 UTC',
            txHash: '0xghi...789',
            to: 'Base Bridge'
          },
          {
            chain: 'Base',
            type: 'Bridge In',
            amount: '999.6 ETH',
            timestamp: '2024-10-20 18:24:11 UTC',
            txHash: '0xjkl...012',
            from: 'Arbitrum Bridge'
          }
        ],
        proofVerified: true,
        zkProofHash: '0x9f8e7d6c5b4a3210fedcba9876543210abcdef1234567890'
      };
    } else {
      const volumes = currentVolumes;
      const formatNumber = (num) => num.toLocaleString('en-US');
      
      const chainDataMap = {
        'Ethereum': {
          volume: volumes.ethereum,
          type: 'Wash Trade',
          amount: '142 suspicious trades',
          txHash: '0xeth...001',
          description: 'Wallet A ↔ Wallet B back-and-forth'
        },
        'Arbitrum': {
          volume: volumes.arbitrum,
          type: 'Wash Trade',
          amount: '98 suspicious trades',
          txHash: '0xarb...002',
          description: 'Wallet B ↔ Wallet C circular pattern'
        },
        'Base': {
          volume: volumes.base,
          type: 'Wash Trade',
          amount: '187 suspicious trades',
          txHash: '0xbase...003',
          description: 'Wallet C ↔ Wallet D coordinated timing'
        },
        'Optimism': {
          volume: volumes.optimism,
          type: 'Wash Trade',
          amount: '73 suspicious trades',
          txHash: '0xopt...004',
          description: 'Wallet D ↔ Wallet A loop closure'
        },
        'Polygon': {
          volume: volumes.polygon,
          type: 'Wash Trade',
          amount: '64 suspicious trades',
          txHash: '0xpoly...005',
          description: 'Wallet A ↔ Wallet C cross-ring activity'
        }
      };
      
      const transactions = volumes.chainOrder.map(chainName => {
        const data = chainDataMap[chainName];
        return {
          chain: chainName,
          type: data.type,
          amount: data.amount,
          timestamp: '2024-10-18 - 2024-10-25',
          txHash: data.txHash,
          description: data.description,
          suspiciousVolume: `${formatNumber(data.volume)} USDC`
        };
      });
      
      return {
        totalTransactions: 23,
        timeRange: '7 days',
        washTradingRing: [
          '0x1a2b...3c4d',
          '0x5e6f...7g8h',
          '0x9i0j...1k2l',
          '0x3m4n...5o6p'
        ],
        transactions,
        totalSuspiciousVolume: `${formatNumber(volumes.total)} USDC`,
        proofVerified: true,
        zkProofHash: '0x7f8e9d0c1b2a3456789abcdef0123456789fedcba'
      };
    }
  };

  const submitAnswer = () => {
    const cleanAnswer = userAnswer.toLowerCase().trim().replace(/,/g, '');
    const correctAnswer = selectedMystery.correctAnswer.toLowerCase().trim();
    
    if (cleanAnswer === correctAnswer) {
      setGameState('solved');
    } else {
      if (selectedMystery.type === 'calculation') {
        alert('❌ Incorrect amount. Remember to ADD UP all suspicious volume from ALL 5 chains: Ethereum + Arbitrum + Base + Optimism + Polygon. Try again or click "Reveal Answer" for help.');
      } else {
        alert('❌ Incorrect wallet address. Try again or click "Reveal Answer" for help.');
      }
    }
  };

  const revealAnswer = () => {
    setUserAnswer(selectedMystery.correctAnswer);
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome, Detective! 🕵️</h2>
          <p className="text-purple-100 text-lg mb-6">
            You&apos;re about to solve cross-chain mysteries using <span className="text-cyan-400 font-semibold">Brevis zkCoprocessor</span> - 
            the most powerful tool for querying historical blockchain data across multiple chains.
          </p>
          
          <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-3">🚀 How Brevis Works (Real World)</h3>
            <ol className="space-y-2 text-purple-100">
              <li><span className="text-cyan-400 font-semibold">1. Query Submission:</span> You submit a cross-chain data query</li>
              <li><span className="text-cyan-400 font-semibold">2. Data Collection:</span> Brevis collects historical data from multiple blockchains</li>
              <li><span className="text-cyan-400 font-semibold">3. ZK Proof Generation:</span> Brevis generates a zero-knowledge proof of the computation</li>
              <li><span className="text-cyan-400 font-semibold">4. Verification:</span> The proof is verified on-chain (trustless!)</li>
              <li><span className="text-cyan-400 font-semibold">5. Results Delivery:</span> Verified data is delivered to your smart contract or dApp</li>
            </ol>
          </div>

          <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-purple-300 mb-3">💡 Why This Matters</h3>
            <ul className="space-y-2 text-purple-100">
              <li>✅ <span className="font-semibold">No Archive Nodes:</span> Access any historical data without running expensive infrastructure</li>
              <li>✅ <span className="font-semibold">Cross-Chain:</span> Query Ethereum, Arbitrum, Base, Optimism, Polygon simultaneously</li>
              <li>✅ <span className="font-semibold">Trustless:</span> ZK proofs ensure data integrity without trusting oracles</li>
              <li>✅ <span className="font-semibold">Fast:</span> What takes hours manually takes seconds with Brevis</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mysteries.map(mystery => (
            <div key={mystery.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-cyan-400/50 transition-all cursor-pointer"
                 onClick={() => startMystery(mystery)}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-white">{mystery.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  mystery.difficulty === 'Easy' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'
                }`}>
                  {mystery.difficulty}
                </span>
              </div>
              <p className="text-purple-100 mb-4">{mystery.description}</p>
              <button className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all">
                Start Investigation →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="max-w-6xl mx-auto">
        <button onClick={() => setGameState('intro')} className="mb-6 text-purple-300 hover:text-white transition-colors">
          ← Back to Cases
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-2">{selectedMystery.title}</h2>
          <p className="text-purple-100 text-lg mb-4">{selectedMystery.description}</p>
          <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-4">
            <p className="text-cyan-300"><span className="font-semibold">💡 Hint:</span> {selectedMystery.hint}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-6">Select Chains to Query</h3>
          <p className="text-purple-200 mb-6">Choose which blockchains you want Brevis to search for historical data:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {chains.map(chain => {
              const isSelected = selectedChains.includes(chain.id);
              const isRequired = selectedMystery.requiredChains.includes(chain.id);
              
              return (
                <button
                  key={chain.id}
                  onClick={() => toggleChain(chain.id)}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'border-cyan-400 bg-cyan-500/30 scale-105' 
                      : 'border-purple-500/30 bg-white/5 hover:border-purple-400/50'
                  } ${isRequired && !isSelected ? 'animate-pulse' : ''}`}
                >
                  <div className="text-4xl mb-2">{chain.icon}</div>
                  <div className="text-white font-semibold">{chain.name}</div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-cyan-400 text-xl">✓</div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedChains.length > 0 && (
            <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4 mb-6">
              <p className="text-purple-200">
                <span className="font-semibold">Selected:</span> {selectedChains.map(id => chains.find(c => c.id === id).name).join(', ')}
              </p>
            </div>
          )}

          <button 
            onClick={runBrevisQuery}
            disabled={selectedChains.length === 0}
            className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white font-bold text-xl py-4 rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Run Brevis Query
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'querying') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-cyan-500/50">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Brevis zkCoprocessor Running...
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>

            {queryProgress && (
              <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-300 font-semibold text-lg">Step {queryProgress.step}/5: {queryProgress.name}</span>
                  <span className="text-cyan-400 text-2xl">⚡</span>
                </div>
                <p className="text-purple-100">{queryProgress.description}</p>
              </div>
            )}

            <div className="bg-purple-500/20 border border-purple-400/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">What&apos;s Happening Behind the Scenes:</h3>
              <ul className="space-y-2 text-purple-100 text-sm">
                <li>• Brevis nodes are fetching block headers and transaction data from {selectedChains.length} chains</li>
                <li>• Computing merkle proofs to verify data authenticity</li>
                <li>• Running zkVM circuits to generate cryptographic proof</li>
                <li>• Proof will be verifiable on-chain without revealing raw data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-green-500/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white">✅ Query Complete!</h2>
            <div className="bg-green-500/30 border border-green-400 rounded-lg px-4 py-2">
              <span className="text-green-300 font-semibold">ZK Proof Verified</span>
            </div>
          </div>
          <p className="text-purple-100 mb-4">
            Brevis has successfully queried {selectedChains.length} blockchains and generated a verified zero-knowledge proof.
          </p>
          <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-4 font-mono text-sm">
            <p className="text-cyan-300"><span className="font-semibold">Proof Hash:</span> {queryResults.zkProofHash}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">📊 Query Summary</h3>
            <div className="space-y-2 text-purple-100">
              <p><span className="font-semibold">Total Transactions:</span> {queryResults.totalTransactions}</p>
              <p><span className="font-semibold">Time Range:</span> {queryResults.timeRange}</p>
              <p><span className="font-semibold">Chains Queried:</span> {selectedChains.length}</p>
              {queryResults.suspectWallet && (
                <p><span className="font-semibold">Suspect Wallet:</span> <span className="text-cyan-400 font-mono text-sm">{queryResults.suspectWallet}</span></p>
              )}
              {queryResults.totalSuspiciousVolume && (
                <p><span className="font-semibold">Total Suspicious Volume:</span> <span className="text-red-400 font-semibold">{queryResults.totalSuspiciousVolume}</span></p>
              )}
              {queryResults.washTradingRing && (
                <div>
                  <p className="font-semibold mb-1">Wash Trading Ring Wallets:</p>
                  <div className="flex flex-wrap gap-2">
                    {queryResults.washTradingRing.map((wallet, idx) => (
                      <span key={idx} className="text-cyan-400 font-mono text-xs bg-cyan-500/20 px-2 py-1 rounded">{wallet}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">⚡ Performance</h3>
            <div className="space-y-3">
              <div>
                <p className="text-purple-200 mb-1">Without Brevis (Manual):</p>
                <p className="text-red-400 font-bold text-2xl">{selectedMystery.id === 2 ? '~12 hours' : '~2 hours'}</p>
                <p className="text-purple-300 text-sm">{selectedMystery.id === 2 ? 'Check 5 block explorers + manual calculation' : 'Check each block explorer manually, no verification'}</p>
              </div>
              <div>
                <p className="text-purple-200 mb-1">With Brevis zkCoprocessor:</p>
                <p className="text-green-400 font-bold text-2xl">{selectedMystery.id === 2 ? '~8 seconds' : '~4 seconds'}</p>
                <p className="text-purple-300 text-sm">Automated query + ZK proof verification</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4">🔍 Cross-Chain {selectedMystery.id === 2 ? 'Wash Trading Activity' : 'Transaction History'}</h3>
          <div className="space-y-3">
            {queryResults.transactions.map((tx, idx) => (
              <div key={idx} className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-cyan-400 font-semibold">{tx.chain}</span>
                    <span className="text-purple-300 mx-2">•</span>
                    <span className="text-white font-semibold">{tx.type}</span>
                  </div>
                  <span className="text-purple-300 text-sm">{tx.timestamp}</span>
                </div>
                <p className="text-purple-100 mb-1"><span className="font-semibold">Amount:</span> {tx.amount}</p>
                {tx.description && <p className="text-purple-100 mb-1"><span className="font-semibold">Pattern:</span> {tx.description}</p>}
                {tx.suspiciousVolume && <p className="text-red-400 font-bold mb-1"><span className="font-semibold">Suspicious Volume:</span> {tx.suspiciousVolume}</p>}
                {tx.protocol && <p className="text-purple-100 mb-1"><span className="font-semibold">Protocol:</span> {tx.protocol}</p>}
                {tx.to && <p className="text-purple-100 mb-1"><span className="font-semibold">To:</span> {tx.to}</p>}
                {tx.from && <p className="text-purple-100 mb-1"><span className="font-semibold">From:</span> {tx.from}</p>}
                <p className="text-cyan-400 text-sm font-mono">{tx.txHash}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">🎯 Now Solve the Mystery!</h3>
          {selectedMystery.type === 'calculation' ? (
            <>
              <p className="text-purple-100 mb-2">
                Based on the cross-chain data above, what is the <span className="text-cyan-400 font-semibold">TOTAL suspicious trading volume</span> across all 5 chains?
              </p>
              <p className="text-purple-300 text-sm mb-4">
                💡 Hint: Look at each chain&apos;s suspicious volume above, then add them ALL together (don&apos;t include commas in your answer)
              </p>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={`Enter total amount (just the number, no commas)`}
                className="w-full bg-white/10 border border-purple-400/50 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 mb-4 focus:outline-none focus:border-cyan-400"
              />
            </>
          ) : (
            <>
              <p className="text-purple-100 mb-4">Based on the cross-chain data above, what is the wallet address of the suspect?</p>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter wallet address (0x...)"
                className="w-full bg-white/10 border border-purple-400/50 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 mb-4 focus:outline-none focus:border-cyan-400"
              />
            </>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={submitAnswer}
              className="flex-1 bg-linear-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all"
            >
              Submit Answer
            </button>
            <button
              onClick={revealAnswer}
              className="px-6 bg-white/10 border border-purple-400/50 text-purple-200 font-semibold py-3 rounded-lg hover:bg-white/20 transition-all"
            >
              Reveal Answer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'solved') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-linear-to-br from-green-500/20 to-cyan-500/20 border-2 border-green-400 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-white mb-4">Mystery Solved!</h2>
          <p className="text-xl text-purple-100 mb-8">
            Excellent detective work! You successfully used Brevis zkCoprocessor to track cross-chain activity.
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 text-left">
            <h3 className="text-2xl font-bold text-white mb-4">🎓 What You Learned:</h3>
            <ul className="space-y-3 text-purple-100">
              <li>✅ <span className="font-semibold">Cross-Chain Queries:</span> Brevis can query historical data from multiple blockchains simultaneously</li>
              <li>✅ <span className="font-semibold">ZK Proofs:</span> All data is cryptographically verified without revealing sensitive information</li>
              <li>✅ <span className="font-semibold">Speed:</span> What takes hours manually takes seconds with Brevis</li>
              <li>✅ <span className="font-semibold">Trustless:</span> No need to trust centralized oracles - math guarantees correctness</li>
              <li>✅ <span className="font-semibold">Real Use Cases:</span> Track whales, analyze DeFi activity, verify user behavior across chains</li>
            </ul>
          </div>

          <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-cyan-300 mb-3">🚀 Real-World Applications:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left text-purple-100">
              <div>
                <p className="font-semibold text-white mb-1">Credit Scoring:</p>
                <p className="text-sm">Verify user&apos;s DeFi history across all chains for lending protocols</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Airdrop Verification:</p>
                <p className="text-sm">Verify eligibility based on cross-chain activity</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Analytics:</p>
                <p className="text-sm">Build dashboards showing real-time cross-chain metrics</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Compliance:</p>
                <p className="text-sm">Track suspicious activity across multiple networks</p>
              </div>
            </div>
        </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setGameState('intro')}
              className="bg-linear-to-r from-cyan-500 to-purple-500 text-white font-bold px-8 py-3 rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all"
            >
              Solve Another Mystery
            </button>
            <a
              href="https://brevis.network"
            target="_blank"
            rel="noopener noreferrer"
              className="bg-white/10 border border-purple-400/50 text-purple-200 font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-all"
          >
              Learn More About Brevis →
          </a>
          </div>
        </div>
    </div>
  );
  }

  return null;
}
