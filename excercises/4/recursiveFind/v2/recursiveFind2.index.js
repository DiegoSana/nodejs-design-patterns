import { recursiveFind } from './recursiveFind2.js'

recursiveFind('../../files', 'one', (err, findingsFiles) => { 
    if( err ) return console.log('Error: ' + err)

    console.log('All done: ')
    console.log(findingsFiles)
});