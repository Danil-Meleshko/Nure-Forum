import React from "react";
import '../../Styles/Forum.css';
import Navbar from "../../Components/Navbar";
import { PostsProvider } from "../../lib/PostsProvider";
import PostsList from "../../Components/ForumPage/PostsList";
import Footer from "../../Components/Footer";

export default function Forum(){
    return (
        <div className="Home">
            <Navbar />
            <PostsProvider>
                <PostsList/>
            </PostsProvider>
            <Footer/>
        </div>
    )
}