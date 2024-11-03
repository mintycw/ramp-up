import React, { useState, useEffect } from "react";
import { useGetDataQuery } from "../../logic/apiSlice";
import { useDispatch } from "react-redux";

import apiService from "../../logic/apiService";
import img from "../../assets/images/profilepicture.jpg";

import { showToast } from "../../app/redux-reducers/contextProvider";
import { FaPenFancy } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function WritePost({ isModalOpen, handleModal }) {
    const [postContent, setPostContent] = useState("");
    const [postCategory, setPostCategory] = useState("");
    const [categories, setCategories] = useState([]);

    const { data: accountData, isSuccess } = useGetDataQuery("/account/user");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isModalOpen.post || isModalOpen.comment) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen]);

    useEffect(() => {
        apiService.get("/feed/categories", {}).then((res) => {
            setCategories(res.result);
        });
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        const newLineCount = (value.match(/\n/g) || []).length;

        if (newLineCount > 25) {
            dispatch(
                showToast({
                    message: "You can only have a maximum of 25 new lines",
                    level: 2,
                }),
            );
            return;
        }

        setPostContent(value);
    };

    const handleSelect = (e) => setPostCategory(e.target.value);

    function handlePost() {
        if (!postContent) {
            alert("Please complete all fields");
            return;
        }

        if (postContent.length > 500) {
            alert("Post content is too long");
            return;
        }

        const payload = {
            postID: isModalOpen.postID,
            accountID: accountData.accountID,
            body: postContent,
            parentCommentID: isModalOpen.commentID,
            categoryID: postCategory === "" ? null : postCategory,
        };

        if (isModalOpen.post) {
            // Post a new post
            apiService.post("/feed/post", payload).then((res) => {
                if (!res.success) {
                    alert(res.message || "An error occurred.");
                    return;
                }

                navigate(0);
            });
        } else if (isModalOpen.comment) {
            // Post a new comment/reply
            apiService.post("/post/comment", payload).then((res) => {
                if (!res.success) {
                    alert(res.message || "An error occurred.");
                    return;
                }

                navigate(0);
            });
        }

        setPostContent("");
        setPostCategory("");
        handleModal("close");
    }

    return (
        <>
            {/* Open menu button */}
            <div
                className={`duration-400 fixed bottom-24 right-4 z-10 ease-in-out sm:relative sm:bottom-auto sm:right-auto ${isModalOpen.post || isModalOpen.comment ? "translate-y-40 sm:translate-y-0" : "translate-y-0"}`}
            >
                <button
                    onClick={() => handleModal("post")}
                    className="bg-dark-secondary border-dark-accent flex size-12 items-center justify-center rounded-full border-2 shadow-md duration-150 ease-in-out hover:shadow-lg sm:size-14"
                >
                    <FaPenFancy className="text-dark-accent hover:text-dark-primary size-5 duration-150 ease-in-out sm:size-7" />
                </button>
            </div>

            {/* Modal */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-in-out ${
                    isModalOpen.post || isModalOpen.comment
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                }`}
            >
                {/* Background */}
                <div
                    onClick={() => handleModal("close")}
                    className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out ${
                        isModalOpen.post || isModalOpen.comment
                            ? "opacity-50"
                            : "opacity-0"
                    }`}
                />

                {/* Write post container */}
                <div
                    className={`bg-dark-bg h fixed z-[999] h-full max-h-96 w-4/5 rounded-xl pb-12 transition-transform duration-500 ease-in-out sm:max-w-md ${
                        isModalOpen.post || isModalOpen.comment
                            ? "translate-y-0 scale-100 opacity-100"
                            : "translate-y-full scale-90 opacity-0"
                    }`}
                >
                    {/* Header */}
                    <div className="border-dark-primary flex h-12 w-full flex-row items-center justify-between border-b px-5">
                        <button
                            onClick={() => handleModal("close")}
                            className="hover:text-dark-secondary duration-150 ease-in-out hover:underline"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handlePost()}
                            disabled={!postContent}
                            className={`border-dark-secondary hover:text-dark-primary rounded-full border px-4 py-0.5 shadow-md duration-300 ease-in-out hover:shadow-lg hover:brightness-75 ${
                                postContent
                                    ? "bg-dark-secondary text-dark-primary"
                                    : "text-dark-secondary bg-transparent"
                            }`}
                        >
                            Post
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex h-full flex-col px-5 py-3">
                        <div className="flex h-full flex-row gap-2.5">
                            {/* Profile picture */}
                            <img className="size-12 rounded-full" src={img} />
                            {/* Content */}
                            <div className="flex h-full w-full flex-col">
                                {/* Header */}
                                <div className="flex flex-col">
                                    <h5 className="text-base font-bold">
                                        @{isSuccess && accountData.username}
                                    </h5>
                                    {isModalOpen.post && (
                                        <select
                                            onChange={(e) => handleSelect(e)}
                                            defaultValue={postCategory}
                                            className="bg-dark-bg text-dark-secondary ml-0 flex text-sm focus:outline-none"
                                        >
                                            <option value={""}>Category</option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.categoryID}
                                                    value={category.categoryID}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Input */}
                                <textarea
                                    placeholder={
                                        isModalOpen.post
                                            ? "What's on your mind? (max 500 characters)"
                                            : "Add a comment... (max 500 characters)"
                                    }
                                    onChange={(e) => handleChange(e)}
                                    value={postContent}
                                    className="bg-dark-bg h-full w-full flex-grow resize-none text-sm focus:outline-none"
                                    maxLength={500}
                                />

                                <span className="text-dark-text-0.5 flex justify-end text-sm">
                                    {postContent.length}/500
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WritePost;
