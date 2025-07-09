import { createTool } from "@mastra/core/tools";
import { z } from "zod";

interface SolanaBalanceResponse {
	result: {
		context: {
			slot: number;
		};
		value: number;
	};
}

interface SolPriceResponse {
	solana: {
		usd: number;
	};
}

interface TokenAnalyticsResponse {
	tokenAddress: string;
	totalBuyVolume: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	totalSellVolume: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	totalBuyers: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	totalSellers: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	totalBuys: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	totalSells: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	uniqueWallets: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	pricePercentChange: {
		"5m": number;
		"1h": number;
		"6h": number;
		"24h": number;
	};
	usdPrice: string;
	totalLiquidityUsd: string;
	totalFullyDilutedValuation: string;
}

interface TokenMetadataResponse {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	logo?: string;
	thumbnail?: string;
	possible_spam: boolean;
	verified_collection: boolean;
	categories: string[];
	links?: {
		twitter?: string;
		telegram?: string;
		website?: string;
	};
	supply?: {
		total_supply: string;
		circulating_supply: string;
	};
}

interface WalletPortfolioResponse {
	tokens: Array<{
		address: string;
		name: string;
		symbol: string;
		decimals: number;
		logo?: string;
		thumbnail?: string;
		balance: string;
		balance_formatted: string;
		usd_price?: number;
		usd_value?: number;
		portfolio_percentage?: number;
		possible_spam: boolean;
		verified_collection: boolean;
	}>;
	nfts?: Array<{
		address: string;
		name: string;
		symbol: string;
		logo?: string;
		thumbnail?: string;
	}>;
	total_usd_value: number;
}

interface TokenPriceResponse {
	tokenAddress: string;
	pairAddress: string;
	exchangeName: string;
	exchangeAddress: string;
	nativePrice: {
		value: string;
		symbol: string;
		name: string;
		decimals: number;
	};
	usdPrice: number;
	usdPrice24h: number;
	usdPrice24hrUsdChange: number;
	usdPrice24hrPercentChange: number;
	logo?: string;
	name: string;
	symbol: string;
	isVerifiedContract: boolean;
}

export const solanaBalanceTool = createTool({
	id: "get-solana-balance",
	description: "Get SOL balance for a Solana wallet address",
	inputSchema: z.object({
		address: z.string().describe("Solana wallet address (base58)"),
	}),
	outputSchema: z.object({
		address: z.string(),
		solBalance: z.number(),
		usdValue: z.number(),
		pricePerSol: z.number(),
	}),
	execute: async ({ context }) => {
		return await getSolanaBalance(context.address);
	},
});

export const tokenAnalyticsTool = createTool({
	id: "get-token-analytics",
	description: "Get comprehensive analytics for a Solana token including volume, price trends, and market data",
	inputSchema: z.object({
		tokenAddress: z.string().describe("Solana token contract address"),
	}),
	outputSchema: z.object({
		tokenAddress: z.string(),
		currentPrice: z.number(),
		priceChange24h: z.number(),
		buyVolume24h: z.number(),
		sellVolume24h: z.number(),
		totalVolume24h: z.number(),
		buyers24h: z.number(),
		sellers24h: z.number(),
		uniqueWallets24h: z.number(),
		totalTrades24h: z.number(),
		liquidityUsd: z.number(),
		marketCap: z.number(),
		buyPressure: z.number(),
	}),
	execute: async ({ context }) => {
		return await getTokenAnalytics(context.tokenAddress);
	},
});

export const tokenMetadataTool = createTool({
	id: "get-token-metadata",
	description: "Get detailed metadata for a Solana token including name, symbol, supply, links, and verification status",
	inputSchema: z.object({
		tokenAddress: z.string().describe("Solana token contract address"),
	}),
	outputSchema: z.object({
		address: z.string(),
		name: z.string(),
		symbol: z.string(),
		decimals: z.number(),
		logo: z.string().optional(),
		thumbnail: z.string().optional(),
		possibleSpam: z.boolean(),
		verifiedCollection: z.boolean(),
		categories: z.array(z.string()),
		links: z.object({
			twitter: z.string().optional(),
			telegram: z.string().optional(),
			website: z.string().optional(),
		}).optional(),
		totalSupply: z.string().optional(),
		circulatingSupply: z.string().optional(),
	}),
	execute: async ({ context }) => {
		return await getTokenMetadata(context.tokenAddress);
	},
});

