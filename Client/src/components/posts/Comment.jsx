import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetDataQuery } from "../../logic/apiSlice";

import { highlightHashtags } from '../../utils/highlightHashtags';
import useTimestamp from "../../hooks/useTimestamp";
import apiService from "../../logic/apiService";
import img from "../../assets/images/profilepicture.jpg";
import Reply from "./Reply";

import { FaComment, FaRegComment } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

function Comment({ data, handleModal, isSelected, commentID, replyID }) {
    const { isSuccess, data: accountData } = useGetDataQuery("/account/user");
    const { timestamp, fullDateWithSeconds } = useTimestamp(data.dateCreated);

    const [totalComments, setTotalComments] = useState(data?.totalReplies);
    const [hoveringComment, setHoveringComment] = useState(false);

    const [showReplies, setShowReplies] = useState(
        data.commentID === commentID,
    );
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        setTotalComments(data.totalReplies);
    }, [data]);

    useEffect(() => {
        // prettier-ignore
        if (commentID === data.commentID && replies.length === 0) 
            getReplies();

        if (replyID && !showReplies)
            replies.forEach((reply) => {
                if (reply.commentID === replyID) {
                    setShowReplies(true);
                }
            });
    }, [replyID, replies]);

    // Open write comment modal
    function handleCommentMenu(e) {
        e.preventDefault();
        handleModal("comment", data.postID, data.commentID);
    }

    // Hover effect for comment icon
    function handleCommentHover(isHovering) {
        setHoveringComment(isHovering);
    }

    // Show or hide replies
    function handleShowReplies() {
        // prettier-ignore
        if (!showReplies) 
            getReplies();

        setShowReplies((prev) => !prev);
    }

    // Get replies for comment
    function getReplies() {
        apiService
            .get(`/post/${data.postID}/comment/${data.commentID}`)
            .then((res) => {
                if (!res.result) {
                    alert(res.message || "Error getting replies");
                    return;
                }

                setReplies(res.result);
            });
    }

    return (
        <div
            className={`mb-2 flex w-11/12 flex-row gap-2 rounded-md p-2 first:mt-2 ${isSelected ? "bg-dark-secondary" : "bg-dark-bg-shade sm:bg-dark-bg-0.5"}`}
        >
            {/* Profile picture */}
            <img src={img} className="size-10 rounded-full" />
            {/* Main body */}
            <div className="relative flex w-full flex-col items-start gap-3">
                {/* Header */}
                <div className="flex flex-col">
                    {/* Username and relation  */}
                    <div className="flex w-full flex-row items-center gap-2">
                        <Link to={`/profile/${data.accountID}`}>
                            <h6 className="text-base font-bold hover:underline">
                                @{data.username}
                            </h6>
                        </Link>
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

                    {/* Timestamp */}
                    <span
                        className="text-dark-text-0.5 text-sm"
                        title={fullDateWithSeconds}
                    >
                        {timestamp}
                    </span>
                </div>

                {/* Comment body */}
                <div className="flex w-full max-w-full">
                    <p className="flex w-full whitespace-pre-wrap break-words text-sm">
                        {highlightHashtags(data.body)}
                    </p>
                </div>

                {/* Engagement (comments) */}
                <div className="flex w-full flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start gap-2">
                        <button
                            onClick={(e) => handleCommentMenu(e)}
                            onMouseEnter={() => handleCommentHover(true)}
                            onMouseLeave={() => handleCommentHover(false)}
                            className="pointer-events-auto relative size-6"
                        >
                            <FaComment
                                className={`absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 scale-x-[-1] duration-150 ease-in-out ${hoveringComment ? "opacity-100" : "opacity-0"}`}
                            />
                            <FaRegComment
                                className={`absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 scale-x-[-1]`}
                            />
                        </button>
                        <span className="text-sm">{totalComments}</span>
                    </div>
                </div>

                {/* Replies */}
                {showReplies && replies.length > 0 && (
                    <div className="mt-2 flex w-full flex-col items-start">
                        {replies.map((reply) => (
                            <Reply
                                key={`p:${data.postID};c:${reply.commentID}`}
                                data={reply}
                                isSelected={replyID === reply.commentID}
                            />
                        ))}
                    </div>
                )}

                {/* See replies button */}
                {totalComments > 0 && (
                    <div className="absolute bottom-0 right-0 flex h-full items-end justify-end">
                        <button
                            onClick={handleShowReplies}
                            className="text-dark-text-0.5 text-xs hover:underline"
                        >
                            {showReplies
                                ? ` hide ${totalComments > 1 ? "replies" : "reply"}`
                                : `show ${totalComments} ${totalComments > 1 ? "replies" : "reply"}`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;
