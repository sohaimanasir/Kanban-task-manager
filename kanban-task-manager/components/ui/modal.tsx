"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-[16px] border border-border bg-background-secondary p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-text-secondary transition-colors hover:text-text-primary"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
}