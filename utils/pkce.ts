const SPOTIFY_MASK = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
const BYTE_LENGTH = 256;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export function generateRandomString(length: number, mask = SPOTIFY_MASK): string {
  const randomIndices = new Int8Array(length);
  window.crypto.getRandomValues(randomIndices);
  const maskLength = Math.min(mask.length, BYTE_LENGTH);
  const scalingFactor = BYTE_LENGTH / maskLength;

  return Array(length).fill(0).reduce((acc, _val, i) =>
    `${acc}${mask[Math.floor(Math.abs(randomIndices[i]) / scalingFactor)]}`, '');
}

function base64UrlEncode(array): string {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateVerifier(length): string {
  return generateRandomString(length);
}

export interface IChallenge {
  code_challenge: string;
  code_verifier: string;
}

export async function generateChallenge(length = 43): Promise<IChallenge> {
  const verifier = generateVerifier(length);

  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const array = await window.crypto.subtle.digest('SHA-256', data);

  return {
    code_challenge: base64UrlEncode(array),
    code_verifier: verifier,
  };
}