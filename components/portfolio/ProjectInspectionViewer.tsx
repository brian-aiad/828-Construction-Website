"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import Lightbox, {
  ControllerRef,
  SlideImage,
  useController,
  useLightboxState,
} from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { PortfolioCase } from "@/components/portfolio/portfolioCases.data";
import photoMetadata from "@/components/portfolio/portfolioPhotoMetadata.generated.json";
import { lqip } from "@/lib/image-placeholders";
import styles from "./ProjectInspectionViewer.module.css";

type PhotoMetadata = Record<string, { width: number; height: number }>;
type LenisHandle = {
  resize: () => void;
  scrollTo: (target: number, options: { immediate: boolean }) => void;
  start: () => void;
  stop: () => void;
};

const metadata = photoMetadata as PhotoMetadata;

function responsiveSlide(src: string, alt: string): SlideImage {
  const dimensions = metadata[src];
  if (!dimensions) return { src, alt };

  const image = getImageProps({
    src,
    alt,
    width: dimensions.width,
    height: dimensions.height,
    sizes: "100vw",
    quality: 82,
  }).props;

  const srcSet = image.srcSet
    ?.split(",")
    .map((candidate) => candidate.trim().match(/^(.*)\s+(\d+)w$/))
    .filter((candidate): candidate is RegExpMatchArray => Boolean(candidate))
    .map((candidate) => {
      const width = Number(candidate[2]);
      return {
        src: candidate[1],
        width,
        height: Math.round((width / dimensions.width) * dimensions.height),
      };
    });

  return {
    src: image.src,
    alt,
    width: dimensions.width,
    height: dimensions.height,
    srcSet,
  };
}

function InspectionControls({ caseData }: { caseData: PortfolioCase }) {
  const { currentIndex, slides } = useLightboxState();
  const { next, prev } = useController();
  const count = slides.length;
  const offsets = [-3, -2, -1, 0, 1, 2, 3];

  const goTo = (target: number) => {
    const forward = (target - currentIndex + count) % count;
    const backward = (currentIndex - target + count) % count;
    if (!forward) return;
    if (forward <= backward) next({ count: forward });
    else prev({ count: backward });
  };

  return (
    <div className={styles.chrome}>
      <div className={styles.ledger}>
        <p className={styles.title}>{caseData.gallery.title}</p>
        <div className={styles.facts}>
          <span>{caseData.gallery.scope}</span>
          <span className={styles.factRule} aria-hidden="true" />
          <span>{caseData.project.location}</span>
          <span className={styles.factRule} aria-hidden="true" />
          <span>{caseData.project.spec}</span>
        </div>
      </div>

      <div className={styles.register}>
        <div className={styles.registerHeader}>
          <span>{caseData.gallery.title}</span>
          <span className={styles.registerProgress}>
            {String(currentIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
        <div className={styles.rail}>
          {offsets.map((offset) => {
            const index = (currentIndex + offset + count) % count;
            const src = caseData.gallery.photos[index];
            const active = offset === 0;
            return (
              <button
                key={`${offset}-${index}`}
                type="button"
                className={`${styles.railButton} ${active ? styles.railButtonActive : ""}`}
                aria-label={`View photo ${index + 1} of ${count}`}
                aria-current={active ? "true" : undefined}
                onClick={() => goTo(index)}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  quality={62}
                  loading="lazy"
                  decoding="async"
                  placeholder="blur"
                  blurDataURL={lqip(src)}
                  className={styles.railImage}
                />
                <span className={styles.railNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ProjectInspectionViewer({
  caseData,
  initialIndex,
  onClose,
  onIndexChange,
}: {
  caseData: PortfolioCase;
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const controllerRef = useRef<ControllerRef>(null);
  const closeTimerRef = useRef<number | null>(null);
  const closedRef = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const slides = useMemo(
    () =>
      caseData.gallery.photos.map((src, index) =>
        responsiveSlide(
          src,
          `${caseData.gallery.title} — ${caseData.gallery.scope}, photo ${index + 1} of ${caseData.gallery.photos.length}`
        )
      ),
    [caseData]
  );

  const finishClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    onClose();
  }, [onClose]);

  const closeViewer = useCallback(() => {
    setOpen(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(finishClose, 340);
  }, [finishClose]);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const body = document.body;
    const savedY = window.scrollY;
    const savedLocation = `${window.location.pathname}${window.location.search}`;
    const previousOverflow = body.style.overflow;
    const previousOverscroll = root.style.overscrollBehavior;
    const lenis = (window as unknown as { __lenis828?: LenisHandle }).__lenis828;

    body.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    lenis?.stop();

    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      body.style.overflow = previousOverflow;
      root.style.overscrollBehavior = previousOverscroll;
      lenis?.start();
      lenis?.resize();

      const returnFocus = returnFocusRef.current;
      const restoreFocus = () => {
        const active = document.activeElement;
        const focusIsUnclaimed =
          !active ||
          active === document.body ||
          active === document.documentElement ||
          active === returnFocus;
        if (returnFocus?.isConnected && focusIsUnclaimed) {
          returnFocus.focus({ preventScroll: true });
        }
      };
      restoreFocus();
      window.requestAnimationFrame(restoreFocus);
      window.setTimeout(restoreFocus, 120);
      returnFocusRef.current = null;

      const restore = () => {
        if (`${window.location.pathname}${window.location.search}` !== savedLocation) return;
        lenis?.scrollTo(savedY, { immediate: true });
        window.scrollTo(0, savedY);
      };
      restore();
      window.requestAnimationFrame(restore);
    };
  }, []);

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
        return;
      }
      if (event.key !== "Tab") return;

      const portal = document.querySelector<HTMLElement>(".yarl__portal");
      const focusable = Array.from(
        portal?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((element) => element.getClientRects().length > 0);
      if (!portal || !focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const activeIndex = focusable.indexOf(active as HTMLElement);
      if (!portal.contains(active) || activeIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    let focusFrame = 0;
    let focusAttempts = 0;
    const focusClose = () => {
      const closeButton = document.querySelector<HTMLElement>(
        '.yarl__portal button[aria-label="Close"]'
      );
      if (closeButton) {
        closeButton.focus({ preventScroll: true });
        return;
      }
      focusAttempts += 1;
      if (focusAttempts < 12) focusFrame = window.requestAnimationFrame(focusClose);
    };
    focusFrame = window.requestAnimationFrame(focusClose);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [closeViewer]);

  return (
    <Lightbox
      open={open}
      close={closeViewer}
      index={initialIndex}
      slides={slides}
      plugins={[Zoom]}
      className={styles.viewer}
      labels={{
        Lightbox: `${caseData.gallery.title} project inspection`,
        "Photo gallery": `${caseData.gallery.title} photographs`,
        Slide: "Project photograph",
      }}
      controller={{ ref: controllerRef, closeOnBackdropClick: true }}
      noScroll={{ disabled: true }}
      carousel={{ preload: 1, padding: 0, spacing: "18px", imageFit: "contain" }}
      animation={{ fade: 280, swipe: 380, navigation: 300, zoom: 260 }}
      toolbar={{ buttons: ["zoom", "close"] }}
      zoom={{ maxZoomPixelRatio: 1.5, zoomInMultiplier: 2, scrollToZoom: true }}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
        controls: () => <InspectionControls caseData={caseData} />,
      }}
      on={{
        view: ({ index }) => onIndexChange(index),
        exited: finishClose,
      }}
    />
  );
}
