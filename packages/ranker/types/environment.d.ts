namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    SECRET: string;
    NEXTAUTH_URL: string;
  }
}
