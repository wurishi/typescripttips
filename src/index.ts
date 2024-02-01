import { fruitCounts } from './examples/01'

const count = fruitCounts.apple + fruitCounts.banana + fruitCounts.pear
let num = 0
for (let i = 0; i < 100; i++) {
    num += count
}
console.log(num)

// const obj = {
//     a: num,
//     fn1() {
//         console.log(this)
//     },
//     fn2: () => {
//         console.log(this)
//     }
// }

export class TClass {
    private name: string;
    private score: number;
    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }

    public sayHi() {
        console.log(this.name, this.score)
    }

    public delaySay() {
        setTimeout(() => {
            console.log(this.name)
        }, 1000)
    }
}