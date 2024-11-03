import React, { useState } from "react";
import img from "../../assets/images/profilepicture.jpg";
import { useNavigate } from "react-router-dom";
import FollowButton from "../../components/FollowButton";
import { MdVerified } from "react-icons/md";

function SearchItem({ data }) {
    const navigate = useNavigate();
    const [followersCount, setFollowersCount] = useState(data.followersCount);

    return (
        <div className="flex h-20 w-full max-w-3xl flex-row items-center justify-between gap-2.5 border-b border-dark-primary last:border-b-0 px-3">
            {/* Account Info */}
            <div className="flex flex-row items-center justify-start gap-2">
                <img src={img} className="size-12 rounded-full" />
                <div className="flex flex-col justify-center">
                    <div className="flex flex-row gap-1">
                        <h5
                            onClick={() => navigate(`/profile/${data.accountID}/posts`)}
                            className="md:w-2xl max-w-52 truncate text-base font-bold hover:underline"
                        >
                            @{data.username}
                        </h5>
                        {data.verified && (
                            <MdVerified title="This user is verified" className="size-6 fill-blue-500" />
                        )}
                    </div>
                    <p className="text-sm">{followersCount} followers</p>
                </div>
            </div>
            {/* Action Button */}
            <FollowButton account={data} setFollowersCount={setFollowersCount} />
        </div>
    );
}

export default SearchItem;
