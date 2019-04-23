var express = require('express');
var app = express();
var path = require('path');
var mazeGenerator = require('./maze-generator');
// https://github.com/dstromberg2/maze-generator

let mazes = {};

const getRandomPosition = (min, max) => Math.floor(Math.random() * max) + min;

const getMaze = (width, height) => {
    const key = `${width}:${height}`;
    if (!mazes[key]) {
        mazes[key] = {
            key,
            tiles: mazeGenerator.newMaze(width, height),
            players: {},
            start: { x: getRandomPosition(0, width-1), y: getRandomPosition(0, height-1) },
            finish: { x: getRandomPosition(0, width-1), y: getRandomPosition(0, height-1) },
        };
    }

    return mazes[key];
};

const move = (res, maze, playerName, command, tileIndex, playerPositionModifier) => {
    let player = maze.players[playerName];
    if (!player) {
        res.send(JSON.stringify({ error: `Invalid player "${playerName}", use start command to begin` }));
        return;
    } else if (player.finished) {
        res.send(JSON.stringify({ error: `"${playerName}" has already completed the maze, use start command to begin a new maze` }));
        return;
    }
    let tile = maze.tiles[player.y][player.x];
    if (tile[tileIndex] === 0) {
        res.send(JSON.stringify({ error: `Invalid move "${command}", cannot move through walls`, tile, player, tileIndex }));
        return;
    }
    playerPositionModifier(player);
    player.moves++;
    tile = maze.tiles[player.y][player.x];

    if (player.x === maze.finish.x && player.y === maze.finish.y) {
        player.finished = true;
    }

    res.setHeader('Content-Type', 'application/json');
    res.send({ tile, player, start: maze.start, finish: maze.finish });
}

app.get('/:width/:height/:player/:command', (req, res) => {
    res.type('json');
    const maze = getMaze(req.params.width, req.params.height);
    const command = req.params.command;
    const playerName = req.params.player;

    switch (command) {
        case 'start':
            const player = maze.players[playerName] = { x: maze.start.x, y: maze.start.y, moves: 0, finished: false };
            res.send({ tile: maze.tiles[player.y][player.x], player, start: maze.start, finish: maze.finish });
            break;
        case 'up':
            move(res, maze, playerName, command, 0, (player) => player.y--);
            break;
        case 'right':
            move(res, maze, playerName, command, 1, (player) => player.x++);
            break;
        case 'down':
            move(res, maze, playerName, command, 2, (player) => player.y++);
            break;
        case 'left':
            move(res, maze, playerName, command, 3, (player) => player.x--);
            break;
        default:
            res.send({ error: `Invalid command "${command}"` });
    };
});

app.get('/status/:width/:height', (req, res) => {
    res.type('json');
    res.send(getMaze(req.params.width, req.params.height));
});

app.get('/draw-status/:width/:height', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3002);