const mapAsync = async (iterable, callback, concurrency) => {

    const queue = []
    let running = 0


    function runTask(task) {
        return new Promise((resolve, reject) => {
            queue.push( () => {
                return callback(task)
            } )

            process.nextTick(next)
        })        
    }

    function next() {
        while(queue.length > 0 && running < concurrency) {
            const queueTask = queue.shift()

            running++
            let result = queueTask()
            result.finally( () => {running--; next()} )
        }
    }


    return await Promise.all(iterable.map( item => { runTask(item) } ))

}

const array = [1,2,3,4,5,6,7,8]
const myCallbackDuplicateValue = (number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('solving: 2 * ' + number)
            resolve(number * 2)
        }, 4000)        
    })
}

mapAsync(array, (number) => { return myCallbackDuplicateValue(number) }, 3)