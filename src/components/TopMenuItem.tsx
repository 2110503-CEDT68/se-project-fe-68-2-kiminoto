import Link from 'next/link';

export default function TopMenuItem({ title, pageRef }: { title: string, pageRef: string }) {
    return (
        <Link 
            href={pageRef} 
            className="group relative px-2 md:px-3 py-1 text-background font-medium text-sm md:text-base hover:text-accent transition-colors duration-200"
        >
            <span>{title}</span>
            
            <span className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full opacity-80"></span>
        </Link>
    );
}