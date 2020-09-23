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
    console.log("Removing standup: " + key)
    obj[key].stop();
}

function removeAll(obj) {
    console.log("Removing all standups: ")
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key].stop();
        }
    }
}

function append(standups, standup, crons, taskStore) {
    console.log("Adding standup: " + standup.id + " with cron:" + standup.cron)
    standups.push(standup);
    crons[standup.id] = new CronJob(standup.cron, () => {
        const uuid = uuidv4();
        const stamp = timeStamp();
        console.log(stamp + ' ' + standup.id + ' ' + uuid);
        taskStore.push({ id: uuid, stamp, standupId: standup.id })
    }, null, true)
}
function printReport(taskArr, standups) {
    console.log("\n\n==============================Printing-Reports=====================================\n\n");
    standups.forEach(standup => {
        console.log("For Standup:" + standup.id + " and cron:" + standup.cron);
        taskArr.filter(task => task.standupId === standup.id).forEach(task => console.log(task.id + ' ' + task.stamp + ' ' + task.standupId));
        console.log("\n")
    })
    // taskArr.forEach(task => console.log(task.id + ' ' + task.stamp + ' ' + task.standupId));
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
setTimeout(printReport, 1000 * 65, taskStore, standups);

app.listen(4000, () => {
    console.log("Server started at: " + timeStamp())
});