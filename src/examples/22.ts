export let age = 31;

age = 32;

export const name = 'Matt';

// name = 'lala';

export const tsPeople = [
    'Andarist',
    'Titian',
    'Devansh',
    'Anurag',
];

tsPeople[0] = 'Hello';

export const moreTsPeople = {
    'Andarist': 'Andarist',
    'Titian': 'Titian',
    'Devansh': 'Devansh',
    'Anurag': 'Anurag',
    arr: [1],
    obj: {
        a: 'a',
        b: 'b',
    }
} as const;

// moreTsPeople.Andarist = 'Whatever';
// moreTsPeople.arr[0] = 13;
// moreTsPeople.obj.b = 'str';