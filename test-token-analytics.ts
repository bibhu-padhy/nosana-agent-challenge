// Test the token analytics tool directly with fetch
async function testMoralisAPI() {
  try {
    console.log('Testing Moralis API directly...');
    
    // Test with SRM token (more established)
    const tokenAddress = 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt';
    const moralisApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjdkMzUwYzJiLTU5MWMtNDMxYy1iNTkzLWU5ZDYwOWY3MzUzYiIsIm9yZ0lkIjoiNDUwNDA5IiwidXNlcklkIjoiNDYzNDMxIiwidHlwZUlkIjoiZjkyZDFmMGMtM2IyNC00ZjExLTg0M2YtZGExMTNlYmZmMjgzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDg3OTQzODIsImV4cCI6NDkwNDU1NDM4Mn0.APkUK1etZln4tfGelpVtGqy1k95oDcNLfV-S7mfTfDs";
    const analyticsUrl = `https://deep-index.moralis.io/api/v2.2/tokens/${tokenAddress}/analytics?chain=solana`;

    const response = await fetch(analyticsUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "X-API-Key": moralisApiKey,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Raw API Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Moralis API Error:', error);
  }
}

testMoralisAPI();