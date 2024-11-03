import React from "react";
import { useSelector } from "react-redux";

function ToastContainer() {
    const toasts = useSelector((state) => state.context.toasts);

    return (
        <div className="no-scrollbar fixed right-1.5 top-1.5 z-[1000] flex h-min max-h-[calc(100vh-8rem)] flex-col gap-2 overflow-y-scroll sm:right-10 sm:top-10 sm:max-h-[calc(100vh-5rem)]">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="bg-dark-bg-shade animate-fadeOut relative h-min min-h-12 w-64 shrink-0 rounded"
                    style={{
                        animationDelay: `${toast.duration - 550 || 2450}ms`, // Default to 3000ms if not provided
                    }}
                >
                    <div
                        className={`text-dark-text animate-fadeIn to-dark-bg-shade flex min-h-12 w-64 items-center justify-start whitespace-normal break-words rounded bg-gradient-to-r to-20% px-5 py-2.5 text-sm shadow-2xl ${
                            toast.level === 0
                                ? "from-dark-primary/60"
                                : toast.level === 1
                                  ? "from-green-500/60"
                                  : "from-red-500/60"
                        }`}
                    >
                        {toast.message}
                    </div>
                    <div
                        className={`animate-progress absolute bottom-0 left-0 mx-px h-1 w-64 rounded-b ${toast.level === 0 ? "bg-dark-primary" : toast.level === 1 ? "bg-green-500" : "bg-red-500"}`}
                        style={{
                            animationDuration: `${toast.duration || 3000}ms`, // Default to 3000ms if not provided
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export default ToastContainer;
