interface UserInfo {
    name: string;
    role?: "admin";
}

// interface UserInfo {
//     name: string;
//     role: "admin" | undefined;
// }

export const createUser = (userInfo: UserInfo) => { };

createUser({
    name: 'Matt'
});

createUser({
    name: 'David'
});

createUser({
    name: 'Laura'
});