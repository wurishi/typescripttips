export const myObject = {
    a: 1,
    b: 2,
    c: 3,
}

// Object.keys(myObject).forEach((key) => {
//     console.log(myObject[key])
// })

const objectKeys = <Obj extends Object>(obj: Obj): (keyof Obj)[] => {
    return Object.keys(obj) as (keyof Obj)[]
}

objectKeys(myObject).forEach((key) => {
    console.log(myObject[key])
})
