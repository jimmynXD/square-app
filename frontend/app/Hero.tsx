'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import HowToPlay from '@/components/HowToPlay';

export default function Hero() {
  const router = useRouter();
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState('/grid-light.png');

  useEffect(() => {
    if (theme === 'system') {
      setImageSrc(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? '/grid-dark.png'
          : '/grid-light.png'
      );
    } else {
      setImageSrc(theme === 'dark' ? '/grid-dark.png' : '/grid-light.png');
    }
  }, [theme]);

  return (
    <div className="pt-32 pb-16 px-4 w-full max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-medium text-center">
            Create Super Bowl Squares & NFL Football Square Pools Online
          </h1>
          <p className="md:text-lg text-muted-foreground mt-4 max-w-lg text-center">
            Create custom squares pools, share with participants, and let the
            app automatically calculate winners in real-time as scores update
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push('/sign-up')}>Get Started</Button>
          </div>
        </div>
        <div className="w-full h-full relative">
          <Image
            src={imageSrc}
            alt="Grid"
            width={2964}
            height={1524}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <HowToPlay />
    </div>
  );
}
