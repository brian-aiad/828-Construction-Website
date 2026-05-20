/**
 * AnimationController
 * Two-layer detection only:
 *   1. Screen width < 1024 → mobile/tablet (no scroll-hijacking)
 *   2. prefers-reduced-motion → user preference
 *
 * NOTE: We intentionally SKIP navigator.maxTouchPoints / ontouchstart because
 * Windows laptops (and many trackpad devices) report touch support even though
 * they are effectively desktop environments. That check was killing animations
 * for most Windows desktop users.
 */
export class AnimationController {
  private static _instance: AnimationController | null = null;

  private _isMobile: boolean = false;
  private _prefersReducedMotion: boolean = false;
  private _desktopQuery: MediaQueryList | null = null;
  private _reducedMotionQuery: MediaQueryList | null = null;

  private constructor() {
    if (typeof window === "undefined") return;

    this._desktopQuery = window.matchMedia("(min-width: 1024px)");
    this._reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this._syncFromMedia();

    this._desktopQuery.addEventListener("change", this._onMediaChange);
    this._reducedMotionQuery.addEventListener("change", this._onMediaChange);
    window.addEventListener("resize", this._onResize.bind(this), { passive: true });
  }

  private _onMediaChange = () => {
    this._syncFromMedia();
  };

  private _syncFromMedia() {
    this._isMobile = !(this._desktopQuery?.matches ?? window.innerWidth >= 1024);
    this._prefersReducedMotion = this._reducedMotionQuery?.matches ?? false;
  }

  private _onResize() {
    this._syncFromMedia();
  }

  private static getInstance(): AnimationController {
    if (!AnimationController._instance) {
      AnimationController._instance = new AnimationController();
    }
    return AnimationController._instance;
  }

  /** True when animations should run (desktop + no reduced-motion preference). */
  static shouldAnimate(): boolean {
    const inst = AnimationController.getInstance();
    return !inst._isMobile && !inst._prefersReducedMotion;
  }

  static getConfig() {
    const inst = AnimationController.getInstance();
    return {
      enabled: AnimationController.shouldAnimate(),
      isMobile: inst._isMobile,
      prefersReducedMotion: inst._prefersReducedMotion,
    };
  }
}
