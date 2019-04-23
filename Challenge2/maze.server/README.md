# maze.server

## Installation
### Prerequisites

 - Install node.js https://nodejs.org/en/download/
 - Install npm https://www.npmjs.com/get-npm

 ### Launching
 - Run `npm install`
 - Run `node server.js`

## Endpoints
### /{width}/{height}/{player}/{command}

Example `/10/10/joe/start`

Parameters:
-`width` number of tiles horizontally in the maze (must be a positive integer)
-`height` number of tiles vertically in the maze (must be a positive integer)
-`player` string name of your player (no special characters allowed)
-`command` must be in the following list (start/up/right/down/left)

Usage:

The first command that references a new dimension of maze generates a new maze, this maze is stored until the server stops.
The first command for a new player must be `start`
Each command after start increments the player moves by 1

Output:

`{ error: 'Message', tile: [0,1,1,0], player: { x: 0, y: 0, finished: false }, start: { x: 0, y: 0 }, finish: { x: 10, y: 10 } }`

-`error` message will be populated when an invalid command is attempted
-`tile` the point on the maze your player is now positioned. Each number represents a direction (up/right/down/left) 0 = wall, 1 = floor
-`player` x and y co-ordinates of the player position as well as a completed flag that returns true when you have completed the maze
-`start` the starting position for players in the maze
-`finish` the position the player must reach to complete the maze

### /status/{width}/{height}

Example `/status/10/10`

Parameters:
-`width` number of tiles horizontally in the maze (must be a positive integer)
-`height` number of tiles vertically in the maze (must be a positive integer)

Usage:

Retrieve the status of an entire maze

Output:

`{ tiles: [][], players: {} }`

-`tiles` two-dimensional array representing the maze
-`players` all participating players on the maze

### /draw-status/{width}/{height}

Example `/draw-status/10/10`

Usage:

Return a HTML page that renders the maze status

Output:

index.html
