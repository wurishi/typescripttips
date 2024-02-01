interface Animal {
    name: string;
}

interface Human {
    firstName: string;
    lastName: string;
}

export const getDisplayName = <TItem extends Animal | Human>(item: TItem):
    TItem extends Human ? { humanName: string } : { animalName: string } => {
    if ('name' in item) {
        // return { animalName: item.name }
        // 不加 as 会提示错误？
        return { animalName: item.name } as TItem extends Human ? { humanName: string } : { animalName: string }
    }
    // return { humanName: item.firstName + '_' + item.lastName }
    return { humanName: item.firstName + '_' + item.lastName } as TItem extends Human ? { humanName: string } : { animalName: string }
}

const result1 = getDisplayName({ name: 'Patch' })
const result2 = getDisplayName({
    firstName: 'Matt', lastName: 'hehe'
})