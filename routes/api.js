/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true
});
const sendmail = require('sendmail')();

const sqlite = require('sqlite3').verbose();
let database = new sqlite.Database(process.env.DB_PATH);

router.post('/register', csrfProtection, (req, res, next) => {

    let checkinTime = (new Date()).getTime();
    let userInfo = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.phone,
        process.env.SIGNUP_POINTS,
        checkinTime
    ];
    var statement = database.prepare('INSERT INTO Member (first_name, last_name, email, phone, points, last_checkin) VALUES (?, ?, ?, ?, ?, ?);');
    statement.run(userInfo, (err, member) => {
        if (err) {
            res.json({
                code: 400,
                message: err
            });
        }
        database.run("INSERT INTO Checkin (memberId, time) VALUES (?, ?)", [statement.lastID, checkinTime], () => {
            sendmail({
                from: 'no-reply@trybaker.com',
                to: req.body.email,
                subject: 'Baker Loyalty - Thank you for registering!',
                html: 'Welcome to Baker Loyalty!  You now have ' + process.env.SIGNUP_POINTS + 'points for signing up and checking in you first time!',
            }, (err, reply) => {
                console.log(err && err.stack);
                console.dir(reply);
            });
            res.json({
                code: 200,
                message: "Registration created"
            });

        });
    });
});

router.post('/checkin', csrfProtection, (req, res, next) => {
    database.get('SELECT * FROM Member WHERE phone = ?', [req.body.phone], (err, member) => {
        if (err) {
            res.status(500).json({
                code: 500,
                message: err
            });
        }
        if (member) {
            database.get("SELECT * FROM Checkin WHERE memberId = ? ORDER BY time DESC;", [member.id], (err, checkin) => {
                if (err) {
                    res.status(400).json({
                        code: 400,
                        message: err
                    });
                }
                let checkinTime = (new Date()).getTime();
                let timePassed = (((checkinTime - checkin.time) / 1000) / 60);
                if (!checkin || timePassed > parseInt(process.env.CHECKIN_THROTTLE_MINUTES, 10)) {
                    let checkinPoints = parseInt(process.env.CHECKIN_POINTS, 10);
                    database.run("INSERT INTO Checkin (memberId, time) VALUES (?, ?)", [member.id, checkinTime], () => {
                        let newTotal = member.points + checkinPoints;
                        database.run("UPDATE Member SET points = ?, last_checkin = ? WHERE id = ?;", [newTotal, checkinTime, member.id], () => {

                            database.all("SELECT id FROM Checkin WHERE memberId = ?;", [member.id], (err, rows) => {
                                let totalCheckins = rows.length;
                                let mailContent = "<p>Thank you for checking in this visit!</p>" +
                                    "<p>You now have " + newTotal + " points!</p>" +
                                    "<p>You have checked in a total of " + totalCheckins + " times.</p>";
                                    console.log(mailContent);
                                sendmail({
                                    from: 'no-reply@trybaker.com',
                                    to: member.email,
                                    subject: 'Baker Loyalty - Points Total',
                                    html: mailContent,
                                }, (err, reply) => {
                                    console.log(err && err.stack);
                                    console.dir(reply);
                                });
                                res.json({
                                    code: 200,
                                    message: "User checked in",
                                    earned: checkinPoints,
                                    total: newTotal,
                                    checkins: totalCheckins
                                });
                            });
                        });
                    });
                } else {
                    res.status(403).json({
                        code: 403,

                    });
                }
            });

        } else {
            res.status(401).json({
                code: 404
            });
        }

    });
});

module.exports = router;