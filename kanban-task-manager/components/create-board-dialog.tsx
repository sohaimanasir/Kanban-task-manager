"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { createBoardSchema, type CreateBoardInput } from "@/lib/validations/board";
import { SWATCHES } from "@/lib/colors";
import { Modal } from "@/components/ui/modal";
import { TextField } from "@/components/ui/text-field";
import { useForm, useWatch } from "react-hook-form";

export function CreateBoardDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateBoardInput>({
        resolver: zodResolver(createBoardSchema),
        defaultValues: { color: SWATCHES[0].value },
    });

    const selectedColor = useWatch({ control, name: "color" });

    const onSubmit = async (data: CreateBoardInput) => {
        setServerError(null);

        const res = await fetch("/api/boards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            setServerError("Couldn't create board. Try again.");
            return;
        }

        reset({ color: SWATCHES[0].value });
        setOpen(false);
        router.refresh();
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
            >
                <Plus size={18} />
                Create board
            </button>

            <Modal open={open} onClose={() => setOpen(false)} title="Create a board">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextField
                        id="title"
                        label="Title"
                        placeholder="e.g. Freelancing"
                        error={errors.title?.message}
                        {...register("title")}
                    />
                    <TextField
                        id="description"
                        label="Description (optional)"
                        placeholder="What's this board for?"
                        error={errors.description?.message}
                        {...register("description")}
                    />

                    <div>
                        <label className="block text-sm font-medium text-text-primary">Color</label>
                        <div className="mt-2 flex gap-2">
                            {SWATCHES.map((swatch) => (
                                <button
                                    key={swatch.value}
                                    type="button"
                                    onClick={() => setValue("color", swatch.value)}
                                    className={`h-8 w-8 rounded-full transition-transform ${selectedColor === swatch.value
                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background-secondary"
                                        : ""
                                        }`}
                                    style={{ backgroundColor: swatch.value }}
                                    aria-label={swatch.name}
                                />
                            ))}
                        </div>
                    </div>

                    {serverError && <p className="text-sm text-error">{serverError}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-[10px] bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating..." : "Create board"}
                    </button>
                </form>
            </Modal>
        </>
    );
}