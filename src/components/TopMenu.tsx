import Image from 'next/image';
import TopMenuItem from './TopMenuItem';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import Link from 'next/link';

export default async function TopMenu() {
    const session = await getServerSession(authOptions);

    return (
        <nav className="fixed top-0 w-full z-[100] bg-white/[0.03] backdrop-blur-md border-b border-white/10 font-serif">
            <div className="max-w-7xl mx-auto h-20 px-8 flex items-center justify-between relative">
                
                <div className="flex-1 flex items-center">
                    {session ? (
                        <Link href="/api/auth/signout" className="group flex flex-col">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">
                                Sign-Out
                            </span>
                            <span className="text-[12px] font-bold text-white italic tracking-wide">
                                {session.user?.name}
                            </span>
                        </Link>
                    ) : (
                        <Link href="/api/auth/signin" className="group flex flex-col">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors">
                                Account
                            </span>
                            <span className="text-[12px] font-bold text-white italic tracking-wide">
                                Sign-In
                            </span>
                        </Link>
                    )}
                </div>

                {/* Right Side: Navigation Items (Serif) */}
                <div className="flex-1 flex justify-end items-center gap-10 text-white">
                    <div className="hidden md:flex gap-10 items-center">
                        <TopMenuItem title='Booking' pageRef='/booking'/>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <TopMenuItem title='My Booking' pageRef='/mybooking'/>
                    </div>
                    
                    <button className="md:hidden text-white/70 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path></svg>
                    </button>
                </div>

            </div>
        </nav>
    );
}