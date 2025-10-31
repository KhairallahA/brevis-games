'use client'

import { useState } from 'react'

export default function PicoCircuitBuilder() {
  const [gameState, setGameState] = useState('intro') // intro, challenge-select, building, proving, results
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [selectedModules, setSelectedModules] = useState([])
  const [selectedBackend, setSelectedBackend] = useState(null)
  const [provingProgress, setProvingProgress] = useState([])
  const [proofResult, setProofResult] = useState(null)
  const [circuitConnections, setCircuitConnections] = useState([])

  // Pico Modules (Coprocessors) - Based on real Pico architecture
  const modules = [
    {
      id: 'receipt',
      name: 'Receipt Module',
      icon: '📜',
      description: 'Verify transaction receipts and logs',
      color: 'from-blue-500 to-blue-600',
      inputs: ['Transaction Hash'],
      outputs: ['Receipt Data', 'Event Logs']
    },
    {
      id: 'storage',
      name: 'Storage Module',
      icon: '💾',
      description: 'Access contract storage slots',
      color: 'from-purple-500 to-purple-600',
      inputs: ['Contract Address', 'Storage Slot'],
      outputs: ['Storage Value']
    },
    {
      id: 'transaction',
      name: 'Transaction Module',
      icon: '🔄',
      description: 'Query transaction data',
      color: 'from-green-500 to-green-600',
      inputs: ['Block Number', 'Transaction Index'],
      outputs: ['Transaction Data']
    },
    {
      id: 'event',
      name: 'Event Module',
      icon: '📡',
      description: 'Filter and parse blockchain events',
      color: 'from-orange-500 to-orange-600',
      inputs: ['Contract Address', 'Event Signature'],
      outputs: ['Event Data']
    },
    {
      id: 'compute',
      name: 'Compute Module',
      icon: '⚡',
      description: 'Custom computation logic',
      color: 'from-red-500 to-red-600',
      inputs: ['Input Data'],
      outputs: ['Computed Result']
    }
  ]

  // Proving Backends - Real Pico options
  const backends = [
    {
      id: 'sp1',
      name: 'SP1',
      speed: 'Fast',
      description: 'Optimized for speed',
      icon: '🚀',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'risc0',
      name: 'RISC Zero',
      speed: 'Balanced',
      description: 'Balanced performance',
      icon: '⚖️',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'custom',
      name: 'Custom Backend',
      speed: 'Flexible',
      description: 'Application-specific optimization',
      icon: '🔧',
      color: 'from-violet-500 to-fuchsia-500'
    }
  ]

  // Challenges - Real-world Pico use cases
  const challenges = [
    {
      id: 1,
      title: 'Balance Proof',
      difficulty: 'Easy',
      description: 'Prove a wallet balance exceeds a threshold without revealing the exact amount',
      requiredModules: ['storage', 'compute'],
      hint: 'Use Storage Module to get balance, then Compute Module to verify threshold',
      successCriteria: 'Circuit must read balance and prove balance > 1000 ETH',
      realWorldUse: 'Credit scoring, collateral verification'
    },
    {
      id: 2,
      title: 'Transaction History Proof',
      difficulty: 'Medium',
      description: 'Prove a wallet made at least 10 transactions in the last 30 days',
      requiredModules: ['transaction', 'receipt', 'compute'],
      hint: 'Query transactions, verify receipts, count valid transactions',
      successCriteria: 'Circuit must count transactions and prove count >= 10',
      realWorldUse: 'Airdrop eligibility, user activity verification'
    },
    {
      id: 3,
      title: 'Cross-Contract Event Proof',
      difficulty: 'Hard',
      description: 'Prove a user interacted with 3+ DeFi protocols (Uniswap, Aave, Compound)',
      requiredModules: ['event', 'receipt', 'storage', 'compute'],
      hint: 'Filter events from multiple contracts, verify interactions, aggregate results',
      successCriteria: 'Circuit must detect events from 3+ different protocols',
      realWorldUse: 'DeFi reputation, protocol loyalty rewards'
    }
  ]

  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge)
    setSelectedModules([])
    setSelectedBackend(null)
    setCircuitConnections([])
    setProvingProgress([])
    setProofResult(null)
    setGameState('building')
  }

  const toggleModule = (moduleId) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId))
      // Remove connections involving this module
      setCircuitConnections(circuitConnections.filter(conn => 
        conn.from !== moduleId && conn.to !== moduleId
      ))
    } else {
      setSelectedModules([...selectedModules, moduleId])
    }
  }

  const selectBackend = (backendId) => {
    setSelectedBackend(backendId)
  }

  const connectModules = (fromId, toId) => {
    const newConnection = { from: fromId, to: toId }
    if (!circuitConnections.find(c => c.from === fromId && c.to === toId)) {
      setCircuitConnections([...circuitConnections, newConnection])
    }
  }

  const runProving = async () => {
    if (!selectedBackend) {
      alert('Please select a proving backend!')
      return
    }

    if (selectedModules.length === 0) {
      alert('Please add at least one module to your circuit!')
      return
    }

    setGameState('proving')
    setProvingProgress([])

    const steps = [
      { name: 'Circuit Assembly', description: 'Assembling selected modules into circuit', duration: 800 },
      { name: 'Module Compilation', description: 'Compiling modules with ' + backends.find(b => b.id === selectedBackend).name, duration: 1000 },
      { name: 'Witness Generation', description: 'Generating computation witness', duration: 1200 },
      { name: 'ZK Proof Generation', description: 'Creating zero-knowledge proof', duration: 1500 },
      { name: 'Proof Verification', description: 'Verifying proof validity', duration: 700 }
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      setProvingProgress(prev => [...prev, { ...steps[i], status: 'complete' }])
    }

    // Check if circuit is correct
    const requiredModules = challenges.find(c => c.id === selectedChallenge.id).requiredModules
    const hasAllRequired = requiredModules.every(req => selectedModules.includes(req))
    
    const success = hasAllRequired
    const proofHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    setProofResult({
      success,
      proofHash,
      gasUsed: success ? Math.floor(Math.random() * 50000 + 150000) : 0,
      provingTime: steps.reduce((sum, s) => sum + s.duration, 0) / 1000,
      modulesUsed: selectedModules.length,
      backend: backends.find(b => b.id === selectedBackend).name,
      feedback: success 
        ? '✅ Circuit correct! All required modules connected properly.'
        : `❌ Circuit incomplete. Missing modules: ${requiredModules.filter(r => !selectedModules.includes(r)).join(', ')}`
    })

    setGameState('results')
  }

  const resetChallenge = () => {
    setGameState('challenge-select')
    setSelectedChallenge(null)
    setSelectedModules([])
    setSelectedBackend(null)
    setCircuitConnections([])
    setProvingProgress([])
    setProofResult(null)
  }

  // INTRO SCREEN
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Pico Circuit Builder
            </h1>
            <p className="text-2xl text-purple-200">Build Zero-Knowledge Circuits with Brevis Pico zkVM</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">How Pico Works</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Select Modules', desc: 'Choose coprocessors (Receipt, Storage, Transaction, Event, Compute)', icon: '🧩' },
                { step: 2, title: 'Assemble Circuit', desc: 'Connect modules to create your custom ZK circuit', icon: '🔗' },
                { step: 3, title: 'Choose Backend', desc: 'Select proving backend (SP1, RISC Zero, or custom)', icon: '⚙️' },
                { step: 4, title: 'Compile & Prove', desc: 'Pico compiles your circuit and generates ZK proof', icon: '⚡' },
                { step: 5, title: 'Verify', desc: 'Proof is verified on-chain (trustless!)', icon: '✅' }
              ].map(({ step, title, desc, icon }) => (
                <div key={step} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl">{icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-cyan-400 font-bold text-lg">Step {step}</span>
                      <h3 className="text-xl font-semibold text-white">{title}</h3>
                    </div>
                    <p className="text-gray-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setGameState('challenge-select')}
            className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white py-6 px-8 rounded-xl text-2xl font-bold hover:from-cyan-400 hover:to-purple-400 transition-all transform hover:scale-105 shadow-2xl hover:cursor-pointer"
          >
            Start Building Circuits →
          </button>
        </div>
      </div>
    )
  }

  // CHALLENGE SELECT SCREEN
  if (gameState === 'challenge-select') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-cyan-300">Choose Your Challenge</h1>
            <p className="text-xl text-gray-300">Build ZK circuits for real-world use cases</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {challenges.map(challenge => (
              <div
                key={challenge.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all cursor-pointer transform hover:scale-105"
                onClick={() => startChallenge(challenge)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{challenge.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                    'bg-red-500/20 text-red-300 border border-red-400/30'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{challenge.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm text-cyan-400 font-semibold mb-2">Required Modules:</p>
                  <div className="flex flex-wrap gap-2">
                    {challenge.requiredModules.map(modId => {
                      const mod = modules.find(m => m.id === modId)
                      return (
                        <span key={modId} className="px-2 py-1 bg-white/10 rounded text-xs text-white border border-white/20">
                          {mod.icon} {mod.name}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
                  <p className="text-xs text-purple-300 font-semibold mb-1">Real-World Use:</p>
                  <p className="text-sm text-gray-300">{challenge.realWorldUse}</p>
                </div>

                <button className="w-full bg-linear-to-r from-cyan-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all hover:cursor-pointer">
                  Start Challenge →
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setGameState('intro')}
            className="text-gray-400 hover:text-white transition-colors hover:cursor-pointer"
          >
            ← Back to Intro
          </button>
        </div>
      </div>
    )
  }

  // BUILDING SCREEN
  if (gameState === 'building') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-cyan-300">{selectedChallenge.title}</h1>
            <p className="text-lg text-gray-300 mb-4">{selectedChallenge.description}</p>
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
              <p className="text-cyan-300">
                <span className="font-semibold">💡 Hint:</span> {selectedChallenge.hint}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Module Library */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">Available Modules</h2>
              <div className="space-y-3">
                {modules.map(mod => (
                  <div
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedModules.includes(mod.id)
                        ? `bg-linear-to-br ${mod.color} border-white shadow-lg transform scale-105`
                        : 'bg-white/5 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{mod.icon}</span>
                      <h3 className="font-bold text-white">{mod.name}</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{mod.description}</p>
                    <div className="text-xs text-gray-400">
                      <div>In: {mod.inputs.join(', ')}</div>
                      <div>Out: {mod.outputs.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Circuit Canvas */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-cyan-300">Your Circuit</h2>
              
              {/* Selected Modules Display */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20 min-h-[300px]">
                {selectedModules.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500 text-center">
                    <div>
                      <div className="text-6xl mb-4">🧩</div>
                      <p className="text-lg">Click modules on the left to add them to your circuit</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedModules.map((modId, index) => {
                      const mod = modules.find(m => m.id === modId)
                      return (
                        <div
                          key={modId}
                          className={`p-4 rounded-xl bg-linear-to-br ${mod.color} border-2 border-white/30 shadow-lg`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{mod.icon}</span>
                              <div>
                                <h3 className="font-bold text-white">{mod.name}</h3>
                                <p className="text-sm text-white/80">{mod.description}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleModule(modId)}
                              className="text-white/80 hover:text-white text-2xl hover:cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                          {index < selectedModules.length - 1 && (
                            <div className="flex justify-center mt-2">
                              <div className="text-2xl text-white">↓</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Backend Selection */}
              <h2 className="text-2xl font-bold mb-4 text-purple-300">Select Proving Backend</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {backends.map(backend => (
                  <div
                    key={backend.id}
                    onClick={() => selectBackend(backend.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedBackend === backend.id
                        ? `bg-linear-to-br ${backend.color} border-white shadow-lg transform scale-105`
                        : 'bg-white/5 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-3xl mb-2 text-center">{backend.icon}</div>
                    <h3 className="font-bold text-white text-center mb-1">{backend.name}</h3>
                    <p className="text-xs text-gray-300 text-center mb-1">{backend.description}</p>
                    <p className="text-xs text-cyan-400 text-center font-semibold">{backend.speed}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={runProving}
                  disabled={selectedModules.length === 0 || !selectedBackend}
                  className="flex-1 bg-linear-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-xl text-xl font-bold hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:cursor-pointer"
                >
                  Compile & Generate Proof →
                </button>
                <button
                  onClick={resetChallenge}
                  className="px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // PROVING SCREEN
  if (gameState === 'proving') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-cyan-300">Generating ZK Proof</h1>
            <p className="text-xl text-gray-300">Pico is compiling your circuit...</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="space-y-6">
              {[
                { name: 'Circuit Assembly', description: 'Assembling selected modules into circuit' },
                { name: 'Module Compilation', description: 'Compiling modules with ' + (selectedBackend ? backends.find(b => b.id === selectedBackend).name : '') },
                { name: 'Witness Generation', description: 'Generating computation witness' },
                { name: 'ZK Proof Generation', description: 'Creating zero-knowledge proof' },
                { name: 'Proof Verification', description: 'Verifying proof validity' }
              ].map((step, index) => {
                const completed = provingProgress.find(p => p.name === step.name)
                const isActive = index === provingProgress.length
                
                return (
                  <div
                    key={step.name}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      completed
                        ? 'bg-green-500/20 border-green-400/50'
                        : isActive
                        ? 'bg-cyan-500/20 border-cyan-400/50 animate-pulse'
                        : 'bg-white/5 border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl ${completed ? '✅' : isActive ? '⏳' : '⭕'}`}>
                        {completed ? '✅' : isActive ? '⏳' : '⭕'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{step.name}</h3>
                        <p className="text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // RESULTS SCREEN
  if (gameState === 'results') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">{proofResult.success ? '🎉' : '❌'}</div>
            <h1 className="text-5xl font-bold mb-4 text-cyan-300">
              {proofResult.success ? 'Proof Generated!' : 'Circuit Incomplete'}
            </h1>
            <p className="text-2xl text-gray-300">{proofResult.feedback}</p>
          </div>

          {proofResult.success && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">Proof Details</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Proving Time</p>
                  <p className="text-3xl font-bold text-cyan-400">{proofResult.provingTime.toFixed(2)}s</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Gas Used</p>
                  <p className="text-3xl font-bold text-purple-400">{proofResult.gasUsed.toLocaleString()}</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Modules Used</p>
                  <p className="text-3xl font-bold text-green-400">{proofResult.modulesUsed}</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-2">Backend</p>
                  <p className="text-3xl font-bold text-orange-400">{proofResult.backend}</p>
                </div>
              </div>

              <div className="bg-linear-to-r from-cyan-500/10 to-purple-500/10 p-6 rounded-xl border border-cyan-400/30">
                <p className="text-gray-400 text-sm mb-2">Proof Hash</p>
                <p className="text-sm font-mono text-cyan-300 break-all">{proofResult.proofHash}</p>
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">What Just Happened?</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <span className="text-cyan-400 font-semibold">1. Modular Assembly:</span> Pico took your selected modules 
                (coprocessors) and assembled them into a custom ZK circuit. This is the &quot;glue&quot; part of Pico&apos;s architecture.
              </p>
              <p>
                <span className="text-purple-400 font-semibold">2. Backend Compilation:</span> Your circuit was compiled 
                using {proofResult.backend}, one of Pico&apos;s interchangeable proving backends. Different backends optimize 
                for different use cases (speed, proof size, verification cost).
              </p>
              <p>
                <span className="text-green-400 font-semibold">3. Proof Generation:</span> Pico&apos;s zkVM generated a 
                zero-knowledge proof that your circuit executed correctly, without revealing the private inputs.
              </p>
              <p>
                <span className="text-orange-400 font-semibold">4. Verification:</span> The proof can now be verified 
                on-chain in constant time, regardless of circuit complexity. This is the power of ZK!
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 mb-8 border border-cyan-400/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-purple-300">Without Pico</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>❌ Write complex circuits from scratch</li>
                  <li>❌ Learn circom/noir (weeks of dev time)</li>
                  <li>❌ Hard to optimize or modify</li>
                  <li>❌ Locked into one proving system</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300">With Pico</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>✅ Drag-and-drop modular components</li>
                  <li>✅ Minutes to build, not weeks</li>
                  <li>✅ Easy to modify and extend</li>
                  <li>✅ Switch backends anytime</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetChallenge}
              className="flex-1 bg-linear-to-r from-cyan-500 to-purple-500 text-white py-4 px-6 rounded-xl text-xl font-bold hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg hover:cursor-pointer"
            >
              Try Another Challenge
            </button>
            <button
              onClick={() => setGameState('intro')}
              className="px-6 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:cursor-pointer"
            >
              Back to Intro
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
