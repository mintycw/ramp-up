import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetDataQuery } from "../../logic/apiSlice";
import { showToast } from "../../app/redux-reducers/contextProvider";

import apiService from "../../logic/apiService";
import Footer from "../ui/Footer";
import Header from "../ui/Header";

function Layout() {
    const title = useSelector((state) => state.context.title);

    const [isModalOpen, setIsModalOpen] = useState({
        post: false,
        comment: false,
        postID: null,
        commentID: null,
    });

    const { refetch } = useGetDataQuery("/account/user");

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/feed");
        }
    }, []);

    function logOut() {
        dispatch(showToast({ message: "Logging out...", level: 0 }));
        // Clear Cache
        apiService.post("/auth/logout").then(() => {
            refetch();
            navigate("/auth/login");
        });
    }

    function handleModal(
        modalToUpdate,
        postToUpdate = null,
        commentToUpdate = null,
    ) {
        if (modalToUpdate === "close") {
            setIsModalOpen({
                post: false,
                comment: false,
                postID: null,
                commentToUpdate: null,
            });
            return;
        }

        setIsModalOpen((prev) => ({
            ...prev,
            [modalToUpdate]: !prev[modalToUpdate],
            postID: postToUpdate,
            commentID: commentToUpdate,
        }));
    }

    return (
        <div className="flex-col sm:relative sm:flex h-dvh">
            <span className="text-dark-text z-50 hidden font-bold sm:fixed sm:flex sm:h-14 sm:w-full sm:items-center sm:justify-center sm:gap-2 sm:text-xl">
                {title}
            </span>
            <div className="bg-dark-bg text-dark-text flex h-full flex-col sm:flex-row-reverse sm:items-center sm:justify-center sm:gap-4">
                <Header
                    logOut={logOut}
                    isModalOpen={isModalOpen}
                    handleModal={handleModal}
                />
                <div className="sm:bg-dark-bg-shade flex w-full flex-col pt-14 flex-1 sm:h-[calc(100vh-7rem)] sm:max-w-md sm:justify-start sm:rounded-xl sm:pt-0 sm:shadow-xl md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl overflow-hidden overflow-y-auto no-scrollbar">
                    <Outlet context={{ handleModal }} />
                </div>
                <Footer
                    logOut={logOut}
                    isModalOpen={isModalOpen}
                    handleModal={handleModal}
                />
            </div>
        </div>
    );
}

export default Layout;