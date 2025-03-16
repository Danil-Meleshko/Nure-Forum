import {GroupVisibility} from "./GroupVisibilityArray";

export interface Post{
    id: string,
    title: string,
    text: string,
    createdAt: Date,
    authorId: string,
    authorEmail: string,
    authorImage: string,
    authorRole: string,
    likes: number,
    amountOfComments: number,
    isEdited: boolean,
    withComments: boolean,
    groupVisibility: string[]
}

export interface PostAddDto{
    id: string,
    title: string,
    text: string,
    authorId: string,
    withComments: boolean,
    groupVisibility: string[]
}

export interface PostEditDto{
    title?: string,
    text?: string,
    withComments?: boolean,
    groupVisibility?: string[]
}