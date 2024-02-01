type Action = 'view' | 'create' | 'update' | 'delete';
type Role = 'anonymouse' | 'admin' | 'loggedIn';

export const userActions:
    {
        type: Action;
        roles: Role[];
    }[] = [
        {
            type: 'view',
            roles: ['anonymouse', 'admin']
        },
        {
            type: 'create',
            roles: ['admin']
        }
    ]

type Action1 = typeof userActions[number]["type"]
type Role1 = typeof userActions[number]['roles'][number]