import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateTitle } from "../../app/redux-reducers/contextProvider";

import apiService from "../../logic/apiService";

import Post from "../../components/posts/Post";
import Comment from "../../components/posts/Comment";

function PostOverview() {
    const { handleModal } = useOutletContext();

    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);

    const { postID, commentID, replyID } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateTitle("Post"));

        apiService.get(`/post/${postID}`).then((res) => {
            if (!res.result) {
                alert(res.message || "Error getting post");
                return;
            }

            setPost(res.result);
        });

        apiService.get(`/post/${postID}/comment`).then((res) => {
            if (!res.result) {
                alert(res.message || "Error getting comments");
                return;
            }

            setComments(res.result);
        });
    }, []);

    return (
        Object.keys(post).length > 0 && (
            <div className="no-scrollbar flex w-full flex-col">
                <div className="p-4 bg-neutral-700 bg-opacity-50 border-y-gray-950 shadow-xl rounded-lg">
                    <Post data={post} handleModal={handleModal} />
                </div>
                {/* Comments Section */}
                <div className="mt-6 no-scrollbar flex flex-col items-center">
                    {comments.length > 0 ? (
                        comments.map((data) => {
                            if (data.parentCommentID) {
                                return;
                            }

                            return (
                                <Comment
                                    key={`p:${post.postID};c:${data.commentID}`}
                                    data={data}
                                    handleModal={handleModal}
                                    isSelected={
                                        (!replyID && data.commentID) ===
                                        Number(commentID)
                                    }
                                    commentID={Number(commentID)}
                                    replyID={Number(replyID)}
                                />
                            );
                        })
                    ) : (
                        <div className="my-20 flex h-full w-full items-center justify-center pb-20 text-xl font-bold sm:pb-0">
                            Be the first to comment!
                        </div>
                    )}
                </div>
            </div>
        )
    );
}

export default PostOverview;
