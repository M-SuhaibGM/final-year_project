// InterviewCardSkeleton.jsx

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const InterviewCardSkeleton = () => {
    return (
        <div className="border rounded-lg p-5 flex flex-col space-y-3">
            {/* Title / Icon */}
            <div className="flex justify-between items-center">
                {/* Change bg-muted to a darker/lighter shade, or a different color */}
                <Skeleton className="h-6 w-3/5 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Description Line 1 */}
            <Skeleton className="h-4 w-full bg-gray-300 dark:bg-gray-700" />

            {/* Description Line 2 */}
            <Skeleton className="h-4 w-4/5 bg-gray-300 dark:bg-gray-700" />

            {/* Buttons / Footer Area */}
            <div className="flex justify-between items-center pt-3">
                <Skeleton className="h-10 w-24 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-10 w-24 bg-gray-300 dark:bg-gray-700" />
            </div>
        </div>
    );
};

export default InterviewCardSkeleton;