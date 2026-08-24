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
          <img
            key={`${logo.name}-${i}`}
            src={logo.src}
            alt={logo.name}
            className="h-6 w-auto object-contain"
          />
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
