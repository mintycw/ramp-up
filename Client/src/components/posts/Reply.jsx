import React from "react";

import { Link } from "react-router-dom";
import { useGetDataQuery } from "../../logic/apiSlice";

import { highlightHashtags } from '../../utils/highlightHashtags';
import useTimestamp from "../../hooks/useTimestamp";
import img from "../../assets/images/profilepicture.jpg";
import { MdVerified } from "react-icons/md";

function Reply({ data, isSelected }) {
    const { isSuccess, data: accountData } = useGetDataQuery("/account/user");
    const { timestamp, fullDateWithSeconds } = useTimestamp(data.dateCreated);

    return (
        <div
            className={`mb-1 flex w-full flex-row gap-2 rounded-md p-2 last:mb-6 ${isSelected ? "bg-dark-secondary" : "bg-dark-bg-shade sm:bg-dark-bg-0.5"}`}
        >
            {/* Profile picture */}
            <img src={img} className="size-7 rounded-full" />
            {/* Main body */}
            <div className="relative flex w-full flex-col items-start gap-3">
                {/* Header */}
                <div className="flex flex-col">
                    {/* Username and relation */}
                    <div className="flex w-full flex-row items-center gap-2">
                        <Link to={`/profile/${data.accountID}`}>
                            <h6 className="text-sm font-bold hover:underline">
                                @{data.username}
                            </h6>
                            
                        </Link>
                        {data.verified &&
                            <MdVerified title="This user is verified" className="size-6 fill-blue-500"/>
                        }
                        {isSuccess &&
                        accountData.accountID === data.accountID ? (
                            <>
                                <span className="text-xs">&#8226;</span>
                                <span className="text-xs">you</span>
                            </>
                        ) : null}
                    </div>

                    {/* Timestamp */}
                    <span
                        className="text-dark-text-0.5 text-xs"
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
            </div>
        </div>
    );
}

export default Reply;
