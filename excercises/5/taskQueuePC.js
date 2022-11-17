export class TaskQueuePC {
    constructor (concurrency) {
      this.taskQueue = []
      this.consumerQueue = []
  
      // spawn consumers
      for (let i = 0; i < concurrency; i++) {
        this.consumer()
      }
    }
  
    consumer () {
        this.getNextTask()
            .then( task => task() )
            .then( () => this.consumer() )
            .catch( err => console.error(err) )      
    }
  
    getNextTask () {
      return new Promise((resolve) => {
        if (this.taskQueue.length !== 0) {
          return resolve(this.taskQueue.shift())
        }
  
        this.consumerQueue.push(resolve)
      })
    }
  
    runTask (task) {
      return new Promise((resolve, reject) => {
        const taskWrapper = () => {
          const taskPromise = task()
          taskPromise.then(resolve, reject)
          return taskPromise
        }
  
        if (this.consumerQueue.length !== 0) {
          // there is a sleeping consumer available, use it to run our task
          const consumer = this.consumerQueue.shift()
          consumer(taskWrapper)
        } else {
          // all consumers are busy, enqueue the task
          this.taskQueue.push(taskWrapper)
        }
      })
    }
  }



const MAX_CONCURRENCY = 4;
const queue = new TaskQueuePC(MAX_CONCURRENCY);

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Resolved ${ms}`);
      resolve('Resolved successfully');
    }, ms);
  });
}

function taskCreator (ms) {
  return async function () {
    await wait(ms);
  }
}

[taskCreator(3000), taskCreator(4000), taskCreator(5000), taskCreator(6000), taskCreator(7000), taskCreator(8000), taskCreator(9000)].forEach((task) => {
  queue.runTask(task);
})