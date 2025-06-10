'use client';

import Link from 'next/link';
import Image from 'next/image';
import '@/components/common.css';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-emerald-50 p-4">
      <div className="w-full max-w-md relative flex flex-col items-center">
        <div className="text-9xl font-bold text-emerald-400 mb-4 flex items-center">
          4
          <div className="mx-4 flex items-center justify-center">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          4
        </div>

        <h1 className="text-xl font-medium text-gray-700 mb-8 text-center">
          Oops! 您尋找的這個地點不存在
        </h1>

        <Link href="/" className="btn-capsule flex items-center">
          <span>返回地圖</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
