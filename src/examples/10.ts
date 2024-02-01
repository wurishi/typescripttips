type CheckForBadArgs<Arg> = Arg extends any[]
    ? '无法使用 deepEqualCompare 判断数组是否相同'
    : Arg

export const deepEqualCompare = <Arg>(
    a: CheckForBadArgs<Arg>,
    b: CheckForBadArgs<Arg>
): boolean => {
    if (Array.isArray(a) || Array.isArray(b)) {
        throw new Error('无法使用 deepEqualCompare 判断数组是否相同')
    }
    return a === b
}

deepEqualCompare(1, 1)
// deepEqualCompare([], ['a'])
