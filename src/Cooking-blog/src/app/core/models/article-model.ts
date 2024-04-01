import Base from "./base-model";

interface ArticleModel extends Base {
    author: string;
    modified?: string;
    headline: string;
    content: string;
    image: string;
}
export default ArticleModel;