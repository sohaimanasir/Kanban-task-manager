"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { TextField } from "@/components/ui/text-field";

export function ProfileForm({
    currentName,
    email,
}: {
    currentName: string;
    email: string;
}) {
    const router = useRouter();
    const [name, setName] = useState(currentName);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const save = async () => {
        if (name.trim() === "" || name === currentName) return;
        setSaving(true);
        setError(null);

        const { error: updateError } = await authClient.updateUser({ name });

        setSaving(false);
        if (updateError) {
            setError(updateError.message ?? "Couldn't update profile");
            return;
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
        router.refresh();
    };

    return (
        <div className="rounded-[12px] border border-border bg-background-secondary p-5">
            <h2 className="font-semibold text-text-primary">Profile information</h2>
            <div className="mt-4 space-y-4">
                <TextField id="email" label="Email" value={email} disabled />
                <TextField
                    id="name"
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {error && <p className="text-sm text-error">{error}</p>}
                <div className="flex items-center gap-3">
                    <button
                        onClick={save}
                        disabled={saving || name.trim() === "" || name === currentName}
                        className="rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                    {saved && (
                        <span className="flex items-center gap-1 text-sm text-success">
                            <Check size={14} /> Saved
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}