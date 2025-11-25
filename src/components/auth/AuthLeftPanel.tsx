'use client';

export function AuthLeftPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#642DFC] via-[#5526d4] to-[#4318a8] overflow-hidden">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top Wavy Pattern */}
      <svg
        className="absolute top-0 left-0 w-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        style={{ height: '25%' }}
      >
        <path
          d="M0,100 C150,150 350,50 500,100 C650,150 750,80 800,100 L800,0 L0,0 Z"
          fill="rgba(255,255,255,0.08)"
        />
        <path
          d="M0,80 C200,130 400,30 600,80 C700,110 750,70 800,80 L800,0 L0,0 Z"
          fill="rgba(255,255,255,0.05)"
        />
      </svg>

      {/* Bottom Wavy Pattern */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        style={{ height: '25%' }}
      >
        <path
          d="M0,50 C150,100 350,0 500,50 C650,100 750,30 800,50 L800,200 L0,200 Z"
          fill="rgba(139,92,246,0.4)"
        />
        <path
          d="M0,80 C200,130 400,30 600,80 C700,110 750,70 800,80 L800,200 L0,200 Z"
          fill="rgba(139,92,246,0.3)"
        />
      </svg>

      {/* Floating Circles */}
      {/* Top Right Circle */}
      <div className="absolute top-12 right-1/4 w-24 h-24 rounded-full border-2 border-white/20 bg-white/10" />

      {/* Top Left Circle */}
      <div className="absolute top-1/4 left-8 w-20 h-20 rounded-full border-2 border-white/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/40" />
      </div>

      {/* Bottom Center Circle */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-2 border-white/20 bg-white/10" />

      {/* Small Dots */}
      <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-white/30" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-white/20" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-white/25" />
      <div className="absolute top-2/3 right-1/2 w-2 h-2 rounded-full bg-white/30" />
      <div className="absolute bottom-1/2 left-1/3 w-2 h-2 rounded-full bg-white/20" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">rapid</h1>
        <p className="text-white/80 text-lg">Hire your remote team rapidly</p>
      </div>
    </div>
  );
}
