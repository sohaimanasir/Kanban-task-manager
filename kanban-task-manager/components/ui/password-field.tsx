"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({ label, error, id, ...props }, ref) => {
        const [visible, setVisible] = useState(false);

        return (
            <div className="space-y-1.5">
                <label htmlFor={id} className="block text-sm font-medium text-text-primary">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        id={id}
                        type={visible ? "text" : "password"}
                        className="w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 pr-11 text-text-primary placeholder:text-text-disabled outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-primary"
                        aria-label={visible ? "Hide password" : "Show password"}
                    >
                        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);
PasswordField.displayName = "PasswordField";