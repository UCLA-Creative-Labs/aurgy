# Aurgy Backend - Routing

`/www/` is the directory that contains all of our routing logic. We use
the `express` library to manage our server and REST API.

Generally, we will organize the routing in a similar fashion to how 
Next.js functions. The file name corresponds to the route path. For example,
the file `/www/login.ts` corresponds to the endpoint `/login`. This logic
applies to nested functions: `/www/lobby/[id].tsx` is `/lobby/{id}`.

## Creating Routes

When it comes to applying a route, all route **logic** will be written in
it's corresponding file. The logic will then be imported in `/www/index.ts`
to attach it to the express instance.

For example, say I want to create a GET endpoint at `/me`. Here are the following
steps:

1. Create the file `/www/me.ts`
2. Create the logic for the route
    ```ts
    export async function GET_me(req: Request, res: Response): Promise<void> {
      ...
    }
    ```
3. Add the logic to `/www/index.ts`
    ```ts
    const app = express();
    ...
    app.get('/me', GET_me);
    ```


