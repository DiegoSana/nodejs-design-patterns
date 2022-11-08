import { readdir } from 'fs'
import { readFile } from 'node:fs';
import { RecursiveQueue } from "./recursiveQueue.js";

const findingsFiles = new Set()

function searchInfile(file, keyword, cb) {
    readFile(file, 'utf8', (err, data) => {
        //console.log(file)
        return cb('asdfasdf')
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
                readFilesQueue.pushTask((cb) => {
                    searchInfile(dir + '/' + elem.name, keyword, cb)
                })
            } else {
                // Recursive
                recursiveDirRead(dir + '/' + elem.name, keyword, readFilesQueue, cb)
            }
        }    
    })

}

export function recursiveFind(dir, keyword, done, concurrency = 2) {

    const readFilesQueue = new RecursiveQueue(concurrency)

    readFilesQueue.on('error', function(err, task) {
        done('Task experienced an error: ' + err);
    });

    readFilesQueue.on('empty', function() {
        console.log('empty')
        done(null, findingsFiles);
    });

    recursiveDirRead(dir, keyword, readFilesQueue, done)
}