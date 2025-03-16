import AddPostForm from "../../Components/OwnPostsPage/AddPostForm";
import { PostsProvider } from "../../lib/PostsProvider";
import "../../Styles/AddPostPage.css";
import React from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

export default function AddPost(){
    
    return (
        <React.Fragment>
            <Navbar/>
            <PostsProvider>
                <AddPostForm/>
            </PostsProvider>
            <Footer/>
        </React.Fragment>
    )
}