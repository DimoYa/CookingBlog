import Base from "./base-model";

interface CommentModel extends Base {
    _id: string;
    content: string;
    author: string;
    authorPicture: string;
    articleId: string;
    likes: string[];
}
export default CommentModel;