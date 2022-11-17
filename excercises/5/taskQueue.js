import { EventEmitter } from 'events'

export class TaskQueue extends EventEmitter
{
    constructor (limit) {
        super()

        this.limit = limit || 1;
        this.queue = [];
        this.running = 0;
    }
    
    async next () {
        if(this.running === 0 && this.queue.length === 0) {
            return this.emit('empty');
        }

        while (this.running < this.limit && this.queue.length) {

            const task = this.queue.shift();
            try {
                this.running++;
                await task()
                this.running--;
            } catch (err) {
                if (err) this.emit('error', err);                
            }
            this.next();
        }
    }

    runTask( task ) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await task()
                    resolve(result)
                } catch (err) {
                    reject(err)
                }                
            })
            process.nextTick(this.next.bind(this))
        })
    }
}