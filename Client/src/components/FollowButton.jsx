import apiService from "../logic/apiService"
import React, { useEffect, useState } from "react"
import { useGetDataQuery } from "../logic/apiSlice"
export default function FollowButton({ account, setFollowersCount}) {
    const {
        data: accountData,
        isSuccess,
        isLoading,
    } = useGetDataQuery("/account/user");

    const [currentUserFollows, setCurrentUserFollows] = useState(account.currentUserFollows)

    async function handleFollow() {
        const res = await apiService.post("/follow", { followingId: account.accountID })

        setCurrentUserFollows(res.currentUserFollows)

        if (res.currentUserFollows)
            setFollowersCount((prev) => prev + 1)
        else
            setFollowersCount((prev) => prev - 1)
    }

    return (
        <button
        onClick={() => handleFollow()}
        className={`px-2 py-1 rounded text-sm ${currentUserFollows ? "text-dark-secondary border-dark-secondary border font-bold" : "text-dark-primary bg-dark-secondary border-none font-normal"}`}
        >
            {currentUserFollows ? "Following" : "Follow"}
        </button>
    )
}