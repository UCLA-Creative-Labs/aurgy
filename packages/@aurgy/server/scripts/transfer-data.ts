import {User, Song} from '../lib';
import { Lobby } from '../lib/lobby';

async function main() {
  const users: User[] = await User.all();
  users.forEach(user => void user.writeToFbDatabase());

  const songs: Song[] = await Song.all();
  songs.forEach(song => void song.writeToFbDatabase());

  const lobbies: Lobby[] = await Lobby.all();
  lobbies.forEach(lobby => void lobby.writeToFbDatabase());
}

void main();