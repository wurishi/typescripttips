declare global {
    function postFn(userId: string, title: string): void
}

export class SDK {
    constructor(public loggedInUserId?: string) { }

    createPost(title: string) {
        this.assertUserIsLoggedIn();

        postFn(this.loggedInUserId, title);
    }

    assertUserIsLoggedIn(): asserts this is this & { loggedInUserId: string } {
        if (!this.loggedInUserId) {
            throw new Error('User is not logged in');
        }
    }
}