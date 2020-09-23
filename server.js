const express = require("express")
const CronJob = require('cron').CronJob;
const app = express();
const { v4: uuidv4 } = require('uuid');

const timeStamp = () => {
    var date = new Date();
    var seconds = ("0" + date.getSeconds()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var hour = ("0" + date.getHours()).slice(-2);
    return `${hour}:${minutes}:${seconds}`
}



function remove(obj, key) {
    obj[key].stop();
}

function removeAll(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key].stop();
        }
    }
}

function append(standups, standup, crons, taskStore) {
    standups.push(standup);
    crons[standup.id] = new CronJob(standup.cron, () => {
        const uuid = uuidv4();
        const stamp = timeStamp();
        console.log(stamp + ' ' + standup.id + ' ' + uuid);
        taskStore.push({ id: uuid, stamp, standupId: standup.id })
    }, null, true)
}
function printReport(taskArr) {
    console.log("==============================Printing-Report=====================================\n\n\n\n")
    taskArr.forEach(task => console.log(task.id + ' ' + task.stamp + ' ' + task.standupId));
}

const crons = {};
const taskStore = [];
const standups = [
    { id: 'Each-fifth-second', cron: '0/5 * * * * *' },
    { id: 'Each-eighth-second', cron: '0/8 * * * * *' },
    { id: 'Each-fourteen-second', cron: '0/14 * * * * *' }
];
// Using cron
standups.forEach((standup) => {
    crons[standup.id] = new CronJob(standup.cron, () => {
        const uuid = uuidv4();
        const stamp = timeStamp();
        console.log(stamp + ' ' + standup.id + ' ' + uuid);
        taskStore.push({ id: uuid, stamp, standupId: standup.id })
    }, null, true)
})

setTimeout(remove, 1000 * 20, crons, 'Each-fifth-second');
setTimeout(append, 1000 * 30, standups, { id: 'Each-two-second', cron: '0/2 * * * * *' }, crons, taskStore);
setTimeout(removeAll, 1000 * 60, crons);
setTimeout(printReport, 1000 * 65, taskStore);

app.listen(4000, () => {
    console.log("Server started at: " + timeStamp())
});