import Link from 'next/link';

export default function TopMenuItem({ title, pageRef }: { title: string, pageRef: string }) {
    return (
        <Link 
            href={pageRef} 
            className="group relative py-2 font-serif text-[12px] md:text-[13px] uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all duration-500"
        >
            <span className="">{title}</span>
            
            {/* Animated Underline Effect */}
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-400 transition-all duration-500 group-hover:w-full opacity-60"></span>
        </Link>
    );
}