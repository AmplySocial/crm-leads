export default function SectionHeading({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div className={`${center ? "text-center mx-auto" : "text-left"} max-w-3xl ${light ? "" : ""}`}>
      {eyebrow && (
        <div className={`flex items-center gap-3 mb-5 ${center ? "justify-center" : ""}`}>
          <span className="block w-8 h-px bg-gold" />
          <span className="text-[11px] tracking-luxe uppercase text-gold font-medium">{eyebrow}</span>
          {center && <span className="block w-8 h-px bg-gold" />}
        </div>
      )}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-[44px] leading-[1.15] text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base md:text-lg text-slate-muted leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}
