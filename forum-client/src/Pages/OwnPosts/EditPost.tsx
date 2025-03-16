import React from "react";
import Navbar from "../../Components/Navbar";
import {useParams} from "react-router-dom";
import {PostsProvider} from "../../lib/PostsProvider";
import EditPostBody from "../../Components/OwnPostsPage/EditPostBody";
import Footer from "../../Components/Footer";

export default function EditPost() {
    const { postId } = useParams<{ postId: string}>();
    
    return (
        <React.Fragment>
            <Navbar/>
            <PostsProvider>
                <div className="EditPostBody">
                    <EditPostBody postId={postId!}/>
                </div>
            </PostsProvider>
            <Footer/>
        </React.Fragment>
    )
}