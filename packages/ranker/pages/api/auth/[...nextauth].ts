import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {_Firebase} from '../../../utils/firebase';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url =
            'https://oauth2.googleapis.com/token?' +
            new URLSearchParams({
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken,
            });

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({user}) {
      const firebase = new _Firebase();
      void firebase.put({
        path: `ranker-users/${user.email}`,
        data: user,
        defaults: {
          devices: [],
        },
      });
      return true;
    },
    async jwt({token, user, account}) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + (account.expires_in as number) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({session, token}) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.token = token;

      const firebase = new _Firebase();
      void firebase.put({
        path: `ranker-users/${session.user.email}`,
        data: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      });

      return session;
    },
  },
});
