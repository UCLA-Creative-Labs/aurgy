export type IUserData = {
  readonly accountType: 'premium' | 'free';
  readonly name: string;
  readonly images: string[];
  readonly country: string;
  readonly id: string;
  readonly jwt: string;
}
