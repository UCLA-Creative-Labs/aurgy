import { Router, Request, Response } from 'express';
import { Lobby } from '../../lib/lobby';
import { THEME } from '../../lib/playlist-generation/themes';
import { User } from '../../lib/user';
import { logger } from '../../utils';
import { validateUserJwt } from '../../utils/jwt';
import { lobby_id_router } from './id';

export const lobby_router = Router();

lobby_router.use('/', validateUserJwt);
lobby_router.use('/', lobby_id_router);

/**
 * Creates a new lobby and returns the lobby id w/ lobby data
 *
 * Body Params: lobbyName, theme, id, refreshToken
 */
lobby_router.post('/', async (req: Request, res: Response) => {
  const lobbyName = req.body.lobbyName;
  // const theme = req.body.theme;
  const userId = req.body.userId;

  const manager = await User.fromId(userId);
  if (!manager) return res.status(404).json('user not found in database').end();

  logger.info(`Creating playlist called ${lobbyName}.`);

  const lobby = await Lobby.create({
    theme: THEME.DISSOCIATING_ON_THE_HIGHWAY,
    name: lobbyName,
    manager,
  });

  if(!lobby) {
    logger.error(`Failed to create playlist, ${lobbyName}.`);
    return res.status(500).json('unable to create lobby at this time').end();
  }

  const playlistCreated = lobby.synthesizePlaylist();

  !playlistCreated && logger.error(`Failed to synthesize playlist, ${lobbyName}.`);

  res.status(200).json({ name: lobby.name, id: lobby.id });
});

/**
 * Returns the lobbies a user is managing and participating in
 *
 * Body Params: id, refreshToken
 */
lobby_router.get('/', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const user = await User.fromId(userId);
  if (!user) return res.status(404).json('user not found in database').end();
  res.status(200).json({lobbies: user.lobbies});
});
