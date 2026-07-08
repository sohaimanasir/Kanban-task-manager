"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, error, id, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                <label htmlFor={id} className="block text-sm font-medium text-text-primary">
                    {label}
                </label>
                <input
                    ref={ref}
                    id={id}
                    className="w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 text-text-primary placeholder:text-text-disabled outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    {...props}
                />
                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);
TextField.displayName = "TextField";