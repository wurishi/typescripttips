interface TableProps<TItem> {
    items: TItem[]
    renderItem: (item: TItem) => React.ReactNode
}

export function Table<TItem>(props: TableProps<TItem>) {
    return null
}

const Component = () => {
    return (
        <Table<{ id: string }>
            items={[{ id: '1' }]}
            renderItem={(item) => <div>{item.id}</div>}
        ></Table>
    )
}