/**
 * AnimationController
 * Two-layer detection only:
 *   1. Screen width < 768 → true mobile
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

  private constructor() {
    if (typeof window === "undefined") return;
    this._isMobile = window.innerWidth < 768;
    this._prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.addEventListener("resize", this._onResize.bind(this), { passive: true });
  }

  private _onResize() {
    this._isMobile = window.innerWidth < 768;
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
