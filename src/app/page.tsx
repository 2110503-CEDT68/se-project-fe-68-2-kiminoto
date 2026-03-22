// src/app/page.tsx
import Banner from "@/components/Banner"

export default function Home() {
  return (
    <main className="w-full bg-background min-h-screen"> 
      <Banner 
        title="Car Rental Service" 
        subtitle="Discover the perfect vehicle for your next journey."
        imgSrc="/img/img1.jpg" 
      />
    </main>
  );
}