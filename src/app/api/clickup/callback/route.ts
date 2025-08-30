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

  // The 'state' is the user's UID.
  const userId = state;

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
    // Use the userId from the 'state' to save the token.
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {clickupAccessToken: accessToken}, {merge: true});

    // Redirect to the dashboard and add a query param to indicate success.
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('success', 'true');
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Error exchanging ClickUp code for token:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=token_exchange_failed', request.url)
    );
  }
}
