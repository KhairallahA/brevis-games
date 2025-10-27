'use client';

import { useState } from 'react';

export default function BlockchainTimeMachine() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900">
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
        ⏰ Blockchain Time Machine
          </h1>
      <p className="text-xl text-purple-200">
        Query any moment in blockchain history using <span className="text-cyan-400 font-semibold">Brevis zkCoprocessor</span>
      </p>
    </div>
  );
}

function GameContent() {
  const [gameState, setGameState] = useState('intro'); // intro, mission, querying, results
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [queryProgress, setQueryProgress] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  const missions = [
    {
      id: 1,
      title: "🦄 Uniswap TVL Snapshot",
      question: "What was Uniswap's Total Value Locked (TVL) on Ethereum on January 1, 2024?",
      chain: "ethereum",
      date: "2024-01-01",
      correctAnswer: "$4.2B",
      difficulty: "Easy",
      historicalData: {
        tvl: "4,200,000,000",
        volume24h: "1,100,000,000",
        topPairs: ["ETH/USDC", "WBTC/ETH", "ETH/USDT"],
        activeUsers: "45,230"
      }
    },
    {
      id: 2,
      title: "🌉 Arbitrum Bridge Activity",
      question: "How much ETH was bridged to Arbitrum on March 15, 2024?",
      chain: "arbitrum",
      date: "2024-03-15",
      correctAnswer: "12,500 ETH",
      difficulty: "Medium",
      historicalData: {
        totalBridged: "12,500",
        transactions: "3,420",
        avgAmount: "3.65 ETH",
        largestBridge: "500 ETH"
      }
    },
    {
      id: 3,
      title: "🔷 Base Launch Day",
      question: "How many unique wallets were active on Base on August 9, 2023 (launch day)?",
      chain: "base",
      date: "2023-08-09",
      correctAnswer: "136,000",
      difficulty: "Hard",
      historicalData: {
        uniqueWallets: "136,000",
        transactions: "450,000",
        gasUsed: "2.5M Gwei",
        topDapp: "Friend.tech"
      }
    }
  ];

  const chains = [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500', icon: '⟠', launched: '2015-07-30' },
    { id: 'arbitrum', name: 'Arbitrum', color: 'bg-cyan-500', icon: '◆', launched: '2021-08-31' },
    { id: 'base', name: 'Base', color: 'bg-indigo-500', icon: '⬡', launched: '2023-08-09' },
    { id: 'optimism', name: 'Optimism', color: 'bg-red-500', icon: '◉', launched: '2021-12-16' },
  ];

  const startMission = (mission) => {
    setSelectedMission(mission);
    setSelectedChain(null);
    setSelectedDate(null);
    setQueryResult(null);
    setGameState('mission');
  };

  // Seeded random number generator (deterministic based on chain + date)
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const generateHistoricalData = (chain, date, missionType) => {
    // Create a unique seed from chain ID and date
    const chainSeed = chain.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dateSeed = new Date(date).getTime();
    const seed = chainSeed + dateSeed;

    // Generate deterministic "random" values based on seed
    const rand1 = seededRandom(seed);
    const rand2 = seededRandom(seed * 1.5);
    const rand3 = seededRandom(seed * 2);
    const rand4 = seededRandom(seed * 2.5);

    // Generate different data based on mission type
    if (missionType === 1) {
      // Uniswap TVL - varies by chain and date
      const baseTVL = 2000000000 + (rand1 * 4000000000); // 2B-6B range
      const volume = baseTVL * 0.2 * (0.8 + rand2 * 0.4); // 16-24% of TVL
      const users = Math.floor(20000 + rand3 * 60000); // 20k-80k users
      
      return {
        tvl: Math.floor(baseTVL).toLocaleString(),
        volume24h: Math.floor(volume).toLocaleString(),
        topPairs: ['ETH/USDC', 'WBTC/ETH', 'ETH/USDT'],
        activeUsers: users.toLocaleString()
      };
    } else if (missionType === 2) {
      // Bridge activity - varies by chain and date
      const bridged = 5000 + (rand1 * 20000); // 5k-25k ETH
      const txCount = Math.floor(1000 + rand2 * 5000); // 1k-6k transactions
      const avgAmount = bridged / txCount;
      const largestBridge = Math.floor(avgAmount * (5 + rand3 * 10)); // 5-15x average
      
      return {
        totalBridged: Math.floor(bridged).toLocaleString(),
        transactions: txCount.toLocaleString(),
        avgAmount: avgAmount.toFixed(2) + ' ETH',
        largestBridge: largestBridge.toFixed(0) + ' ETH'
      };
    } else {
      // Launch day / wallet activity - varies by chain and date
      const wallets = Math.floor(50000 + rand1 * 200000); // 50k-250k wallets
      const txCount = Math.floor(wallets * (2 + rand2 * 3)); // 2-5 tx per wallet
      const gasUsed = (txCount * (0.00002 + rand3 * 0.00003)).toFixed(1); // Variable gas
      
      return {
        uniqueWallets: wallets.toLocaleString(),
        transactions: txCount.toLocaleString(),
        gasUsed: gasUsed + 'M Gwei',
        topDapp: rand4 > 0.5 ? 'Friend.tech' : 'Uniswap'
      };
    }
  };

  const runQuery = async () => {
    if (!selectedChain || !selectedDate) {
      alert('Please select both a chain and a date!');
      return;
    }

    setGameState('querying');
    
    // Simulate real Brevis zkCoprocessor workflow for historical queries
    const steps = [
      { step: 1, name: 'Time Travel Request', description: `Requesting historical state from ${selectedChain.name} at ${selectedDate}...`, duration: 600 },
      { step: 2, name: 'Block Header Retrieval', description: 'Fetching block headers from target timestamp...', duration: 1000 },
      { step: 3, name: 'State Root Verification', description: 'Verifying Merkle state root at historical block...', duration: 1200 },
      { step: 4, name: 'ZK Proof Generation', description: 'Generating zero-knowledge proof of historical state...', duration: 1500 },
      { step: 5, name: 'Data Extraction', description: 'Extracting requested data with cryptographic verification...', duration: 800 }
    ];

    for (let i = 0; i < steps.length; i++) {
      setQueryProgress(steps[i]);
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
    }

    // Generate deterministic historical data based on chain + date
    const historicalData = generateHistoricalData(selectedChain, selectedDate, selectedMission.id);

    // Create seed for block number and proof hash
    const chainSeed = selectedChain.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dateSeed = new Date(selectedDate).getTime();
    const combinedSeed = chainSeed + dateSeed;

    // Generate result with deterministic values
    const result = {
      chain: selectedChain.name,
      date: selectedDate,
      data: historicalData,
      blockNumber: Math.floor(15000000 + (seededRandom(combinedSeed) * 5000000)),
      zkProofHash: `0x${(combinedSeed * seededRandom(combinedSeed * 1.3)).toString(16).substring(0, 40)}`,
      verificationTime: `${(3 + seededRandom(combinedSeed * 1.7) * 2).toFixed(1)}s`,
      proofSize: `${Math.floor(200 + seededRandom(combinedSeed * 2.1) * 50)} KB`
    };

    setQueryResult(result);
    setGameState('results');
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Time Machine! ⏰</h2>
          <p className="text-purple-100 text-lg">
            With <span className="text-cyan-400 font-semibold">Brevis zkCoprocessor</span>, you can query ANY historical blockchain state - 
            without running archive nodes or trusting centralized indexers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {missions.map(mission => (
            <div 
              key={mission.id} 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-cyan-400/50 transition-all cursor-pointer"
              onClick={() => startMission(mission)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  mission.difficulty === 'Easy' ? 'bg-green-500/30 text-green-300' : 
                  mission.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-300' : 
                  'bg-red-500/30 text-red-300'
                }`}>
                  {mission.difficulty}
                </span>
              </div>
              <p className="text-purple-100 text-sm mb-4">{mission.question}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className={`${chains.find(c => c.id === mission.chain).color} w-3 h-3 rounded-full`}></span>
                <span className="text-purple-300 text-sm">{chains.find(c => c.id === mission.chain).name}</span>
                <span className="text-purple-400 text-sm">• {mission.date}</span>
              </div>
              <button className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white font-semibold py-2 rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all text-sm">
                Start Time Travel →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'mission') {
    const missionChain = chains.find(c => c.id === selectedMission.chain);
    
    return (
      <div className="max-w-6xl mx-auto">
        <button onClick={() => setGameState('intro')} className="mb-6 text-purple-300 hover:text-white transition-colors">
          ← Back to Missions
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold text-white mb-2">{selectedMission.title}</h2>
          <p className="text-purple-100 text-xl mb-4">{selectedMission.question}</p>
          <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-4">
            <p className="text-cyan-300"><span className="font-semibold">🎯 Your Mission:</span> Use Brevis to query historical blockchain state and find the answer!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Chain Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">Select Blockchain</h3>
            <div className="space-y-3">
              {chains.map(chain => {
                const isSelected = selectedChain?.id === chain.id;
                const isCorrect = chain.id === selectedMission.chain;
                
                return (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-500/30' 
                        : 'border-purple-500/30 bg-white/5 hover:border-purple-400/50'
                    } ${isCorrect && !isSelected ? 'animate-pulse' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{chain.icon}</span>
                        <div>
                          <div className="text-white font-semibold">{chain.name}</div>
                          <div className="text-purple-300 text-xs">Launched: {chain.launched}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-cyan-400 text-xl">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-6">Select Date</h3>
            <p className="text-purple-200 mb-4">Choose the historical date you want to query:</p>
            
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={selectedChain ? selectedChain.launched : '2015-07-30'}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-white/10 border border-purple-400/50 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-cyan-400"
            />

            {selectedDate && (
              <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-4 mb-4">
                <p className="text-purple-200 text-sm">
                  <span className="font-semibold">Selected:</span> {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}

            {selectedChain && selectedDate && (
              <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-4">
                <p className="text-cyan-300 text-sm">
                  <span className="font-semibold">Ready to query:</span> {selectedChain.name} state at {selectedDate}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={runQuery}
            disabled={!selectedChain || !selectedDate}
            className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white font-bold text-xl py-4 rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⏰ Travel Back in Time with Brevis
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
            Brevis Time Machine Activating...
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
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
              <h3 className="text-lg font-semibold text-purple-300 mb-3">What&apos;s Happening:</h3>
              <ul className="space-y-2 text-purple-100 text-sm">
                <li>• Brevis is accessing historical block data from {selectedChain.name}</li>
                <li>• Verifying Merkle proofs to ensure data authenticity</li>
                <li>• Running zkVM to generate cryptographic proof of historical state</li>
                <li>• No archive nodes needed - Brevis does the heavy lifting!</li>
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
            <h2 className="text-3xl font-bold text-white">✅ Time Travel Complete!</h2>
            <div className="bg-green-500/30 border border-green-400 rounded-lg px-4 py-2">
              <span className="text-green-300 font-semibold">ZK Proof Verified</span>
            </div>
          </div>
          <p className="text-purple-100 mb-4">
            Successfully queried {queryResult.chain} historical state at {queryResult.date}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-4">
              <p className="text-cyan-300 text-sm"><span className="font-semibold">Block Number:</span> #{queryResult.blockNumber.toLocaleString()}</p>
            </div>
            <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-4">
              <p className="text-cyan-300 text-sm"><span className="font-semibold">Proof Hash:</span> {queryResult.zkProofHash.substring(0, 20)}...</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">📊 Historical Data Retrieved</h3>
            <div className="space-y-3">
              {Object.entries(queryResult.data).map(([key, value]) => (
                <div key={key} className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3">
                  <p className="text-purple-300 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</p>
                  <p className="text-white font-semibold text-lg">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">⚡ Performance</h3>
            <div className="space-y-4">
              <div>
                <p className="text-purple-200 mb-1">Without Brevis (Manual):</p>
                <p className="text-red-400 font-bold text-2xl">~4 hours</p>
                <p className="text-purple-300 text-sm">Set up archive node (10TB+), sync historical data, manual indexing</p>
              </div>
              <div>
                <p className="text-purple-200 mb-1">With Brevis zkCoprocessor:</p>
                <p className="text-green-400 font-bold text-2xl">{queryResult.verificationTime}</p>
                <p className="text-purple-300 text-sm">Instant query + ZK proof verification</p>
              </div>
              <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-3">
                <p className="text-cyan-300 text-sm">
                  <span className="font-semibold">Proof Size:</span> {queryResult.proofSize} (compact!)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400 rounded-xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">🎯 Mission Answer</h3>
          <p className="text-purple-100 mb-4">{selectedMission.question}</p>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-cyan-400 font-bold text-3xl">{selectedMission.correctAnswer}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setGameState('intro')}
            className="bg-linear-to-r from-cyan-500 to-purple-500 text-white font-bold px-8 py-3 rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all"
          >
            Try Another Mission
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
  );
  }

  return null;
}
