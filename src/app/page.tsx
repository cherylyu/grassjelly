import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

// Dynamically load the map component to avoid SSR
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: !!false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>
});

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Navbar />
      <div className="pl-[80px] w-full h-full">
        <MapWithNoSSR center={[25.011905, 121.216255]} zoom={16} />
      </div>
    </div>
  );
}
