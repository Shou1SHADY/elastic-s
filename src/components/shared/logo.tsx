import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image 
        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/logo-1767006168714.png?width=8000&height=8000&resize=contain"
        alt="Elastic Logo"
        width={200}
        height={60}
        className="h-14 w-auto object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
