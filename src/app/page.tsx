import dynamic from 'next/dynamic';

// Dynamically load the map component to avoid SSR.
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: !!false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>
});

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <MapWithNoSSR center={[25.0330, 121.5654]} zoom={13} />
    </div>
  );
}
