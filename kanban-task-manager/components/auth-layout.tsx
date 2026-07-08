import { Logo } from "./logo";

const COLUMN_CARDS = [
    [60, 40],
    [70, 50, 30],
    [45],
];

export function AuthLayout({
    eyebrow,
    title,
    subtitle,
    children,
}: {
    eyebrow: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
                <div className="mx-auto w-full max-w-sm">
                    <Logo />
                    <p className="mt-10 text-sm font-medium uppercase tracking-wider text-primary-light">
                        {eyebrow}
                    </p>
                    <h1 className="mt-2 text-[32px] font-bold leading-tight text-text-primary">
                        {title}
                    </h1>
                    <p className="mt-2 text-base text-text-secondary">{subtitle}</p>
                    <div className="mt-8">{children}</div>
                </div>
            </div>

            <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-background-secondary lg:flex">
                <div className="absolute h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex gap-4 p-12">
                    {COLUMN_CARDS.map((cards, colIndex) => (
                        <div key={colIndex} className="flex w-32 flex-col gap-3">
                            <div className="h-2 w-12 rounded-full bg-surface" />
                            {cards.map((height, cardIndex) => (
                                <div
                                    key={cardIndex}
                                    className={`rounded-[12px] border p-3 ${colIndex === 1 && cardIndex === 0
                                            ? "border-primary bg-surface"
                                            : "border-border bg-background"
                                        }`}
                                    style={{ height: `${height}px` }}
                                >
                                    <div className="h-1.5 w-2/3 rounded-full bg-text-disabled/40" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <p className="absolute bottom-12 left-12 right-12 text-sm text-text-secondary">
                    Your personal workspace — calm, organized, and built to help you focus.
                </p>
            </div>
        </div>
    );
}