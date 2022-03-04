import {ILobbyCreationData, ILobbiesData, ILobbyData} from './lobby-data';
import {IUserData} from './user-data';

const URL = 'https://daddy.creativelabsucla.com';

/**
 * USER SERVICES
 */

export async function signIn(refreshToken: string): Promise<IUserData | null> {
  const res = await window.fetch(URL + '/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({refreshToken}),
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

/**
 * LOBBY SERVICES
 */

interface LobbyParams {
  lobbyName: string;
  theme: string;
}

export async function createLobby(params: LobbyParams, jwt: string)
  : Promise<ILobbyCreationData | null> {
  const res = await window.fetch(URL + '/lobby', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function fetchAllLobbies(jwt: string): Promise<ILobbiesData | null> {
  const res = await window.fetch(URL + '/lobby', {
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

export async function fetchLobbyById(id: string, jwt: string): Promise<ILobbyData | null> {
  const res = await window.fetch(URL + '/lobby/' + id, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw res.status;
  const data = await res.json();
  return data;
}
