import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Category } from '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find({}).lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error('獲取類別資料失敗:', error);
    return NextResponse.json(
      { error: '獲取類別資料時發生錯誤' },
      { status: 500 }
    );
  }
}