export const walletPortfolioTool = createTool({
	id: "get-wallet-portfolio",
	description: "Get complete portfolio for a Solana wallet including all token holdings, balances, USD values, and NFTs",
	inputSchema: z.object({
		walletAddress: z.string().describe("Solana wallet address"),
		excludeSpam: z.boolean().optional().default(true).describe("Exclude spam tokens from results"),
	}),
	outputSchema: z.object({
		walletAddress: z.string(),
		totalUsdValue: z.number(),
		tokenCount: z.number(),
		nftCount: z.number(),
		tokens: z.array(z.object({
			address: z.string(),
			name: z.string(),
			symbol: z.string(),
			decimals: z.number(),
			balance: z.string(),
			balanceFormatted: z.string(),
			usdPrice: z.number().optional(),
			usdValue: z.number().optional(),
			portfolioPercentage: z.number().optional(),
			possibleSpam: z.boolean(),
			verifiedCollection: z.boolean(),
			logo: z.string().optional(),
		})),
		topTokens: z.array(z.object({
			symbol: z.string(),
			usdValue: z.number(),
			percentage: z.number(),
		})),
	}),
	execute: async ({ context }) => {
		return await getWalletPortfolio(context.walletAddress, context.excludeSpam);
	},
});

const getSolanaBalance = async (address: string) => {
	// Validate address format (basic check)
	if (!address || address.length < 32 || address.length > 44) {
		throw new Error(`Invalid Solana address format: ${address}`);
	}

	const rpcUrl = "https://mainnet.helius-rpc.com/?api-key=dbf616dd-1870-4cdb-a0d2-754ae58a64f0";
	
	// Get SOL balance
	const balanceResponse = await fetch(rpcUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "getBalance",
			params: [address],
		}),
	});

	const balanceData = (await balanceResponse.json()) as SolanaBalanceResponse;
	
	if (!balanceData.result) {
		throw new Error(`Failed to get balance for address: ${address}`);
	}

	// Convert lamports to SOL (1 SOL = 1e9 lamports)
	const solBalance = balanceData.result.value / 1e9;

	// Get current SOL price
	const priceResponse = await fetch(
		"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
	);
	const priceData = (await priceResponse.json()) as SolPriceResponse;
	const pricePerSol = priceData.solana.usd;

	// Calculate USD value
	const usdValue = solBalance * pricePerSol;

	return {
		address,
		solBalance,
		usdValue,
		pricePerSol,
	};
};

