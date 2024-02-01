export interface ColorVariants {
    primary: 'blue';
    secondary: 'red';
    tertiary: 'green';
}

type PrimaryColor = ColorVariants['primary']; // blue

type NonPrimaryColor = ColorVariants['secondary' | 'tertiary']; // red | green

type EveryColor = ColorVariants[keyof ColorVariants]; // blue | red | green

type Letters = ['a', 'b', 'c'];

type AOrB = Letters[0 | 1]; // a | b

type Letter = Letters[number]; // a | b | c

interface UserRoleConfig {
    user: ['view', 'create', 'update'];
    superAdmin: ['view', 'create', 'update', 'delete'];
}

type Role = UserRoleConfig[keyof UserRoleConfig][number]; // view | create | update | delete