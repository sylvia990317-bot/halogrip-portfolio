// TODO(sylvia): swap for real logo images once supplied.
const LOGOS = ["CSTRIDER", "VOLVO", "CHALMERS", "AUTOLIV"];

export default function LogoMarquee() {
  const items = [...LOGOS, ...LOGOS];
  return (
    <div className="overflow-hidden border-t border-line py-6">
      <div className="flex w-max animate-[marquee_22s_linear_infinite] gap-12">
        {items.map((logo, i) => (
          <span key={`${logo}-${i}`} className="font-heading text-lg font-medium text-muted">
            {logo}
          </span>
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
