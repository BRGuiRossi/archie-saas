import {NextRequest, NextResponse} from 'next/server';
import {doc, setDoc} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard?error=invalid_request', request.url)
    );
  }

  const clientId = process.env.CLICKUP_CLIENT_ID;
  const clientSecret = process.env.CLICKUP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('ClickUp client ID or secret is not configured.');
    return NextResponse.redirect(
      new URL('/dashboard?error=config_error', request.url)
    );
  }

  try {
    const response = await axios.post(
      'https://api.clickup.com/api/v2/oauth/token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }
    );

    const accessToken = response.data.access_token;
    const userDocRef = doc(db, 'users', state);
    await setDoc(userDocRef, {clickupAccessToken: accessToken}, {merge: true});

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error exchanging ClickUp code for token:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=token_exchange_failed', request.url)
    );
  }
}