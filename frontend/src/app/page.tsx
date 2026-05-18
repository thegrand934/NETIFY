import HeroBanner from "@/components/HeroBanner";
import MovieCarousel from "@/components/MovieCarousel";

export default function Home() {
  return (
    <div className="pb-20">
      <HeroBanner />
      <div className="-mt-12 md:-mt-20 relative z-20 space-y-8">
        <MovieCarousel title="Trending Now" />
        <MovieCarousel title="Continue Watching for User" />
        <MovieCarousel title="NETIFY Originals" />
        <MovieCarousel title="Action Movies" />
        <MovieCarousel title="Comedy Hits" />
      </div>
    </div>
  );
}
