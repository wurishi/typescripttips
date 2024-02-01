import React from 'react'

const MyComponent = (props: { enabled: boolean }) => {
    return null
}

class MyOtherComponent extends React.Component<{
    enabled: boolean
}> {}

type PropsFrom<TComponent> = TComponent extends React.FC<infer Props>
    ? Props
    : TComponent extends React.Component<infer Props>
    ? Props
    : never

export const props: PropsFrom<typeof MyComponent> = {
    enabled: true,
}

export const props2: PropsFrom<MyOtherComponent> = {
    enabled: true,
}
