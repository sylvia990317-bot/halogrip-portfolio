const LOGOS = [
  { name: "Cstrider", src: "/home/logos/cstrider.svg" },
  { name: "Volvo", src: "/home/logos/volvo.svg" },
  { name: "Chalmers", src: "/home/logos/chalmers.svg" },
  { name: "Autoliv", src: "/home/logos/autoliv.svg" },
];

export default function LogoMarquee() {
  const items = [...LOGOS, ...LOGOS];
  return (
    <div className="overflow-hidden border-t border-line py-6">
      <div className="flex w-max animate-[marquee_22s_linear_infinite] items-center gap-12">
        {items.map((logo, i) => (
          <div key={`${logo.name}-${i}`} className="flex h-8 w-28 shrink-0 items-center justify-center">
            <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
