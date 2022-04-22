import {Request, Response, Router} from 'express';
import { TokenResponse, UserInfoResponse } from '../lib';
import { getAccessToken } from '../lib/spotify/access-token';
import { getMeInfo } from '../lib/spotify/me';
import { User } from '../lib/user';
import { logger } from '../utils';
import { EXPIRATION, genJwt, validateUserJwt } from '../utils/jwt';

export const me_router = Router();

me_router.post('/', async (req: Request, res: Response): Promise<void> => {
  const refreshToken: string = req.body.refreshToken;

  const getUserInfo = async (): Promise<{userInfo: UserInfoResponse, tokens: TokenResponse} | null> => {
    try {
      const tokens = await getAccessToken(refreshToken);
      const userInfo = await getMeInfo(tokens.access_token);
      return {tokens, userInfo};
    } catch (err) {
      logger.error(`${err}: ${await err.response.text()}`);
    }
    return null;
  };

  const data = await getUserInfo();

  if (data === null) {
    res.status(403).end();
    return;
  }

  const {userInfo, tokens} = data;

  const user = (await User.fromId(userInfo.id)) ?? new User(userInfo.id, {
    refreshToken,
    name: userInfo.display_name,
    country: userInfo.country,
    images: userInfo.images.map(img => img.url),
    uri: userInfo.uri,
    accountType: userInfo.product,
  });

  // This performs a write to the database so regardless of whether or not
  // this is an update, we need to write to the database
  user.updateRefreshToken(tokens.refresh_token, false);

  logger.info('Updating Top Songs');
  // we should probably remove this at some point or check if its a first time user at least!
  void user.updateTopSongs();

  const jwt = genJwt(user.id, EXPIRATION.SEVEN_DAYS);

  res.status(200).send({...user.getClientResponse(), jwt});
});

me_router.get('/', validateUserJwt, async (req: Request, res: Response): Promise<void> => {
  const id: string = req.body.userId;

  const user = await User.fromId(id);
  if (!user) { res.status(404).end(); return; }

  // we should probably remove this at some point
  void user.updateTopSongs();
  res.status(200).send(user.getClientResponse());
});

me_router.delete('/', validateUserJwt, async (req: Request, res: Response): Promise<void> => {
  const id: string = req.body.userId;

  const user = await User.fromId(id);
  if (!user) { res.status(404).end(); return; }

  void user.removeFromDatabase();
  res.status(200).end();
});