const getTokenAnalytics = async (tokenAddress: string) => {
	// Validate token address format
	if (!tokenAddress || tokenAddress.length < 32 || tokenAddress.length > 44) {
		throw new Error(`Invalid token address format: ${tokenAddress}`);
	}

	const moralisApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdkMzUwYzJiLTU5MWMtNDMxYy1iNTkzLWU5ZDYwOWY3MzUzYiIsIm9yZ0lkIjoiNDUwNDA5IiwidXNlcklkIjoiNDYzNDMxIiwidHlwZUlkIjoiZjkyZDFmMGMtM2IyNC00ZjExLTg0M2YtZGExMTNlYmZmMjgzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDg3OTQzODIsImV4cCI6NDkwNDU1NDM4Mn0.APkUK1etZln4tfGelpVtGqy1k95oDcNLfV-S7mfTfDs";
	const analyticsUrl = `https://deep-index.moralis.io/api/v2.2/tokens/${tokenAddress}/analytics?chain=solana`;

	try {
		const response = await fetch(analyticsUrl, {
			method: "GET",
			headers: {
				"accept": "application/json",
				"X-API-Key": moralisApiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
		}

		const data = (await response.json()) as TokenAnalyticsResponse;

		const buyVolume24h = data.totalBuyVolume?.["24h"] || 0;
		const sellVolume24h = data.totalSellVolume?.["24h"] || 0;
		const totalVolume24h = buyVolume24h + sellVolume24h;
		const totalTrades24h = (data.totalBuys?.["24h"] || 0) + (data.totalSells?.["24h"] || 0);
		
		// Calculate buy pressure (buy volume / total volume)
		const buyPressure = totalVolume24h > 0 ? (buyVolume24h / totalVolume24h) * 100 : 0;

		return {
			tokenAddress,
			currentPrice: parseFloat(data.usdPrice) || 0,
			priceChange24h: data.pricePercentChange?.["24h"] || 0,
			buyVolume24h,
			sellVolume24h,
			totalVolume24h,
			buyers24h: data.totalBuyers?.["24h"] || 0,
			sellers24h: data.totalSellers?.["24h"] || 0,
			uniqueWallets24h: data.uniqueWallets?.["24h"] || 0,
			totalTrades24h,
			liquidityUsd: parseFloat(data.totalLiquidityUsd) || 0,
			marketCap: parseFloat(data.totalFullyDilutedValuation) || 0,
			buyPressure,
		};
	} catch (error) {
		throw new Error(`Failed to get token analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};

const getTokenMetadata = async (tokenAddress: string) => {
	// Validate token address format
	if (!tokenAddress || tokenAddress.length < 32 || tokenAddress.length > 44) {
		throw new Error(`Invalid token address format: ${tokenAddress}`);
	}

	const moralisApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdkMzUwYzJiLTU5MWMtNDMxYy1iNTkzLWU5ZDYwOWY3MzUzYiIsIm9yZ0lkIjoiNDUwNDA5IiwidXNlcklkIjoiNDYzNDMxIiwidHlwZUlkIjoiZjkyZDFmMGMtM2IyNC00ZjExLTg0M2YtZGExMTNlYmZmMjgzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDg3OTQzODIsImV4cCI6NDkwNDU1NDM4Mn0.APkUK1etZln4tfGelpVtGqy1k95oDcNLfV-S7mfTfDs";
	const metadataUrl = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`;

	try {
		const response = await fetch(metadataUrl, {
			method: "GET",
			headers: {
				"accept": "application/json",
				"X-API-Key": moralisApiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
		}

		const data = (await response.json()) as TokenMetadataResponse;

		return {
			address: data.address || tokenAddress,
			name: data.name || "Unknown Token",
			symbol: data.symbol || "UNKNOWN",
			decimals: data.decimals || 0,
			logo: data.logo,
			thumbnail: data.thumbnail,
			possibleSpam: data.possible_spam || false,
			verifiedCollection: data.verified_collection || false,
			categories: data.categories || [],
			links: data.links ? {
				twitter: data.links.twitter,
				telegram: data.links.telegram,
				website: data.links.website,
			} : undefined,
			totalSupply: data.supply?.total_supply,
			circulatingSupply: data.supply?.circulating_supply,
		};
	} catch (error) {
		throw new Error(`Failed to get token metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};

const getWalletPortfolio = async (walletAddress: string, excludeSpam: boolean = true) => {
	// Validate wallet address format
	if (!walletAddress || walletAddress.length < 32 || walletAddress.length > 44) {
		throw new Error(`Invalid wallet address format: ${walletAddress}`);
	}

	const moralisApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdkMzUwYzJiLTU5MWMtNDMxYy1iNTkzLWU5ZDYwOWY3MzUzYiIsIm9yZ0lkIjoiNDUwNDA5IiwidXNlcklkIjoiNDYzNDMxIiwidHlwZUlkIjoiZjkyZDFmMGMtM2IyNC00ZjExLTg0M2YtZGExMTNlYmZmMjgzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDg3OTQzODIsImV4cCI6NDkwNDU1NDM4Mn0.APkUK1etZln4tfGelpVtGqy1k95oDcNLfV-S7mfTfDs";
	const portfolioUrl = `https://solana-gateway.moralis.io/account/mainnet/${walletAddress}/portfolio?nftMetadata=true&mediaItems=false&excludeSpam=${excludeSpam}`;

	try {
		const response = await fetch(portfolioUrl, {
			method: "GET",
			headers: {
				"accept": "application/json",
				"X-API-Key": moralisApiKey,
			},
		});

		if (!response.ok) {
			throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
		}

		const data = (await response.json()) as WalletPortfolioResponse;

		// Filter out spam tokens if requested
		const filteredTokens = excludeSpam 
			? data.tokens.filter(token => !token.possible_spam)
			: data.tokens;

		// Sort tokens by USD value (highest first)
		const sortedTokens = filteredTokens.sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0));

		// Calculate top tokens (top 5 by value)
		const topTokens = sortedTokens.slice(0, 5).map(token => ({
			symbol: token.symbol,
			usdValue: token.usd_value || 0,
			percentage: token.portfolio_percentage || 0,
		}));

		return {
			walletAddress,
			totalUsdValue: data.total_usd_value || 0,
			tokenCount: filteredTokens.length,
			nftCount: data.nfts?.length || 0,
			tokens: sortedTokens.map(token => ({
				address: token.address,
				name: token.name,
				symbol: token.symbol,
				decimals: token.decimals,
				balance: token.balance,
				balanceFormatted: token.balance_formatted,
				usdPrice: token.usd_price,
				usdValue: token.usd_value,
				portfolioPercentage: token.portfolio_percentage,
				possibleSpam: token.possible_spam,
				verifiedCollection: token.verified_collection,
				logo: token.logo || token.thumbnail,
			})),
			topTokens,
		};
	} catch (error) {
		throw new Error(`Failed to get wallet portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};