type PlaceholderImageProps = {
  label?: string;
  className?: string;
  muted?: boolean;
};

export default function PlaceholderImage({ label = "Image placeholder", className = "", muted = false }: PlaceholderImageProps) {
  return (
    <div
      className={`flex items-center justify-center bg-[repeating-linear-gradient(135deg,#e4e4e7_0px,#e4e4e7_10px,#ececee_10px,#ececee_20px)] ${
        muted ? "grayscale opacity-70" : ""
      } ${className}`}
    >
      <span className="font-mono text-[10px] uppercase tracking-wide text-tertiary">{label}</span>
    </div>
  );
}
