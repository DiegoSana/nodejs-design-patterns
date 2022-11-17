const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, 'foo');
});
const promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, 'bar');
  });

const promise3 = new Promise((resolve, reject) => {
    setTimeout(reject, 3000, 'baz');
  });

const promiseAll = async ([...promises]) => {

    const output = []
    for (let promise of promises) {
        output.push(await promise)
    }

    return output
}

try {
    const result = await promiseAll([promise1, promise3, promise2])
    console.log(result)
} catch (err) {
    console.log(err)
}