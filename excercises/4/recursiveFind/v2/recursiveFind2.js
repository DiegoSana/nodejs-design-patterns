import { readdir } from 'fs'
import { readFile } from 'node:fs';
import { queue } from 'async';

const findingsFiles = new Set()

function searchInfile(file, keyword, cb) {
    readFile(file, 'utf8', (err, data) => {
        //console.log(file)
        //return cb('asdfasdf')
        if (err) return cb(err);
        
        if(data.indexOf(keyword) >= 0) {
            findingsFiles.add(file)
        }

        cb(null, findingsFiles)
    })
}

function recursiveDirRead(dir, keyword, readFilesQueue, cb) {

    readdir(dir +'/', { withFileTypes: true }, (err, findings) => {

        if (err) return cb(err)

        for (const elem of findings) {

            if(!elem.isDirectory()) {
                // searchInfile queue task
                readFilesQueue.push({name: dir + '/' + elem.name, keyword});
            } else {
                // Recursive
                recursiveDirRead(dir + '/' + elem.name, keyword, readFilesQueue)
            }
        }    
    })

}

export function recursiveFind(dir, keyword, done, concurrency = 2) {

    const readFilesQueue = new queue((task, done) => {
        searchInfile(task.name, task.keyword, done)
    }, concurrency)

    readFilesQueue.drain(() => {
        done(null, findingsFiles)
    })

    readFilesQueue.error(function(err, task) {
        done('Task ' + task.name + ' experienced an error: ' + err);
    });

    recursiveDirRead(dir, keyword, readFilesQueue, done)
}