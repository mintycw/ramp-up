import { useState, useEffect } from "react";

export default function useTimestamp(timeStamp) {
    const [timestamp, setTimeStamp] = useState("");
    const [fullDateWithSeconds, setFullDateWithSeconds] = useState("");

    useEffect(() => {
        const timestampDate = new Date(timeStamp);
        const now = new Date();

        // Format full date with time (including seconds) in local time zone
        const formattedFullDateWithSeconds = timestampDate.toLocaleString(
            "en-CA",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            },
        );
        setFullDateWithSeconds(formattedFullDateWithSeconds);

        // Calculate time difference
        const timeDifference = now.getTime() - timestampDate.getTime();
        const minutes = Math.floor(timeDifference / (1000 * 60));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (days >= 1) {
            // Show full date after 24 hours
            setTimeStamp(timestampDate.toLocaleDateString("en-CA"));
        } else if (hours > 0) {
            setTimeStamp(`${hours}h ago`);
        } else if (minutes > 0) {
            setTimeStamp(`${minutes}m ago`);
        } else {
            setTimeStamp("Just now");
        }
    }, [timeStamp]);

    return { timestamp, fullDateWithSeconds };
}
