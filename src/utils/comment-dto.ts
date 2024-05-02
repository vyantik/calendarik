import Comment from "../models/Comment.js";

class CommentDto {
	id: number;
	user_id: number;
	comment: string;

	constructor(model: Comment) {
		this.id = model.id;
		this.user_id = model.user_id;
		this.comment = model.comment;
	}
}

export default CommentDto;
