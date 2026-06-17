"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  HOME_ASSETS,
  HOME_BLOG,
  HOME_BRIDGE,
  HOME_CTA,
  HOME_FAQ,
  HOME_FEATURES,
  HOME_HERO,
  HOME_HERO_LOGOS,
  HOME_IMPACT,
  HOME_INTEGRATIONS,
  HOME_PAIN_POINTS,
  HOME_TESTIMONIALS,
  HOME_UNLOCK,
  HOME_WORKFLOW,
} from "@/data/homepage";

function asset(key: keyof typeof HOME_ASSETS) {
  return HOME_ASSETS[key];
}

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

function PainStat({
  prefix,
  value,
  suffix,
  active,
}: {
  prefix: string;
  value: number;
  suffix: string;
  active: boolean;
}) {
  const count = useCountUp(value, active);
  return (
    <p className="text-5xl font-medium tracking-tight md:text-6xl">
      {prefix}
      {count}
      {suffix}
    </p>
  );
}

function BridgeTitle({ activeSlideIndex }: { activeSlideIndex: number }) {
  const slides = HOME_BRIDGE.slides;
  return (
    <>
      Ordina brings everything together - connecting{" "}
      {slides.map((slide, i) => (
        <span key={slide.highlightWord}>
          {i === 2 ? " and " : i > 0 ? " , " : ""}
          <span
            className="box-decoration-clone rounded-md px-1.5 py-0.5 transition-[background-color] duration-500 ease-out"
            style={{
              backgroundColor:
                i === activeSlideIndex && activeSlideIndex >= 0
                  ? `color-mix(in srgb, ${slide.highlightColor} 28%, transparent)`
                  : "transparent",
            }}
          >
            {slide.highlightWord}
          </span>
        </span>
      ))}{" "}
      into one clear, flexible workspace.
    </>
  );
}

/**
 * Framer ring layout — the 5 widgets occupy the same slots on every variant
 * (people/tasks/workflows); only the images inside swap. Positions are viewport
 * fractions measured from the original sticky statement section.
 */
const BRIDGE_SLOTS = [
  { left: "20%", top: "18%" }, // top-left
  { left: "76%", top: "19%" }, // top-right
  { left: "16%", top: "73%" }, // bottom-left
  { left: "52%", top: "84%" }, // bottom-center
  { left: "86%", top: "73%" }, // bottom-right
] as const;

function bridgeWidgetStyle(
  index: number,
  widget: (typeof HOME_BRIDGE.slides)[number]["widgets"][number],
): CSSProperties {
  const slot = BRIDGE_SLOTS[index] ?? BRIDGE_SLOTS[0];
  return { width: widget.width, left: slot.left, top: slot.top };
}

const BRIDGE_PARALLAX = [0.45, -0.38, 0.42, -0.32, 0.28];
const BRIDGE_PARALLAX_RANGE = 420;
const BRIDGE_ENTRANCE_END = 0.22;

function bridgeWidgetTranslateY(
  index: number,
  progress: number,
  slideIdx: number,
  activeSlideIndex: number,
): number {
  const speed = BRIDGE_PARALLAX[index] ?? 0.2;
  const parallax = (progress - 0.5) * speed * BRIDGE_PARALLAX_RANGE;
  const entrance =
    progress < BRIDGE_ENTRANCE_END
      ? (1 - progress / BRIDGE_ENTRANCE_END) * (40 + index * 10)
      : 0;
  const inactiveLift = slideIdx === activeSlideIndex ? 0 : 48;
  return parallax + entrance + inactiveLift;
}

function bridgeHeadlineTranslateY(progress: number, segmentProgress: number): number {
  const parallax = (progress - 0.5) * -32;
  const entrance =
    progress < BRIDGE_ENTRANCE_END
      ? (1 - progress / BRIDGE_ENTRANCE_END) * 28
      : 0;
  const segmentDrift = (segmentProgress - 0.5) * -14;
  return parallax + entrance + segmentDrift;
}

