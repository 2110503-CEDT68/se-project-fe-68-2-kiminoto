// src/app/page.tsx
import Banner from "@/components/Banner"

export default function Home() {
  return (
    <main className="w-full bg-[#faf9f6] min-h-screen"> 
      <Banner 
        title="Experience Luxury Cars" 
        subtitle="Discover the perfect vehicle for your next journey. From luxury sedans to adventurous SUVs."
        imgSrc="/img/black_cover.jpg" 
      />
    </main>
  );
}