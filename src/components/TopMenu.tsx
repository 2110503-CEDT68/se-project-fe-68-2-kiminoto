"use client";

import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function TopMenu() {
    const { data: session } = useSession();

    return (
        <nav className="bg-foreground text-background shadow-lg">
            <div className="w-full min-w-full px-32 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center">
                        {session ? (
                            <Link href="/signout" className="group flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
                                <span className="text-xs uppercase tracking-widest text-red-400/80 group-hover:text-red-300 transition-colors font-semibold">
                                    Sign Out
                                </span>
                                <span className="text-sm tracking-wide font-semibold text-white">
                                    {session.user?.name || session.user?.email}
                                </span>
                            </Link>
                        ) : (
                            <div className="flex flex-col">
                                <span className="text-xs uppercase tracking-widest text-white/50">
                                    Account
                                </span>
                                <div className="text-sm tracking-wide font-semibold flex items-center gap-2">
                                    <Link href="/signin" className="hover:text-accent transition-colors">
                                        Login
                                    </Link>
                                    <span className="text-muted/60">/</span>
                                    <Link href="/signup" className="hover:text-accent transition-colors">
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <TopMenuItem title="My Booking" pageRef="/mybooking" />
                    <TopMenuItem title="Booking" pageRef="/booking" />
                    <TopMenuItem title="Providers" pageRef="/providers" />
                    <Link href="/">
                        <Image className="border border-border" src="/img/logo.jpg" alt="Das Buch Logo" width={40} height={40} />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
