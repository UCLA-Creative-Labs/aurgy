import { IUserData } from './user-data';

const URL = 'http://158.101.44.113:3000';

export async function signIn(refreshToken: string): Promise<IUserData | null> {
  const res = await window.fetch(URL + '/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function authCookie(jwt: string): Promise<IUserData | null> {
  const res = await window.fetch(URL + '/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function deleteAccount(jwt: string): Promise<void> {
  void window.fetch(URL + '/me', {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  });
}

