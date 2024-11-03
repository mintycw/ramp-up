import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetDataQuery } from "../../logic/apiSlice";

import { highlightHashtags } from '../../utils/highlightHashtags';
import useTimestamp from "../../hooks/useTimestamp";
import apiService from "../../logic/apiService";
import img from "../../assets/images/profilepicture.jpg";

import { IoShareSocialOutline, IoShareSocial } from "react-icons/io5";
import { FaRegComment, FaComment, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useDispatch } from "react-redux";
import { showToast } from "../../app/redux-reducers/contextProvider";

function Post({ data, handleModal }) {
    const { data: accountData, isSuccess } = useGetDataQuery("/account/user");
    const { timestamp, fullDateWithSeconds } = useTimestamp(data.dateCreated);

    const [isLiked, setIsLiked] = useState(
        isSuccess && data.likedByCurrentUser,
    );
    const [totalLikes, setTotalLikes] = useState(data.likeCount);

    const [isTextSelected, setIsTextSelected] = useState(false);

    const [hoveringComment, setHoveringComment] = useState(false);
    const totalComments = data.commentCount || data.comments?.length;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Like or unlike post
    function handleLiking(e) {
        e.stopPropagation();

        if (isLiked) {
            setIsLiked(false);
            setTotalLikes(totalLikes - 1);
        } else {
            setIsLiked(true);
            setTotalLikes(totalLikes + 1);
        }
        apiService.post("/feed/like", { postID: data.postID });
    }

    // Open write comment modal
    function handleCommentMenu(e) {
        e.stopPropagation();
        handleModal("comment", data.postID, data.commentID);
    }

    // Hover effect for comment icon
    function handleCommentHover(isHovering) {
        setHoveringComment(isHovering);
    }

    async function sharePost(e) {
        e.stopPropagation();

        const { protocol, host } = window.location;
        const postUrl = `${protocol}//${host}/posts/${data.postID}`;

        if (!isMobile() || !navigator.share) {
            try {
                await navigator.clipboard.writeText(postUrl);
                dispatch(showToast({ message: 'Link copied to clipboard', level: 1 }));
            } catch (error) {
                dispatch(showToast({ message: 'Failed to copy the link', level: 2 }));
            }
        } else { // If the user is on macOS or mobile, use the native sharing feature
            try {
                await navigator.share({
                    title: "Share post",
                    text: `Post made by ${data.username}`,
                    url: postUrl,
                });
            } catch (error) {
                dispatch(showToast({ message: 'Failed to share the post', level: 2 }));
            }
        }
    }

    // isMobile function remains unchanged
    function isMobile() {
        const regex =
            /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return regex.test(navigator.userAgent);
    }

    return (
        <div
            // to={`/posts/${data.postID}${data.parentCommentID ? `/${data.parentCommentID}/${data.commentID}` : data.commentID ? `/${data.commentID}` : ""}`}
            onClick={() => {!isTextSelected && navigate(`/posts/${data.postID}${data.parentCommentID ? `/${data.parentCommentID}/${data.commentID}` : data.commentID ? `/${data.commentID}` : ""}`)}}
            className={`animate-fadeIn border-b-dark-primary flex min-h-20 w-full max-w-3xl flex-col gap-2.5 border-b px-5 py-3 last:border-b-0 sm:flex-shrink-0 sm:last:mb-0 cursor-pointer`}
            onMouseUp={(e) => {
                const selection = window.getSelection().toString();
                if (selection) {
                    setIsTextSelected(true);
                } else {
                    setIsTextSelected(false);
                }
            }}
        >
            <div className="flex flex-row gap-2.5">
                <img className="size-12 rounded-full" src={img} alt="Profile" />
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col">
                        <div className="flex w-full flex-row items-center gap-2">
                            <h5
                                className="text-base font-bold hover:underline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        `/profile/${data.accountID}/posts`,
                                    );
                                }}
                            >
                                @{data.username}
                            </h5>
                            {data.verified &&
                                <MdVerified title="This user is verified" className="size-6 fill-blue-500"/>
                            }
                            {isSuccess &&
                            accountData.accountID === data.accountID ? (
                                <>
                                    <span className="text-sm">&#8226;</span>
                                    <span className="text-sm">you</span>
                                </>
                            ) : null}
                        </div>

                        {/* Time stamp and category */}
                        <div className="flex w-full flex-row items-center gap-2">
                            <span
                                className="text-dark-text-0.5 text-sm"
                                title={fullDateWithSeconds}
                            >
                                {timestamp}
                            </span>
                            {data.category && (
                                <>
                                    <span className="text-sm">&#8226;</span>
                                    <span className="text-dark-accent text-sm">
                                        {data.category}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Body with highlighted hashtags */}
                    <div className="flex w-full max-w-full cursor-default">
                    <p
                        className="flex w-full whitespace-pre-wrap break-words text-sm"

                    >
                        {highlightHashtags(data.body)}
                    </p>
                    </div>

                    {/* Engagement */}
                    {!data.commentID && (
                        <div className="z-10 flex h-6 w-full flex-row justify-between">
                            <div className="flex flex-row items-center justify-center gap-2.5">
                                {/* Comments */}
                                <div className="flex w-full flex-row items-center justify-end gap-2">
                                    <button
                                        onClick={(e) => handleCommentMenu(e)}
                                        onMouseEnter={() =>
                                            handleCommentHover(true)
                                        }
                                        onMouseLeave={() =>
                                            handleCommentHover(false)
                                        }
                                        className="pointer-events-auto relative size-6"
                                    >
                                        <FaComment
                                            className={`absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 scale-x-[-1] duration-150 ease-in-out ${hoveringComment ? "opacity-100" : "opacity-0"}`}
                                        />
                                        <FaRegComment
                                            className={`absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 scale-x-[-1]`}
                                        />
                                    </button>
                                    <span className="text-sm">
                                        {totalComments}
                                    </span>
                                </div>

                                {/* Likes */}
                                <div className="flex w-full flex-row items-center justify-start gap-2">
                                    <button
                                        onClick={(e) => handleLiking(e)}
                                        className="relative size-6 transition-transform duration-150 ease-in-out hover:scale-110"
                                    >
                                        <FaHeart
                                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 duration-[400ms] ease-out ${isLiked ? "size-full" : "size-0"} hover:text-red-600`}
                                        />
                                        <FaRegHeart
                                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 duration-150 ease-in-out ${isLiked ? "size-0" : "size-full"} hover:text-red-600`}
                                        />
                                    </button>
                                    <span className="text-sm">
                                        {totalLikes}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {/* Share */}
                                <div
                                    className="flex"
                                    onClick={async (e) => sharePost(e)}
                                >
                                    <button className="size-6">
                                        <IoShareSocialOutline className="size-full" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Post;
