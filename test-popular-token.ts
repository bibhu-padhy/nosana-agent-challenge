// Test the popular token to see what Moralis returns
async function testPopularToken() {
  try {
    console.log('Testing popular token 9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump...');
    
    const tokenAddress = '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump';
    const moralisApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdkMzUwYzJiLTU5MWMtNDMxYy1iNTkzLWU5ZDYwOWY3MzUzYiIsIm9yZ0lkIjoiNDUwNDA5IiwidXNlcklkIjoiNDYzNDMxIiwidHlwZUlkIjoiZjkyZDFmMGMtM2IyNC00ZjExLTg0M2YtZGExMTNlYmZmMjgzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDg3OTQzODIsImV4cCI6NDkwNDU1NDM4Mn0.APkUK1etZln4tfGelpVtGqy1k95oDcNLfV-S7mfTfDs";
    
    // Test analytics endpoint
    console.log('\n=== TESTING ANALYTICS ENDPOINT ===');
    const analyticsUrl = `https://deep-index.moralis.io/api/v2.2/tokens/${tokenAddress}/analytics?chain=solana`;
    
    const analyticsResponse = await fetch(analyticsUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "X-API-Key": moralisApiKey,
      },
    });

    console.log('Analytics Status:', analyticsResponse.status);
    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('Analytics Response:', JSON.stringify(analyticsData, null, 2));
    } else {
      console.log('Analytics Error:', await analyticsResponse.text());
    }

    // Test metadata endpoint
    console.log('\n=== TESTING METADATA ENDPOINT ===');
    const metadataUrl = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`;
    
    const metadataResponse = await fetch(metadataUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "X-API-Key": moralisApiKey,
      },
    });

    console.log('Metadata Status:', metadataResponse.status);
    if (metadataResponse.ok) {
      const metadataData = await metadataResponse.json();
      console.log('Metadata Response:', JSON.stringify(metadataData, null, 2));
    } else {
      console.log('Metadata Error:', await metadataResponse.text());
    }

    // Test price endpoint
    console.log('\n=== TESTING PRICE ENDPOINT ===');
    const priceUrl = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`;
    
    const priceResponse = await fetch(priceUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "X-API-Key": moralisApiKey,
      },
    });

    console.log('Price Status:', priceResponse.status);
    if (priceResponse.ok) {
      const priceData = await priceResponse.json();
      console.log('Price Response:', JSON.stringify(priceData, null, 2));
    } else {
      console.log('Price Error:', await priceResponse.text());
    }

  } catch (error) {
    console.error('Test Error:', error);
  }
}

testPopularToken();