export const makeKeyRemover = 
<Key extends string>(keys: Key[]) => 
<Obj extends object>(obj: Obj): Omit<Obj, Key> => {
    return {} as any // 具体实现
}

const keyRemover = makeKeyRemover(['a', 'b'])

const newObject = keyRemover({ a: 1, b: 2, c: 3 })

newObject.c
