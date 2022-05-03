const database = require('./database.js');
const express = require('express');


//Express setup
const app = express()
app.use(express.json())
const port = 6969

//routen

async function newSessionID() {
    await database.query('SELECT SessionID FROM sessionids')
    .then((resolve) => {
        let sessionID = Math.floor(Math.random() * (9999999999999 - 9999999999 + 1) + 9999999999)
        while (resolve.includes(sessionID)) {
            sessionID = Math.floor(Math.random() * (9999999999999 - 9999999999 + 1) + 9999999999)
        }
        console.log(sessionID)
        return sessionID
    })
    .catch((reject) => {console.log(reject)});
}

//login
app.post('/login', (req, res) => {
    if(req.body.username && req.body.password) {
        database.query('SELECT * FROM user WHERE FirstName = ?', [req.body.username])
        .then(resolve => {
            console.log(resolve)
            if(resolve[0].Password == req.body.password) {
                let sessionID = newSessionID()
                console.log('penis')
                addSessionID(sessionID, resolve[0].ID)
                res.json(sessionID)
            } else {
                res.status(401).json()
            }
        })
        .catch(reject => {
            res.json(reject + 'invalid username');
        });
    } else {
        res.status(400).json()
    }
});

let sessionID = 123456789 //this session id is temporary until I set up propper session id system
//simple coinflip game alone vs pc
app.post('/coinflip', (req, res) => {
    if(req.body.money && req.body.sessionID) {
        console.log(req.body.money);
        console.log(req.body.sessionID);
        if(req.body.sessionID == sessionID) {
            if(Math.random() < 0.47) {
                console.log('user won')
            } else {
                console.log('user lost')
            }
        }
        res.status(200).json()
    } else {
        console.log('fuck')
        res.status(400).json()
    }
})

//goes and finds new game for player
app.post('findGame', (req, res) => {
    
});

app.listen(port, () => {
    console.log('ok')
});


//functions
function addSessionID(sessionID, userID) {
    database.query('INSERT INTO `sessionids` (`User`, `SessionID`) VALUES (?, ?);', [userID, sessionID])
        .then(resolve => {console.log(resolve + 'succesfully creted session id link')})
        .catch(reject => {console.log(reject + ' not successfull')});
}
