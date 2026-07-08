import Link from "next/link";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Logo />
      <h1 className="mt-10 max-w-xl text-[32px] font-bold leading-tight text-text-primary">
        Your personal workspace.
      </h1>
      <p className="mt-3 max-w-md text-base text-text-secondary">
        A calm, focused place to organize your boards, tasks, and ideas — without the noise.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/login"
          className="rounded-[10px] border border-border px-5 py-2.5 font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-[10px] bg-primary px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}