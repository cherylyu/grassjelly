'use client';

import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-[80px] h-full p-2 bg-[#efefef] z-500 flex flex-col items-center shadow-[5px_0_10px_-5px_rgba(0,0,0,0.15)]">
      <div className="px-2">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
    </nav>
  );
};

export default Navbar;
