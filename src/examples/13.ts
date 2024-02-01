// export type Action = 'ADD_TODO' | 'EDIT_TODO' | 'REMOVE_TODO'

export type ActionModule = typeof import('./13_constants')

export type Action = ActionModule[keyof ActionModule]
