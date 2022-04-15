import { Router, Request, Response } from 'express';
import { User } from '../../lib';
import { Lobby } from '../../lib/lobby';
import { deleteSpotifyPlaylist } from '../../lib/spotify/delete-playlist';
import { updateSpotifyPlaylist } from '../../lib/spotify/update-playlist';
import { validateLobbyJwt, genJwt, EXPIRATION } from '../../utils/jwt';

interface VerifiedObjects {
  user: User;
  lobby: Lobby;
}

export const lobby_id_router = Router();

/**
 * Join a lobby
 *
 * Body Params: id, lobbyToken, refreshToken
 */
lobby_id_router.post('/:id', validateLobbyJwt, async (req: Request, res: Response) => {
  const userId: string = req.body.userId;
  const lobbyId: string = req.params.id;
  const decodedLobbyId: string | undefined = req.body.lobbyId;

  //check if user and lobby id's are valid
  const verified = await verifyIds(userId, lobbyId);
  if (!verified) return res.status(404).json('User or Lobby not found in database').end();
  const { user, lobby } = verified;

  const isParticipant = lobby.containsParticipant(user);

  if (!isParticipant && lobbyId !== decodedLobbyId) {
    return res.status(406).json('Lobby token is invalid').end();
  }

  if (!isParticipant) {
    const added = await lobby.addUser(user);
    /** as of now, addUser should always return true
     * this is just in case we want to handle the possibility that writing to the database fails
    */
    if (!added) return res.status(406).json('Error writing to database').end(); // not sure what error code to use, if it failed to write to database
  }
  res.status(200).send(lobby.getClientResponse());
});

/**
 * Get lobby specific info
 *
 * Body Params: id, refreshToken
 */
lobby_id_router.get('/:id', async (req: Request, res: Response) => {
  const lobbyId = req.params.id;
  const userId = req.body.userId;
  const verified = await verifyIds(userId, lobbyId);
  if (!verified) return res.status(404).json('User or Lobby not found in database').end();
  const { lobby } = verified;
  if (!lobby.containsParticipant(userId)) return res.status(406).json('User is not part of the lobby').end();
  res.status(200).json(userId === lobby.managerId
    ? {...lobby.getClientResponse(), lobbyToken: genJwt(lobbyId, EXPIRATION.ONE_HOUR)}
    : lobby.getClientResponse());
});

/**
 * Update lobby information
 *
 * Body Params: id, name, refreshToken
 */
lobby_id_router.patch('/:id', async (req: Request, res: Response) => {
  const lobbyId = req.params.id;
  const userId = req.body.userId;
  const name: string = req.body.name;
  const verified = await verifyIds(userId, lobbyId);
  if (!verified) return res.status(404).json('User or Lobby not found in database').end();
  const { lobby } = verified;

  if (lobby.managerId !== userId) return res.status(406).json('User is not a manager of the lobby').end();
  if (name && name !== '') {
    await lobby.updateName(name);
    await updateSpotifyPlaylist(lobbyId, name);
  }

  res.status(200).end();
});

/**
 * Delete a lobby
 *
 * Body Params: id, refreshToken
 */
lobby_id_router.delete('/:id', async (req: Request, res: Response) => {
  const lobbyId = req.params.id;
  const userId = req.body.userId;
  const verified = await verifyIds(userId, lobbyId);
  if (!verified) return res.status(404).json('User or Lobby not found in database').end();
  const { lobby } = verified;

  if (lobby.managerId !== userId) return res.status(406).json('User is not a manager of the lobby').end();
  const deleted = await deleteSpotifyPlaylist(lobbyId);
  if (!deleted) return res.status(500).json('playlist was unable to be deleted').end();

  const clientRes = lobby.getClientResponse();
  // remove lobby from each user's lobby list
  clientRes.users.forEach(async (userObj) => {
    const user = await User.fromId(userObj.id);
    user?.removeLobby(lobby);
  });

  void lobby.removeFromDatabase();
  res.status(200).end();
});

/**
 * Remove a user from the lobby
 *
 * Body Params: id, refreshToken
 */
lobby_id_router.delete('/:id/user/:deleteId', async (req: Request, res: Response) => {
  const lobbyId = req.params.id;
  const deleteUserId = req.params.deleteId;
  const userId = req.body.userId;
  const verified = await verifyIds(deleteUserId, lobbyId);
  if (!verified) return res.status(404).json('User or Lobby not found in database').end();
  const { user, lobby } = verified;

  if (lobby.managerId !== userId) return res.status(406).json('User is not a manager of the lobby').end();

  const deleted = await lobby.removeUser(user);
  if (!deleted) return res.status(500).json('user was unable to be removed from lobby').end();
  res.status(200).end();
});

const verifyIds = async (userId: string, lobbyId: string): Promise<VerifiedObjects | null> => {
  if (!userId || !lobbyId) return null;
  const user = await User.fromId(userId);
  if (!user) return null;
  const lobby = await Lobby.fromId(lobbyId);
  if (!lobby) return null;
  return {
    user,
    lobby,
  };
};
