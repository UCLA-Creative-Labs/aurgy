import { Lobby } from '../lib/lobby';

async function main() {
  const lobbies = await Lobby.all();
  lobbies.forEach(lobby => void lobby.synthesizePlaylist());
}

void main();
