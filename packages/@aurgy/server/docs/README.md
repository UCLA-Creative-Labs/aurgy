# Aurgy Backend - Documentation

Our backend service for aurgy is growing to be increasingly more complex
as we continue to write features. This directory serves as a home base
for the documentation in regards to the implementation.

## Overview

Our backend service is compromised of a few key resources:

* **Spotify API**: The crux of service relies heavily on the Spotify API
and it is how we get a user's music taste to create "aurgies"
* **OCI Autonomous JSON Database**: We use Oracle Cloud Infrastructure's
Autonomous JSON Database to manage the data we collect/create through
Aurgy
* **Express**: Express is the library we are using to host our server
* **Jest**: Used for unit tests

## Repository Architecture

In order to maintain organization across our app, we have organized 
our repository in the following manner:

| Name    | Directory                 | Description                                               |
| ------- | ------------------------- | --------------------------------------------------------- |
| Core    | [`/lib/`](./core.md)      | `/lib/` maintains all of our core logic to run Aurgy      |
| Testing | [`/test/`](./testing.md)  | `/test/` maintains all our unit tests                     |
| Utility | [`/utils/`](./utility.md) | `/utils/` maintains all our of utility functions          |
| Routing | [`/www/`](./routing.md)   | `/www/` maintains all our routing logic for our endpoints |

## General Styling Rules

* All lines must end in a semicolon.
* Indentation uses two spaces.
* Component and interface names, imported assets, static functions, and static variables must be in PascalCase.
* Non-static functions, non-static variables, interface fields, and style classes must be in camelCase.
* For multiline blocks, opening braces/brackets must be on the same line as the preceding code, while closing braces/brackets must be on their own line.
* For interfaces, JSON files, etc. the last field **must** have a trailing comma in order to have clean file diffs.
* Local `import` statements must use relative file paths.