/** Framer: sticky viewport + 3×70vh scroll steps drive variant cycle */
function useBridgeScrollState(
  containerRef: React.RefObject<HTMLElement | null>,
  stepRefs: React.RefObject<HTMLDivElement | null>[],
) {
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(-1);
  const [segmentProgress, setSegmentProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const steps = stepRefs
        .map((ref) => ref.current)
        .filter((el): el is HTMLDivElement => el !== null);

      const rect = container.getBoundingClientRect();
      const scrollRange = container.offsetHeight - window.innerHeight;
      const nextProgress =
        scrollRange > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollRange))
          : 0;
      setProgress(nextProgress);

      if (steps.length === 0) return;

      // Match Framer scroll targets (threshold 0): last step whose top crossed ~75% viewport
      const triggerLine = window.innerHeight * 0.75;
      let slide = -1;
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].getBoundingClientRect().top <= triggerLine) {
          slide = i;
        }
      }
      setActiveSlide(slide);

      if (slide < 0) {
        setSegmentProgress(0);
        return;
      }

      const stepEl = steps[slide];
      const stepTop = stepEl.getBoundingClientRect().top;
      const stepHeight = stepEl.offsetHeight || 1;
      const traveled = triggerLine - stepTop;
      setSegmentProgress(Math.min(1, Math.max(0, traveled / stepHeight)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, [containerRef]);

  return { progress, activeSlide, segmentProgress };
}

function BridgeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const { progress, activeSlide: slideIndex, segmentProgress } = useBridgeScrollState(
    containerRef,
    [step1Ref, step2Ref, step3Ref],
  );
  const headlineY = bridgeHeadlineTranslateY(progress, segmentProgress);

  return (
    <section
      ref={containerRef}
      className="relative isolate z-0 bg-white"
      data-framer-name="Statement Section"
    >
      <div className="sticky top-0 z-[1] flex h-[100svh] items-center justify-center overflow-hidden lg:h-screen">
        <div className="bridge-dot-grid pointer-events-none absolute inset-0 z-0" aria-hidden />
        <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block" aria-hidden>
          {HOME_BRIDGE.slides.map((slide, slideIdx) => {
            const isActive = slideIdx === slideIndex && slideIndex >= 0;
            return (
              <div
                key={slide.highlightWord}
                className="absolute inset-0 transition-opacity duration-700 ease-out"
                style={{ opacity: isActive ? 1 : 0 }}
              >
                {slide.widgets.map((widget, index) => {
                  const translateY = bridgeWidgetTranslateY(
                    index,
                    progress,
                    slideIdx,
                    slideIndex,
                  );
                  return (
                    <div
                      key={widget.key}
                      className="absolute will-change-transform transition-opacity duration-700 ease-out"
                      style={{
                        ...bridgeWidgetStyle(index, widget),
                        transform: `translate(-50%, calc(-50% + ${translateY}px))`,
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <Image
                        src={asset(widget.key)}
                        alt=""
                        width={widget.imgWidth}
                        height={widget.imgHeight}
                        className="h-auto w-full rounded-xl shadow-lg"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 lg:px-10">
          <div
            className="flex items-center justify-center will-change-transform"
            style={{ transform: `translate3d(0, ${headlineY}px, 0)` }}
          >
            <h2 className="max-w-[850px] text-center text-2xl font-medium leading-snug tracking-[-0.02em] will-change-transform md:text-4xl lg:text-[2.5rem]">
              <BridgeTitle activeSlideIndex={slideIndex} />
            </h2>
          </div>
        </div>
      </div>
      {/* Framer statement steps: 70vh × 3 + 100vh filler while sticky stays pinned */}
      <div ref={step1Ref} className="h-[55vh] lg:h-[70vh]" aria-hidden />
      <div ref={step2Ref} className="h-[55vh] lg:h-[70vh]" aria-hidden />
      <div ref={step3Ref} className="h-[55vh] lg:h-[70vh]" aria-hidden />
      <div className="h-[80vh] lg:h-[100vh]" aria-hidden />
    </section>
  );
}

const PAIN_CARD_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

const FEATURE_CARD_SIZES: Record<string, { width: number; height: number }> = {
  featureWorkspaces: { width: 960, height: 768 },
  featureCollaboration: { width: 960, height: 813 },
};

function FeatureFloatingCard({
  imageKey,
  width,
  height,
  surface,
  solid = true,
}: {
  imageKey: keyof typeof HOME_ASSETS;
  width: number;
  height: number;
  surface: string;
  /** true = opaque mockup card (gets its own bg + shadow); false = transparent overlay */
  solid?: boolean;
}) {
  const { ref, visible } = useInView(0.3);

  return (
    <div
      ref={ref}
      className="relative min-h-[360px] overflow-hidden rounded-2xl md:min-h-[480px]"
      style={{ background: surface }}
    >
      <div
        className={`feature-floating-card absolute left-1/2 top-1/2 w-[min(320px,88%)] ${visible ? "is-visible" : ""}`}
      >
        <Image
          src={asset(imageKey)}
          alt=""
          width={width}
          height={height}
          className={`h-auto w-full ${solid ? "rounded-2xl bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)]" : ""}`}
        />
      </div>
    </div>
  );
}

/** Fictional customer brands shown on the testimonial portraits (index-aligned with HOME_TESTIMONIALS.items) */
const TESTIMONIAL_COMPANIES = ["Journey", "AIVA", "Alexun"] as const;

/** Workflow carousel: per-step composite visuals (bg + overlay + widget) and auto-advance timing */
const WORKFLOW_VISUALS = ["workflowPlan", "workflowExecute", "workflowOptimize"] as const;
const WORKFLOW_STEP_MS = 6000;

/** Integration ticker rows — filled logo tiles interspersed with empty placeholder tiles */
const INTEGRATION_ROWS: (string | null)[][] = [
  ["integration0", null, "integration1", "integration2", "integration3", null, "integration4", "integration5", null, "integration6", "integration7", "integration8", null],
  [null, "integration4", "integration5", null, "integration6", "integration7", null, "integration8", "integration0", "integration1", null, "integration2", "integration3"],
];

function IntegrationTicker({
  row,
  rtl = false,
  duration,
}: {
  row: (string | null)[];
  rtl?: boolean;
  duration: string;
}) {
  const items = [...row, ...row];
  return (
    <div
      className="marquee-row relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className={`marquee-track flex w-max gap-6 ${rtl ? "is-rtl" : ""}`}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {items.map((key, i) => (
          <div
            key={i}
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] border border-[var(--ordina-border)] ${
              key ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]" : "bg-[var(--ordina-surface)]"
            }`}
          >
            {key ? (
              <Image
                src={asset(key as keyof typeof HOME_ASSETS)}
                alt=""
                width={36}
                height={36}
                className="h-9 w-9"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyLogo({ index }: { index: number }) {
  const name = TESTIMONIAL_COMPANIES[index] ?? "";
  return (
    <span className="inline-flex items-center gap-2 text-[18px] font-medium tracking-[-0.01em]">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
        {index === 0 ? (
          // Journey — dot cluster
          <g fill="currentColor">
            <circle cx="6" cy="7" r="1.7" />
            <circle cx="12" cy="7" r="1.7" />
            <circle cx="18" cy="7" r="1.7" />
            <circle cx="6" cy="13" r="1.7" />
            <circle cx="12" cy="13" r="1.7" />
            <circle cx="18" cy="13" r="1.7" />
            <circle cx="9" cy="19" r="1.7" />
            <circle cx="15" cy="19" r="1.7" />
          </g>
        ) : index === 1 ? (
          // AIVA — rounded tricorn emblem with trident
          <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
            <path d="M12 2.8 20.8 18.4a1.8 1.8 0 0 1-1.6 2.7H4.8a1.8 1.8 0 0 1-1.6-2.7Z" />
            <path d="M12 8v8M12 11.4 8.6 8.4M12 11.4 15.4 8.4" />
          </g>
        ) : (
          // Alexun — six-petal asterisk
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 3.5v17M4.65 7.75 19.35 16.25M19.35 7.75 4.65 16.25" />
          </g>
        )}
      </svg>
      {name}
    </span>
  );
}

function HeroLogoTicker() {
  const logos = HOME_HERO_LOGOS.map((key: (typeof HOME_HERO_LOGOS)[number]) => asset(key));
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
          <img key={`${src}-${i}`} src={src} alt="" className="h-6 w-auto shrink-0" />
        ))}
      </div>
    </div>
  );
}

export function HomePageContent() {
  const [testimonialIndex, setTestimonialIndex] = useState(1);
  const [workflowIndex, setWorkflowIndex] = useState(0);
  const { ref: workflowRef, visible: workflowVisible } = useInView(0.3);
  const { ref: ctaRef, visible: ctaVisible } = useInView(0.35);
  const { ref: painIntroRef, visible: painIntroVisible } = useInView(0.4);
  const { ref: painCardsRef, visible: painCardsVisible } = useInView(0.4);

  // Auto-advance the workflow carousel (only while it's in view), matching Framer's progress carousel
  useEffect(() => {
    if (!workflowVisible) return;
    const t = setTimeout(
      () => setWorkflowIndex((i) => (i + 1) % HOME_WORKFLOW.steps.length),
      WORKFLOW_STEP_MS,
    );
    return () => clearTimeout(t);
  }, [workflowIndex, workflowVisible]);

  return (
    <div className="text-[var(--ordina-text)]">
      <section className="bg-[var(--ordina-navy-deep)] pb-16 pt-12 text-white md:pb-20 md:pt-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm text-white/55">{HOME_HERO.eyebrow}</p>
          <h1 className="mt-5 text-[2.5rem] font-medium leading-[1.05] tracking-[-0.03em] md:text-[4.25rem]">
            {HOME_HERO.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            {HOME_HERO.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ordina-lime)] px-5 py-2.5 text-sm font-medium text-black"
            >
              {HOME_HERO.primaryCta}
              <span aria-hidden>›</span>
            </Link>
            <Link
              href="/#features"
              className="inline-flex rounded-full border border-white/10 bg-[#0a3348] px-5 py-2.5 text-sm font-medium text-white"
            >
              {HOME_HERO.secondaryCta}
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm text-white/60">
            <Image src="/assets/home/g2-logo.svg" alt="" width={14} height={14} aria-hidden />
            <div className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Image
                  key={i}
                  src="/assets/home/star-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              ))}
            </div>
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
            <span className="inline-flex flex-wrap items-center justify-center gap-2">
              {HOME_HERO.awardPrefix}
              <Image
                src="/assets/home/gartner-logo.svg"
                alt="Gartner"
                width={53}
                height={12}
                className="h-3 w-auto"
              />
            </span>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-5 px-6 md:grid-cols-[1.12fr_0.88fr] md:items-stretch">
          <div className="relative aspect-[1200/679] overflow-hidden rounded-[24px] md:aspect-auto md:h-[480px]">
            <Image
              src={asset("heroUnlockCard")}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover object-center"
              priority
              unoptimized
            />
            <div className="absolute left-0 top-0 max-w-[min(100%,420px)] p-8 md:p-10">
              <h2 className="text-2xl font-medium leading-tight tracking-[-0.02em] md:text-[1.75rem]">
                {HOME_UNLOCK.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/90 md:text-base">
                {HOME_UNLOCK.description}
              </p>
            </div>
          </div>
          <div className="relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-[#024364] via-[#023650] to-[#01283c] p-8 md:min-h-[480px] md:h-[480px] md:p-10">
            <Image
              src="/assets/home/quote-mark.svg"
              alt=""
              width={40}
              height={40}
              className="h-10 w-auto"
              aria-hidden
            />
            <div>
              <p className="text-lg leading-relaxed md:text-xl">{HOME_UNLOCK.quote}</p>
              <div className="mt-8">
                <p className="font-medium">{HOME_UNLOCK.author}</p>
                <p className="mt-0.5 text-sm text-white/65">{HOME_UNLOCK.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <HeroLogoTicker />
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#d7e4ea] to-white px-6 py-16 md:px-10 md:py-[120px]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 md:gap-20">
          <div
            ref={painIntroRef}
            className="flex flex-col items-center gap-6 text-center"
          >
            <h2
              className={`max-w-3xl text-[2rem] font-medium leading-[1.05] tracking-[-0.02em] will-change-[transform,opacity,filter] transition-[transform,opacity,filter] duration-[1200ms] ease-out md:text-5xl lg:text-[3.25rem] ${
                painIntroVisible
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-2.5 opacity-0 blur-[3px]"
              }`}
            >
              {HOME_PAIN_POINTS.title}
            </h2>
            <p
              className={`max-w-[500px] text-base leading-relaxed text-black/50 will-change-[transform,opacity] transition-[transform,opacity] duration-[1200ms] md:text-lg ${
                painIntroVisible ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
              }`}
              style={{
                transitionTimingFunction: PAIN_CARD_EASE,
                transitionDelay: painIntroVisible ? "400ms" : "0ms",
              }}
            >
              {HOME_PAIN_POINTS.description}
            </p>
          </div>
          <div
            ref={painCardsRef}
            className="grid w-full max-w-[900px] grid-cols-1 gap-6 md:grid-cols-3"
          >
            {HOME_PAIN_POINTS.items.map((item, index) => (
              <div
                key={item.label}
                className={`flex will-change-[transform,opacity] transition-[transform,opacity] duration-[600ms] ${
                  index === 1 ? "md:pt-16" : ""
                } ${
                  painCardsVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-[30px] opacity-0"
                }`}
                style={{
                  transitionTimingFunction: PAIN_CARD_EASE,
                  transitionDelay: painCardsVisible ? `${index * 200}ms` : "0ms",
                }}
              >
                <div className="flex h-[360px] w-full flex-col justify-between rounded-xl bg-gradient-to-b from-white to-white/10 p-6 md:p-8">
                  <div>
                    <span className="inline-flex rounded-full border border-[var(--ordina-border)] px-3 py-1 text-xs text-[var(--ordina-muted)]">
                      {item.label}
                    </span>
                    <div className="mt-6">
                      <PainStat
                        prefix={item.statPrefix}
                        value={item.statValue}
                        suffix={item.statSuffix}
                        active={painCardsVisible}
                      />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--ordina-muted)] md:text-base">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BridgeSection />

      <section id="features" className="bg-white py-16 md:py-[136px]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-text)] shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-4 12.7c.5.4.8 1 .9 1.6L9 18h6l.1-1.7c.1-.6.4-1.2.9-1.6A7 7 0 0 0 12 2Z" />
                </svg>
                {HOME_FEATURES.eyebrow}
              </span>
              <h2 className="mt-3 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                {HOME_FEATURES.title}
              </h2>
            </div>
            <p className="text-lg text-[var(--ordina-muted)] lg:max-w-md lg:justify-self-end">
              {HOME_FEATURES.description}
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[HOME_FEATURES.items[0], HOME_FEATURES.items[1]].map((feature) => {
              const sizes = FEATURE_CARD_SIZES[feature.imageKey] ?? { width: 696, height: 476 };
              return (
              <div key={feature.title}>
                <FeatureFloatingCard
                  imageKey={feature.imageKey as keyof typeof HOME_ASSETS}
                  width={sizes.width}
                  height={sizes.height}
                  surface={
                    feature.imageKey === "featureWorkspaces"
                      ? "linear-gradient(135deg, #a4ac9c 0%, #c4c7b8 100%)"
                      : "linear-gradient(135deg, #ededed 0%, #f4f4f4 100%)"
                  }
                  solid={feature.imageKey === "featureWorkspaces"}
                />
                <h3 className="mt-6 text-xl font-medium">{feature.title}</h3>
                <p className="mt-2 text-[var(--ordina-muted)]">{feature.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ordina-navy-deep)] py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl bg-[var(--ordina-navy-deep)] px-6 py-12 md:px-10 md:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="text-white">
                <h3 className="text-2xl font-medium md:text-3xl">
                  {HOME_FEATURES.items[2].title}
                </h3>
                <p className="mt-3 text-white/70">{HOME_FEATURES.items[2].description}</p>
                {"bullets" in HOME_FEATURES.items[2] && HOME_FEATURES.items[2].bullets ? (
                  <ul className="mt-6 space-y-3">
                    {HOME_FEATURES.items[2].bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm text-white/80">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 text-xs">
                          ✓
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={asset(HOME_FEATURES.items[2].imageKey as keyof typeof HOME_ASSETS)}
                  alt=""
                  width={588}
                  height={480}
                  className="h-auto w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl px-6">
          <div className="overflow-hidden rounded-2xl bg-[var(--ordina-navy-deep)] px-6 py-12 md:px-10 md:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="overflow-hidden rounded-xl lg:order-1">
                <Image
                  src={asset(HOME_FEATURES.items[3].imageKey as keyof typeof HOME_ASSETS)}
                  alt=""
                  width={588}
                  height={480}
                  className="h-auto w-full rounded-xl"
                />
              </div>
              <div className="text-white lg:order-2">
                <h3 className="text-2xl font-medium md:text-3xl">
                  {HOME_FEATURES.items[3].title}
                </h3>
                <p className="mt-3 text-white/70">{HOME_FEATURES.items[3].description}</p>
                {"bullets" in HOME_FEATURES.items[3] && HOME_FEATURES.items[3].bullets ? (
                  <ul className="mt-6 space-y-3">
                    {HOME_FEATURES.items[3].bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-sm text-white/80">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/30 text-xs">
                          ✓
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--ordina-border)] bg-[var(--ordina-surface)] py-16 md:py-[122px]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-muted)]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2.5" y="7" width="19" height="13.5" rx="2" />
                <path d="M8 7V5.2A2.2 2.2 0 0 1 10.2 3h3.6A2.2 2.2 0 0 1 16 5.2V7" />
              </svg>
              {HOME_TESTIMONIALS.eyebrow}
            </span>
            <h2 className="mx-auto mt-4 max-w-[460px] text-balance bg-gradient-to-b from-[#141414] from-45% to-[#9aa0ab] bg-clip-text text-3xl font-medium tracking-[-0.02em] text-transparent md:text-4xl">
              {HOME_TESTIMONIALS.title}
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-4 md:flex-row">
            {HOME_TESTIMONIALS.items.map((item, index) => {
              const isActive = testimonialIndex === index;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setTestimonialIndex(index)}
                  style={{ flexGrow: isActive ? 2.2 : 1, flexBasis: 0 }}
                  className={`relative overflow-hidden rounded-2xl text-left transition-[flex-grow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[450px] ${
                    isActive ? "bg-[#1a1a1a]" : "bg-[#e9e9ea]"
                  }`}
                >
                  <div className="flex h-full flex-col md:flex-row">
                    <div
                      className={`relative min-h-[300px] md:min-h-0 ${
                        isActive ? "md:w-[42%]" : "flex-1"
                      }`}
                    >
                      <Image
                        src={asset(item.portraitKey as keyof typeof HOME_ASSETS)}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-top"
                      />
                      {!isActive ? (
                        <div className="pointer-events-none absolute inset-0 bg-white/25" />
                      ) : null}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
                      <div className="absolute bottom-5 left-5 text-white">
                        <CompanyLogo index={index} />
                      </div>
                    </div>
                    {isActive ? (
                      <div className="flex flex-1 flex-col justify-between p-6 text-white md:p-8">
                        <p
                          className="text-lg leading-relaxed md:text-xl"
                          style={{
                            maskImage:
                              "linear-gradient(to bottom, #000 72%, transparent 100%)",
                            WebkitMaskImage:
                              "linear-gradient(to bottom, #000 72%, transparent 100%)",
                          }}
                        >
                          {item.quote}
                        </p>
                        <div className="mt-6">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-white/60">{item.role}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={workflowRef} className="bg-white py-16 md:py-[150px]">
        <div className="mx-auto max-w-6xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-muted)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 17 9 11l4 4 8-8" />
              <path d="M17 4h4v4" />
            </svg>
            {HOME_WORKFLOW.eyebrow}
          </span>
          <h2 className="mt-4 max-w-2xl bg-gradient-to-r from-[#141414] from-55% to-[#9aa0ab] bg-clip-text text-3xl font-medium tracking-[-0.02em] text-transparent md:text-4xl">
            {HOME_WORKFLOW.title}
          </h2>
          <div className="mt-10 grid gap-0 md:grid-cols-3">
            {HOME_WORKFLOW.steps.map((step, index) => {
              const isActive = workflowIndex === index;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setWorkflowIndex(index)}
                  className="px-4 pt-5 text-left md:px-6"
                >
                  <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-[#f2f2f2]">
                    {isActive ? (
                      <div
                        key={workflowIndex}
                        className="wf-progress-fill absolute left-0 top-0 h-full bg-[var(--ordina-accent)]"
                      />
                    ) : null}
                  </div>
                  <h3
                    className={`mt-5 text-lg font-medium transition-opacity duration-500 ${
                      isActive ? "text-[var(--ordina-text)]" : "text-[var(--ordina-text)]/40"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed text-[var(--ordina-muted)] transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="relative mt-8 aspect-[1200/643] overflow-hidden rounded-2xl bg-[#0c0c0c]">
            {WORKFLOW_VISUALS.map((key, index) => (
              <Image
                key={key}
                src={asset(key)}
                alt={HOME_WORKFLOW.steps[index]?.title ?? ""}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 1152px"
                className="object-cover transition-opacity duration-[1000ms] ease-out"
                style={{ opacity: workflowIndex === index ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-[205px]">
        <div className="mx-auto max-w-6xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-muted)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {HOME_IMPACT.eyebrow}
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-[-0.02em] md:text-4xl">
            {HOME_IMPACT.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--ordina-muted)]">{HOME_IMPACT.description}</p>
        </div>
        <div
          className="marquee-row relative mt-10 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          }}
        >
          <div
            className="marquee-track flex w-max gap-5"
            style={{ ["--marquee-duration" as string]: "60s" }}
          >
            {[...HOME_IMPACT.cards, ...HOME_IMPACT.cards].map((card, i) => (
              <div
                key={`${card.label}-${i}`}
                className="group relative h-[360px] w-[440px] shrink-0 overflow-hidden rounded-2xl"
              >
                <Image
                  src={asset(card.imageKey as keyof typeof HOME_ASSETS)}
                  alt=""
                  fill
                  sizes="440px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 20%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 100%)",
                  }}
                />
                <div className="absolute left-6 top-6">
                  <Image
                    src={asset(card.logoKey as keyof typeof HOME_ASSETS)}
                    alt=""
                    width={120}
                    height={24}
                    className="h-6 w-auto max-w-[130px]"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-4xl font-medium tracking-tight">{card.value}</p>
                  <p className="mt-1 text-sm text-white/80">{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--ordina-border)] bg-white py-16 md:py-[122px]">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-muted)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 3v4M3 5h4M6 17v4M4 19h4" />
              <path d="M13 3 15.2 8.8 21 11l-5.8 2.2L13 19l-2.2-5.8L5 11l5.8-2.2Z" />
            </svg>
            {HOME_INTEGRATIONS.eyebrow}
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl bg-gradient-to-b from-[#3a3f47] from-30% to-[#b6bcc6] bg-clip-text text-3xl font-medium tracking-[-0.02em] text-transparent md:text-4xl">
            {HOME_INTEGRATIONS.title}
          </h2>
        </div>
        <div className="mt-12 space-y-6">
          <IntegrationTicker row={INTEGRATION_ROWS[0]} duration="38s" />
          <IntegrationTicker row={INTEGRATION_ROWS[1]} rtl duration="46s" />
        </div>
      </section>

      <section className="bg-[var(--ordina-navy-deep)] py-16 text-white md:py-[148px]">
        <div className="mx-auto max-w-6xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[var(--ordina-accent-light)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
              <path d="M14 3v4h4M8.5 12h7M8.5 16h5" />
            </svg>
            {HOME_BLOG.eyebrow}
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-[-0.02em] md:text-4xl">
            {HOME_BLOG.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{HOME_BLOG.description}</p>
          <article className="relative mt-10 overflow-hidden rounded-3xl bg-[#0a3348]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-28 -top-28 h-[460px] w-[460px] rounded-full border border-white/[0.05]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-[300px] w-[300px] rounded-full border border-white/[0.04]"
            />
            <div className="relative grid gap-6 p-4 md:grid-cols-2 md:p-5">
              <div className="relative min-h-[280px] overflow-hidden rounded-2xl md:min-h-[460px]">
                <Image
                  src={asset(HOME_BLOG.featured.imageKey as keyof typeof HOME_ASSETS)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-4 md:p-8 lg:p-12">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--ordina-accent-light)]">
                  Featured Post
                </p>
                <h3 className="mt-4 text-3xl font-medium leading-[1.1] tracking-[-0.01em] md:text-4xl">
                  <Link href={`/blog/${HOME_BLOG.featured.slug}`} className="hover:opacity-90">
                    {HOME_BLOG.featured.title}
                  </Link>
                </h3>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
                  {HOME_BLOG.featured.excerpt}
                </p>
                <Link
                  href={`/blog/${HOME_BLOG.featured.slug}`}
                  className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                  Read more
                  <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
          </article>
          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
            {HOME_BLOG.posts.map((post) => (
              <article key={post.slug} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={asset(post.imageKey as keyof typeof HOME_ASSETS)}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale transition group-hover:grayscale-0"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-[var(--ordina-navy-mid)] px-2.5 py-1 text-xs text-white">
                    {post.category}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-white/55">
                  <span>{post.date}</span>
                  <span aria-hidden>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-2 text-lg font-medium leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/65">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm underline underline-offset-4"
                >
                  Read more
                  <span aria-hidden>›</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-[170px]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-muted)]">
                {HOME_FAQ.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
                {HOME_FAQ.title}
              </h2>
              <div className="mt-10 divide-y divide-[var(--ordina-border)]">
                {HOME_FAQ.items.map((item) => (
                  <details key={item.q} className="group py-5">
                    <summary className="cursor-pointer list-none font-medium marker:content-none">
                      <span className="flex items-center justify-between gap-4">
                        {item.q}
                        <span className="shrink-0 text-xl font-light text-[var(--ordina-muted)] transition group-open:rotate-45">
                          +
                        </span>
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ordina-muted)]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
            <div className="lg:pt-12">
              <p className="text-sm leading-relaxed text-[var(--ordina-muted)]">
                {HOME_FAQ.description}
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex rounded-[10px] bg-[var(--ordina-navy-mid)] px-5 py-2.5 text-sm font-medium text-white"
              >
                {HOME_FAQ.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--ordina-navy-deep)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* top-left curved blob */}
          <div className="absolute left-[6%] -top-16 h-[300px] w-[320px] rounded-[0_0_170px_0] bg-white/[0.03]" />
          {/* bottom-left rectangle */}
          <div className="absolute left-[6%] top-[250px] h-[200px] w-[340px] rounded-[28px] bg-white/[0.028]" />
          {/* center-right rectangle */}
          <div className="absolute left-[64%] top-24 h-[210px] w-[290px] rounded-[28px] bg-white/[0.03]" />
          {/* bottom-right curved blob */}
          <div className="absolute -right-12 top-[230px] h-[380px] w-[380px] rounded-[190px_0_0_0] bg-white/[0.03]" />
        </div>
        <div
          ref={ctaRef}
          className="relative mx-auto max-w-4xl px-6 pb-24 pt-20 text-center text-white md:pb-[150px] md:pt-[140px]"
        >
          <h2
            className="mx-auto max-w-[500px] text-3xl font-medium leading-[1.08] tracking-[-0.02em] text-white/88 transition-all duration-700 ease-out md:text-[54px]"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "none" : "translateY(26px)",
            }}
          >
            {HOME_CTA.title}
          </h2>
          <p
            className="mx-auto mt-4 max-w-[620px] text-lg text-white/60 transition-all duration-700 ease-out"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "none" : "translateY(26px)",
              transitionDelay: ctaVisible ? "120ms" : "0ms",
            }}
          >
            {HOME_CTA.description}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ordina-lime)] px-5 py-2.5 text-sm font-medium text-black shadow-[0_0_0_1px_rgba(0,0,0,0.06)] transition-all duration-700 ease-out"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "none" : "translateY(26px)",
              transitionDelay: ctaVisible ? "230ms" : "0ms",
            }}
          >
            {HOME_CTA.button}
            <span aria-hidden>›</span>
          </Link>
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-6 text-sm text-white/55 transition-all duration-700 ease-out"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "none" : "translateY(26px)",
              transitionDelay: ctaVisible ? "320ms" : "0ms",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
              {HOME_CTA.noteLine1}
            </span>
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {HOME_CTA.noteLine2}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
