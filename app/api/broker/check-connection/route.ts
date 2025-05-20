import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { apiKey, apiSecret } = await request.json();

  try {
    const isConnected = await checkBrokerConnection(apiKey, apiSecret);

    if (isConnected) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid API or Secret Key' }, { status: 400 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

async function checkBrokerConnection(apiKey: string, apiSecret: string): Promise<boolean> {
    const endpoint = 'https://api.binance.com/api/v3/account';
    const timestamp = Date.now();
    const query = `timestamp=${timestamp}`;
  
    const crypto = await import('crypto');
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(query)
      .digest('hex');
  
    const url = `${endpoint}?${query}&signature=${signature}`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    });
  
    const data = await response.json();
    console.log('Account response:', data);
  
    return response.ok;
  }
// This function checks the connection to the broker using the provided API key and secret.  