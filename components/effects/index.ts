/**
 * Effects Components - Performance Optimized
 *
 * Collection of reusable animation and effect components
 * All components are optimized for 60fps performance with:
 * - GPU acceleration (translate3d)
 * - IntersectionObserver for lazy loading
 * - Efficient spring physics
 * - Minimal re-renders
 */

// Parallax scroll effects
export {
  Parallax,
  ParallaxLayer,
  ParallaxSection,
  FloatingElement,
} from "./parallax";

// Interactive timeline visualization
export {
  InteractiveTimeline,
  type TimelineMilestone,
  type TimelineItemProps,
} from "./interactive-timeline";
