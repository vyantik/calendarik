import Comment from "../models/Comment.js";
import CommentDto from "../utils/comment-dto.js";

class CommentService {
	static async get_comments_dto(comments: Comment[]): Promise<CommentDto[]> {
		const comments_dto: CommentDto[] = [];

		for (const comment of comments) {
			comments_dto.push(new CommentDto(comment));
		}

		return comments_dto;
	}
}

export default CommentService;
