// type IconSize = 'sm' | 'xs' | Omit<string, 'sm' | 'xs'>

type IconSize = LooseAutoComplete<'sm' | 'xs'>

export type LooseAutoComplete<T extends string> = T | Omit<string, T>

interface IconProps {
    size: IconSize
}

const a: IconProps = {
    size: 'sm',
}

const b: IconProps = {
    size: 'sth',
}

// export const Icon = (props: IconProps) => {
//     return <></>
// }

// const Comp1 = () => {
//     return (
//         <>
//             <Icon size="sm" />
//             <Icon size="sth" />
//         </>
//     )
// }
