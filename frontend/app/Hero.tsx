export default function Hero() {
  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <p className="text-3xl !leading-tight mx-auto max-w-xl text-center">
        SquareLord: Create, Share, and Track Your Squares in Real-Time
      </p>
      <p className="text-lg text-muted-foreground mt-4 text-center max-w-lg">
        Create custom squares pools, share with participants, and let the app
        automatically calculate winners in real-time as scores update
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
