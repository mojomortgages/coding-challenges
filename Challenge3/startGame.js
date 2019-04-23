var express = require('express');
var app = express();
var { performance } = require('perf_hooks');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//require map coords
const map = require('./map1.json');

let playerStartTimes = {};
let playerEndTimes = {};

app.get('/start/:userName', (req, res) => {
    const userStartTime = performance.now();
    const userName = req.params.userName;
    playerStartTimes[userName] = userStartTime;
    console.log(`${userName}  Has joined the game..`);

    res.send(shuffle(map));
});

app.get('/submit/:userName', (req, res) => {
    const userEndTime = performance.now();
    const userName = req.params.userName;
    playerEndTimes[userName] = userEndTime;

    let results = {};
    results.timeAccrued = playerEndTimes[userName] - playerStartTimes[userName];
    const submission = req.body.submission;
    const path = submission.path;
    //check result
    results.distanceAccrued = checkResults.calculateDistance(path);
    results.returnsToStart = checkResults.returnsToStart(path);
    results.eachPointVisited = checkResults.eachPointVisited(path);
    results.noRepeats = checkResults.noRepeats(path);

    console.log(userName, " Returns back to start: ", results.returnsToStart);
    console.log(userName, " Visits every point: ", results.eachPointVisited);
    console.log(userName, " Doesn't double visit any points (apart from the first): ", results.noRepeats);
    console.log(userName, " Chosen path distance is ", results.distanceAccrued);
    console.log(`${userName}  Finished in ${results.timeAccrued} milliseconds\n`);

    res.send(results);
});

const checkResults = {
    returnsToStart(path){
        //true if first Point is the same as the last, otherwise false
        return path[0] == path[path.length-1];
    },
    eachPointVisited(path){
        //true if each Point is visited at least once, otheriwse false
        let check = true;
        for(key in map){
            if(path.indexOf(key) == -1){
                check = false;
            }
        }
        return check;
    },
    noRepeats(path){
        //false if any Point apart from first is visted twice, otherwise true
        let check = true;
        let count = {};
        path.map(Point => {
            //If count doesn't exist start it, otherwise increment by 1
            !(count[Point]) ? count[Point] = 1 : count[Point] += 1;

            if(path.indexOf(Point) == 0){
                if(count[Point] > 2){
                    check = false;
                }
            }else{
                if(count[Point] > 1){
                    check = false;
                }
            }
        });
        return check;
    },
    calculateDistance(path){
        let distance = 0;
        for(let i = 0; i < path.length; i++){
            let Point = path[i];
            let PointX = map[Point][0];
            let PointY = map[Point][1];
            
            //If we're not looking at the last Point (which should also be the first)
            if(i != path.length -1){

                let nextPointX = map[path[path.indexOf(Point) +1]][0];
                let nextPointY = map[path[path.indexOf(Point) +1]][1];

                let xDistance = nextPointX - PointX;
                let yDistance = nextPointY - PointY;

                let hDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
                distance += hDistance;
            }
        };

        return distance;
    }
}

function shuffle(map){
    let newMap = {};
    let keyList = Object.keys(map);
    
    while(keyList.length > 0){
        var j = keyList[Math.floor(Math.random()*keyList.length)];
        newMap[j] = map[j];
        keyList.splice(keyList.indexOf(j),1);
    }
    return newMap;
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('\nWaiting for players...'))