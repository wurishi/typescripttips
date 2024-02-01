export const myObj: Record<string, string[]> = {};

myObj.foo.push('bar');

myObj.foo?.push('bar');

if (myObj.foo) {
    myObj.foo.push('bar');
}

if (!myObj.foo) {
    myObj.foo = []
}