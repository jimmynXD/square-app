import Image from 'next/image';

export default function Hero() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/squarelord-logo.png"
          alt="SquareLord Logo"
          width={64}
          height={64}
          className="dark:invert"
        />
        <p className="text-3xl !leading-tight mx-auto max-w-xl text-center">
          SquareLord
        </p>
        <p className="text-lg text-muted-foreground mt-4 text-center max-w-lg">
          Create custom squares pools, share with participants, and let the app
          automatically calculate winners in real-time as scores update
        </p>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
