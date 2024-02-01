export type Letters = 'a' | 'b' | 'c'

type RemoveC<TType> = TType extends 'c' ? never : TType

type WithoutC = RemoveC<Letters>

type A = Omit<Letters, 'b'>

type RemoveAny<TType, RType> = TType extends RType ? never : TType

type B = RemoveAny<Letters, 'b'>

type Test = {
    a: number;
    b: string;
    c: Date;
}

type C = Omit<Test, 'b'>