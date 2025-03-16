import React from "react";
import Navbar from "../../Components/Navbar";
import {PostsProvider} from "../../lib/PostsProvider";
import {useParams} from "react-router-dom";
import Footer from "../../Components/Footer";
import CommentsProvider from "../../lib/CommentsProvider";
import PostPageBody from "../../Components/ForumPage/PostPageBody";

export default function Post() {
    const {postId} = useParams<{postId: string}>();
    
    return (
        <React.Fragment>
            <Navbar/>
            <PostsProvider>
                <CommentsProvider>
                    <PostPageBody postId={postId || ""}/>
                </CommentsProvider>
            </PostsProvider>
            <Footer/>
        </React.Fragment>
    )
}