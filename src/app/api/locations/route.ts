import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Location } from '@/models/Location';

export async function GET() {
  try {
    await connectToDatabase();

    const locations = await Location.find({}).lean();

    // Convert MongoDB format to GeoJSON format
    const geoJsonData = {
      type: "FeatureCollection",
      features: locations.map(location => ({
        type: "Feature",
        geometry: location.location,
        properties: {
          id: (location._id as { toString: () => string }).toString(),
          name: location.name,
          category: location.category,
          description: location.description,
          address: location.address,
          phone: location.phone,
          website: location.website,
          glink: location.glink,
          createdAt: location.createdAt?.toISOString(),
          updatedAt: location.updatedAt?.toISOString(),
        }
      }))
    };

    return NextResponse.json(geoJsonData);
  } catch (error) {
    console.error('獲取位置資料失敗:', error);
    return NextResponse.json(
      { error: '獲取位置資料時發生錯誤' },
      { status: 500 }
    );
  }
}
