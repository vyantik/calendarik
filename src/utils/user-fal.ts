import User from "../models/User.js";

class UserFal{
    id: number;
    full_name: string;

    constructor(model: User) {
        this.id = model.id;
        this.full_name = model.full_name;
    }
}

export default UserFal;