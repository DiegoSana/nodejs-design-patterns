import {readdir} from 'fs'

let fileList = []
let activdeRead = 0

export function listNestedFiles(dir, nesting, cb)
{

    activdeRead++

    readdir(dir, { withFileTypes: true }, (err, findings) => {
        if(err) {
            return cb(err)
        }

        for (let f of findings.filter(f => f.name != 'node_modules')) {
            if (!f.isDirectory()) {
                fileList.push(dir + '/' + f.name)
            } else {
                if(activdeRead <= nesting) {
                    listNestedFiles(dir + '/' + f.name, nesting - 1, cb)
                }                
            }
        }
        activdeRead--

        if(activdeRead <= 0 || nesting <= 0) {
            return cb(null, fileList)
        }
    })

}


listNestedFiles('../../', 2, (err, files) => {
    if(err) {
        console.log(err)
        return
    }

    console.log(files)
    console.log('End!')
})