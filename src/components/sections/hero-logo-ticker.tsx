import { HOME_ASSETS, HOME_HERO_LOGOS } from "@/data/homepage";

/** Marquee of customer/brand logos used in the homepage and pricing heroes. */
export function HeroLogoTicker() {
  const logos = HOME_HERO_LOGOS.map((key) => HOME_ASSETS[key]);
  const items = [...logos, ...logos];

  return (
    <div
      className="relative mt-12 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 8%, black 51%, transparent 93%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 8%, black 51%, transparent 93%)",
      }}
    >
      <div className="hero-logo-ticker flex w-max items-center gap-12">
        {items.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`${src}-${i}`} src={src} alt="" className="h-6 w-auto shrink-0" />
        ))}
      </div>
    </div>
  );
}
