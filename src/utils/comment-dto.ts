import Comment from "../models/Comment.js";

class CommentDto {
	id: number;
	user_name: string;
	comment: string;

	constructor(model: Comment) {
		this.id = model.id;
		this.user_name = model.user_name;
		this.comment = model.comment;
	}
}

export default CommentDto;
