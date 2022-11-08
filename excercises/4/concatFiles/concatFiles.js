import {readFile, writeFile} from 'fs'

export function concatFiles(destFile, cb, files) {
    if(files.length == 0) {
        // fin del programa
        return cb()
    }

    console.log(files)

    let file = files.shift()
    readFile(file, 'utf-8', (err, data) => {
        if (err) return cb(err)

        readFile(destFile, 'utf-8', (err, dataDest) => {
            if (err) return cb(err)

            console.log('File readed! ' + file)

            writeFile(destFile, dataDest + data, (err) => {
                if (err) return cb(err)
                console.log('The file has been saved! ' + destFile);
                concatFiles(destFile, cb, files)
            })
        })
    })
}

concatFiles(
    '../../excercises/4/files/result.txt', 
    (err) => { 
        if(err) { 
            console.log(err) 
            return
        } 
        console.log('End!')
    },    
    [
        '../../excercises/4/files/one.txt', 
        '../../excercises/4/files/two.txt'
    ]
)