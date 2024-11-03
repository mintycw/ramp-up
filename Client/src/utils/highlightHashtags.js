import React from 'react';

// Function to highlight hashtags
export const highlightHashtags = (text) => {
    const parts = text.split(/(\s+)/); // Split by spaces and preserve spaces
    return (
        <span>
            {parts.map((part, index) =>
                part.startsWith("#") ? (
                    <span key={index} className="text-blue-500">{part}</span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
};
