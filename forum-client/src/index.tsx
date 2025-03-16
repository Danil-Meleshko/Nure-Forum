import React from 'react';
import ReactDOM from 'react-dom/client';
import "./Styles/index.css";
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import Announcements from './Pages/Announcements/Announcements';
import Forum from './Pages/Forum/Forum';
import LogIn from './Pages/Auth/LogIn';
import EditPost from "./Pages/OwnPosts/EditPost";
import AddPost from "./Pages/OwnPosts/AddPost";
import Post from "./Pages/Forum/Post";
import AuthProvider from "./lib/AuthProvider";
import Register from "./Pages/Auth/Register";
import AuthValidation from "./Components/AuthPage/AuthValidation";
import OwnAnnouncements from "./Pages/Announcements/OwnAnnouncements";
import AddAnnouncement from "./Pages/Announcements/AddAnnouncement";
import EditAnnouncement from "./Pages/Announcements/EditAnnouncement";
import Announcement from "./Pages/Announcements/Announcement";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ChangePassword from "./Pages/Auth/ChangePassword";
import OwnPosts from "./Pages/OwnPosts/OwnPosts";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <AuthProvider>
        <Router>
            <Routes>
                <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
                <Route path='/ChangePassword' element={<ChangePassword/>}/>
                <Route path='/Register' element={<Register/>}/>
                <Route path='/' element={<AuthValidation><Announcements/></AuthValidation>}/>
                <Route path='/Announcements' element={<Announcements/>}/>
                <Route path='/Announcements/EditAnnouncement/:announId' element={<EditAnnouncement/>}/>
                <Route path='/LogIn' element={<LogIn/>}/>
                <Route path='/Forum' element={<Forum/>}/>
                <Route path={`/Announcement/:announcementId`} element={<Announcement/>}/>
                <Route path='/OwnPosts' element={<OwnPosts/>}/>
                <Route path='/OwnPosts/EditPost/:postId' element={<EditPost/>}/>
                <Route path='/AddPost' element={<AddPost/>}/>
                <Route path='/Forum/Post/:postId' element={<Post/>}/>
                <Route path='OwnAnnouncements' element={<OwnAnnouncements/>}/>
                <Route path='AddAnnouncement' element={<AddAnnouncement/>}/>
            </Routes>
        </Router>
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
