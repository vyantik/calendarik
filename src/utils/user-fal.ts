import User from "../models/User.js";

class UserFal{
    id: number;
    full_name: string;
    is_visited: boolean;

    constructor(model: User, is_visited: boolean = false) {
        this.id = model.id;
        this.full_name = model.full_name;
        this.is_visited = is_visited;
    }
}

export default UserFal;