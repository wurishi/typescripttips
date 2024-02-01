export type Obj = {
    a: 'a',
    a2: 'a2',
    a3: 'hello',
    b: 'b',
    b1: 'b1',
    b2: 'b2',
}

type ValueOfKeysStartingWithA<T> = {
    [K in Extract<keyof T, `a${string}`>]: T[K];
}[Extract<keyof T, `a${string}`>]

type NewUnion = ValueOfKeysStartingWithA<Obj>  // "a" | "a2" | "hello"

type ValueOfKeysStartingWith<
    T,
    _ExtractedKeys extends keyof T = Extract<keyof T, `a${string}`>
> = {
    [K in _ExtractedKeys]: T[K]
}[_ExtractedKeys]

type AUnion = ValueOfKeysStartingWith<Obj> // "a" | "a2" | "hello"
type BUnion = ValueOfKeysStartingWith<Obj, Extract<keyof Obj, `b${string}`>> // "b" | "b1" | "b2"