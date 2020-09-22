var express = require("express")
var CronJob = require('cron').CronJob;
var app = express();


const standups = [
    { id: 'Each fifth second', cron: '0/5 * * * * *' },
    { id: 'Each eight second', cron: '0/8 * * * * *' },
    { id: 'Each fourteen second', cron: '0/14 * * * * *' }
];
const crons = {};

// Using cron
standups.forEach((standup, index) => {
    crons[index] = new CronJob(standup.cron, () => {

        var date = new Date();
        // date.setTime(result_from_Date_getTime);

        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hour = date.getHours();
        console.log(`${hour}:${minutes}:${seconds}` + standup.id)
    }, () => { }, true)
})

setTimeout(remove, 1000 * 20, 0);
setTimeout(append, 1000 * 15, standups, { id: 'Each two second', cron: '0/2 * * * * *' });
function remove(index) {
    crons[index + ''].stop();
}

function append(standups, standup) {
    standups.push(standup);
    crons[standups.length - 1] = new CronJob(standup.cron, () => {
        var date = new Date();
        // date.setTime(result_from_Date_getTime);

        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hour = date.getHours();
        console.log(`${hour}:${minutes}:${seconds}` + standup.id)
    }, () => { }, true)
}

app.listen(4000, () => {
    console.log("Sever")
});