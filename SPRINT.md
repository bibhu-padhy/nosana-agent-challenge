# SPRINT.md - Solana Wallet Monitor Agent

**PROJECT**: Solana Wallet Monitor Agent for Nosana Hackathon  
**DEADLINE**: July 9, 2025, 12:01 PM  
**TIME REMAINING**: ~48 hours  
**STATUS**: 🔴 ACTIVE SPRINT  

## PROJECT OVERVIEW
Building an AI agent that monitors Solana wallets using Mastra framework and Helius RPC. The agent provides intelligent wallet analysis through natural language interaction.

**Key Resources:**
- **RPC Endpoint**: https://mainnet.helius-rpc.com/?api-key=dbf616dd-1870-4cdb-a0d2-754ae58a64f0
- **Moralis API**: Token analytics, metadata, portfolio, price data
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdkMzUwYzJiLTU5MWMtNDMxYy1iNTkzLWU5ZDYwOWY3MzUzYiIsIm9yZ0lkIjoiNDUwNDA5IiwidXNlcklkIjoiNDYzNDMxIiwidHlwZUlkIjoiZjkyZDFmMGMtM2IyNC00ZjExLTg0M2YtZGExMTNlYmZmMjgzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDg3OTQzODIsImV4cCI6NDkwNDU1NDM4Mn0.APkUK1etZln4tfGelpVtGqy1k95oDcNLfV-S7mfTfDs
- **Rate Limit**: Moralis API limits apply
- **Blockchain**: Solana mainnet

## SPRINT PHASES

### 🎯 PHASE 1: Balance Checker (4-6 hours) ✅ COMPLETE
**Goal**: Basic wallet balance lookup functionality
- [x] Create solana-tool.ts with balance checker
- [x] Create solana-agent.ts with proper instructions  
- [x] Update mastra/index.ts to register agent
- [x] Test balance queries via dev server
- [x] Verify lint/build passes

**Success Criteria**: User can ask "What's the balance of wallet XYZ?" and get SOL amount + USD value

### 🎯 PHASE 2: Token Analysis Agent (6-8 hours)  
**Goal**: Build comprehensive token analysis using Moralis API
- [ ] Add `tokenAnalyticsTool` - Get token analytics, price history, volume
- [ ] Add `tokenMetadataTool` - Get detailed token information and metadata
- [ ] Add `walletPortfolioTool` - Get complete wallet portfolio with token holdings
- [ ] Add `tokenPriceTool` - Get real-time token price data
- [ ] Update agent instructions for token analysis capability
- [ ] Test all tools via chat interface

**Success Criteria**: 
- "Analyze token XYZ" → Returns analytics, volume, price trends
- "Get metadata for token ABC" → Shows token details, supply, etc.
- "Show portfolio for wallet XYZ" → Lists all tokens with values
- "What's the price of token ABC?" → Returns current price + market data
- "Compare tokens A vs B" → Provides comparative analysis

### 🎯 PHASE 3: Advanced Features (4-6 hours)
**Goal**: Polish and advanced functionality
- [ ] Add transaction filtering (>$1K, recent, by type)
- [ ] Implement wallet comparison features
- [ ] Add portfolio composition analysis
- [ ] Create natural language explanations for complex data
- [ ] Add error handling and edge cases
- [ ] Performance optimization for multiple API calls

**Success Criteria**: Agent provides sophisticated analysis and handles complex queries gracefully

## DEPLOYMENT CHECKLIST
- [ ] Docker container built and tested
- [ ] Published to Docker Hub
- [ ] Deployed on Nosana network
- [ ] Demo video recorded (1-3 minutes)
- [ ] Social media post prepared
- [ ] SuperTeam submission ready

## CURRENT STATUS
**Active Phase**: Phase 2 - Multi-Tool Agent  
**Next Milestone**: Transaction History Tool  
**Blocker**: None currently  
**Risk Level**: 🟢 Good (Phase 1 complete, momentum building)

## NOTES
- Skipping weather agent analysis to save time
- Focus on working MVP over perfect features
- Ready to pivot if Solana complexity is too high
- Prioritize demo-able functionality

---
**Last Updated**: 2025-07-07  
**Next Review**: After Phase 1 completion