export interface Comment{
    id: string,
    text: string,
    createdAt: Date,
    postId: string,
    authorId: string,
    authorEmail: string,
    authorImage: string,
    authorRole: string,
    likes: number,
    replyTo: string,
    repliesToComment: Comment[],
}

export interface CommentAddDto{
    id: string;
    text: string;
    authorId: string;
    postId: string;
    replyTo?: string;
}