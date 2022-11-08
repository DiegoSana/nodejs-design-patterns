import { EventEmitter } from 'events'

export class RecursiveQueue extends EventEmitter
{
    constructor (limit) {
        super()

        this.limit = limit || 1;
        this.queue = [];
        this.running = 0;
    }

    pushTask (task) {
        this.queue.push(task);
        process.nextTick(this.next.bind(this));
        return this;
    }
    
    next () {
        if(this.running === 0 && this.queue.length === 0) {
            return this.emit('empty');
        }

        while (this.running < this.limit && this.queue.length) {
            const task = this.queue.shift();

            task(err => {
                if (err) {
                    this.emit('error', err);
                }

                this.running--;
                process.nextTick(this.next.bind(this));
            });

            this.running++;
        }
    }

    isEmpty () {
        return this.running === 0 && this.queue.length === 0;
    }
}