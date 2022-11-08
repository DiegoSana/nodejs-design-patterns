import {readdir} from 'fs'
import { readFile } from 'node:fs';

let queue = 0;
const findingsFiles = new Set()

function searchInfile(file, keyword, cb) {
    queue++
    readFile(file, 'utf8', (err, data) => {

        if (err) return cb(err);                

        if(data.indexOf(keyword) >= 0) {
            findingsFiles.add(file)
        }
        queue--

        if(queue <= 0) {
            return cb(null, findingsFiles)
        }
    })
}

export function recursiveFind(dir, keyword, cb) {

    readdir(dir, { withFileTypes: true }, (err, findings) => {
        
        if (err) cb(err);

        for (const elem of findings) {

            if(!elem.isDirectory()) {
                // searchInfile
                searchInfile(dir + '/' + elem.name, keyword, cb)
            } else {
                // Recursive
                recursiveFind(dir + '/' + elem.name, keyword, cb)
            }
        }
    })

}

recursiveFind('./files', 'one', (err, findingsFiles) => {
    if(err) {
        console.log(err)
        return
    }

    console.log(findingsFiles)
    console.log('End!')
})