import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="hidden relative lg:flex flex-col bg-muted text-white">
        <div className="absolute inset-0 bg-zinc-900/10" />
        <Image
          src="/images/auth-bg.png"
          alt="Nature Background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 p-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-serif italic text-white drop-shadow-md">
              &ldquo;La nature est le plus grand laboratoire de bien-être.&rdquo;
            </p>
            <footer className="text-sm text-white/90 drop-shadow-md font-medium">
              Calebasse Laboratoire
            </footer>
          </blockquote>
        </div>
        <div className="relative z-20 p-10 flex cursor-pointer">
           {/* Logo could go here */}
           <h1 className="text-4xl font-heading font-bold text-white drop-shadow-lg tracking-tight">Calebasse</h1>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 bg-background">
        <div className="mx-auto grid w-[350px] gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
