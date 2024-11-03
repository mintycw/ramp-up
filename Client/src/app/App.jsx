import React, { useRef } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useGetDataQuery } from "../logic/apiSlice";
import AuthLayout from "../components/layout/AuthLayout";
import Layout from "../components/layout/Layout";
import ToastContainer from "../components/layout/ToastContainer";

import Login from "../pages/auth/Login";
import Feed from "../pages/Feed";
import NotFound from "../components/NotFound";
import Messages from "../pages/Messages";
import Notifications from "../pages/Notifications";
import Search from "../pages/search/Search";
import Friends from "../pages/Friends";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import PostOverview from "../pages/post/PostOverview";
import Signup from "../pages/auth/Signup";
import AdminUsers from "../pages/admin/Users";

function App() {
    return (
        <>
            <ToastContainer />

            <Routes>
                <Route path="auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                </Route>
                <Route path="/" element={<ProtectedRoute component={Layout} />}>
                    <Route path="feed" element={<Feed />} />
                    <Route path="friends" element={<Friends />} />
                    <Route path="search" element={<Search />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="messages" element={<Messages />} />
                    <Route
                        path="posts/:postID/:commentID?/:replyID?"
                        element={<PostOverview />}
                    />
                    <Route path="profile">
                        <Route path=":id/*" element={<Profile />} />
                        <Route path="edit" element={<EditProfile />} />
                    </Route>

                    <Route path="admin" element={<AdminProtectedRoute />}>
                        <Route path="users" element={<AdminUsers />} />
                    </Route>
                </Route>

                {/* This route will NOT go through the protectedRoutes middleware. This has been tested and works, i suggest never touching it again. */}
                <Route path="/" element={<Layout />}>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    );
}

const ProtectedRoute = ({ component: Component }) => {
    const loadingComponent = useRef(null);
    let { isLoading, isSuccess } = useGetDataQuery("/account/user");

    return (
        <>
            <div
                ref={loadingComponent}
                onAnimationEnd={() => {
                    // Hide the div after the animation ends
                    if (loadingComponent.current) {
                        loadingComponent.current.classList.add("hidden");
                    }
                }}
                className={`bg-dark-bg text-dark-primary fixed inset-0 z-50 flex items-center justify-center ${isSuccess && "animate-fadeOut"}`}
            >
                <h1 className="pattaya my-6 animate-pulse text-3xl font-bold">
                    Meer of Minder
                </h1>
            </div>
            {isSuccess && <Component />}
            {!isLoading && !isSuccess && <Navigate to="/auth/login" />}
        </>
    );
};

const AdminProtectedRoute = () => {
    let { data: accountData } = useGetDataQuery("/account/user");

    // Check if the user has permission permissionID === 1 for admin
    return accountData && accountData.permissionID === 1 ? (
        <Outlet />
    ) : (
        <Navigate to="/feed" />
    );
};
export default App;
