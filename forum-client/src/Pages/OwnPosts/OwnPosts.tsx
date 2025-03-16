import React from "react";
import Navbar from "../../Components/Navbar";
import {PostsProvider} from "../../lib/PostsProvider";
import OwnPostsBody from "../../Components/OwnPostsPage/OwnPostsBody";
import Footer from "../../Components/Footer"; 


export default function OwnPosts() {
    return (
        <div>
            <Navbar />
            <PostsProvider>
                <OwnPostsBody />
            </PostsProvider>
            <Footer/>
        </div>
    );
}