export interface Announcement{
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

export interface AnnouncementAddDto{
    id: string,
    title: string,
    text: string,
    authorId: string,
    withComments: boolean,
    groupVisibility: string[]
}

export interface AnnouncementEditDto{
    title?: string,
    text?: string,
    withComments?: boolean,
    groupVisibility?: string[]
}