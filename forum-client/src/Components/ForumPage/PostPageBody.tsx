import {Post} from "../../Models/Posts/PostsInterfaces";
import {usePostContext} from "../../lib/PostsProvider";
import React, {createContext, useContext, useEffect} from "react";
import PostPageSectionContext from "./PostPageSectionContext";
import PostCommentsContainer from "../Comments/PostCommentsContainer";


type PostProvider = {
    post: Post;
    setPost:  React.Dispatch<React.SetStateAction<Post>>
}

const CurrPostContext = createContext<PostProvider | undefined>(undefined);

export const useCurrPostContext = () =>{
    const context = useContext(CurrPostContext);
    if (!context) {
        throw new Error("useCurrPostContext must be used within the context");
    }
    
    return context;
}

export default function PostPageBody({postId}: {postId: string}) {
    const {getPost, post, setPost, isLiked} = usePostContext();

    useEffect(() => {
        getPost(postId);
        isLiked(postId);
    }, []);
    
    return(
        <>
            <div className="AnnouncementsAndPostsBody">
                <div className="AnnouncementsAndPosts-UpperBlock">
                    <div></div>
                    <h1 className="AnnouncementsAndPosts-H1">{post.title}</h1>
                    <div></div>
                </div>
                <div className="PostAndAnnouncementDetails-Container">
                    <CurrPostContext.Provider value={{post, setPost: setPost}}>
                        <PostPageSectionContext/>
                        {post.withComments && <PostCommentsContainer postId={postId}/>}
                    </CurrPostContext.Provider>
                </div>
            </div>
        </>
    )
}