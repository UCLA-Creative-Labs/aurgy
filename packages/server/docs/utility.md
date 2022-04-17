# Aurgy Backend - Utility

The `/utils/` directory contains all of our utility functions. Utility functions
is any logic that is not **directly** core to Aurgy. This takes the shape in a
variety of ways: logging, type conversion, errors.

## Logging

We currently use `winston` to manage all our logging (`console.log` is disabled!).

`winston` allows us to stream our logging information into different channels. 
For example, when our app is in production we can stream the logging information into
a file.

To use `winston` simply import the logger from `utils` and log away!

```ts
import {logger} from './utils';

logger.info('Hello World!!');
logger.error('Oops I made a boo boo :(');
```