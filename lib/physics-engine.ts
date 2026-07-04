/**
 * physics-engine.ts
 *
 * Singleton manager for the shared Matter.js physics world.
 *
 * Architecture overview:
 * ─────────────────────────────────────────────────────────────────
 *  ┌───────────────────────────────────────────────────────────┐
 *  │  PhysicsEngine (singleton)                                │
 *  │   ├─ Matter.Engine  (gravity, collision detection)        │
 *  │   ├─ Matter.Runner  (updates engine on requestAnimFrame)  │
 *  │   ├─ Invisible <canvas> overlay  (captures mouse events) │
 *  │   ├─ Matter.Mouse + MouseConstraint  (drag & throw)       │
 *  │   └─ Static boundary bodies  (floor + two side walls)    │
 *  └───────────────────────────────────────────────────────────┘
 *
 *  Each <PhysicsNode> registers one rectangular body here and
 *  syncs its DOM element position to the body's physics position
 *  via requestAnimationFrame.
 *
 * Usage (called by PhysicsNode, not directly by consumers):
 *   getPhysicsEngine()  → init or return existing instance
 *   addBody(body)       → register a body into the world
 *   removeBody(body)    → deregister a body from the world
 *   destroyPhysicsEngine() → teardown everything
 */

import Matter from "matter-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PhysicsEngineInstance {
  engine: Matter.Engine;
  runner: Matter.Runner;
  mouse: Matter.Mouse;
  mouseConstraint: Matter.MouseConstraint;
  /** Invisible full-screen canvas that captures mouse events for drag */
  canvas: HTMLCanvasElement;
  /** Imperatively enable/disable the canvas's pointer-event capture */
  setPointerCapture: (enabled: boolean) => void;
  /** Tear down the entire engine and remove the canvas from DOM */
  destroy: () => void;
}

// ---------------------------------------------------------------------------
// Module-level singleton reference
// ---------------------------------------------------------------------------

let instance: PhysicsEngineInstance | null = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Creates static boundary bodies (floor + left/right walls).
 * Uses a generous thickness so fast-moving objects don't tunnel through.
 */
function createBoundaries(width: number, height: number): Matter.Body[] {
  const T = 80; // boundary thickness in px
  const opts = { isStatic: true, label: "__boundary__", friction: 0.3 };

  return [
    // Floor — sits just below the visible viewport
    Matter.Bodies.rectangle(width / 2, height + T / 2, width * 3, T, opts),
    // Left wall
    Matter.Bodies.rectangle(-T / 2, height / 2, T, height * 3, opts),
    // Right wall
    Matter.Bodies.rectangle(width + T / 2, height / 2, T, height * 3, opts),
  ];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the singleton engine instance, creating it if it doesn't exist.
 * Safe to call multiple times — always returns the same instance.
 *
 * MUST be called from a browser context (client-side only).
 */
export function getPhysicsEngine(): PhysicsEngineInstance {
  if (instance) return instance;

  // ── 1. Invisible canvas overlay ─────────────────────────────────────────
  // The canvas is used only for mouse event capturing by Matter.Mouse.
  // It is transparent (no renderer) and floats above all content.
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = [
    "position:fixed",
    "inset:0",
    "width:100vw",
    "height:100vh",
    "z-index:9998",          // below physics elements (z-index 9999) but above page
    "pointer-events:none",   // disabled by default; enabled only during chaos
    "background:transparent",
    "touch-action:none",
  ].join(";");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  // ── 2. Engine ────────────────────────────────────────────────────────────
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: 1, scale: 0.0012 }, // comfortable downward gravity
  });

  // ── 3. Boundaries ────────────────────────────────────────────────────────
  const boundaries = createBoundaries(window.innerWidth, window.innerHeight);
  Matter.Composite.add(engine.world, boundaries);

  // ── 4. Mouse + MouseConstraint ───────────────────────────────────────────
  // Mouse is attached to the canvas so coordinates match the viewport.
  const mouse = Matter.Mouse.create(canvas);
  // Prevent Matter from overriding wheel behaviour that would fight scroll
  (mouse as unknown as { element: HTMLCanvasElement }).element.removeEventListener(
    "mousewheel",
    (mouse as unknown as { mousewheel: EventListener }).mousewheel,
  );
  (mouse as unknown as { element: HTMLCanvasElement }).element.removeEventListener(
    "DOMMouseScroll",
    (mouse as unknown as { mousewheel: EventListener }).mousewheel,
  );

  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.18,
      render: { visible: false },
    },
  });
  Matter.Composite.add(engine.world, mouseConstraint);

  // ── 5. Runner (drives the engine via RAF) ─────────────────────────────────
  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  // ── 6. Window resize handler ─────────────────────────────────────────────
  const onResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Replace boundaries with fresh ones matching new dimensions
    const stale = Matter.Composite.allBodies(engine.world).filter(
      (b) => b.label === "__boundary__",
    );
    Matter.Composite.remove(engine.world, stale as unknown as Matter.Body);
    Matter.Composite.add(
      engine.world,
      createBoundaries(window.innerWidth, window.innerHeight),
    );
  };
  window.addEventListener("resize", onResize, { passive: true });

  // ── 7. Public helpers ────────────────────────────────────────────────────
  const setPointerCapture = (enabled: boolean) => {
    canvas.style.pointerEvents = enabled ? "auto" : "none";
  };

  const destroy = () => {
    window.removeEventListener("resize", onResize);
    Matter.Runner.stop(runner);
    Matter.World.clear(engine.world, false);
    Matter.Engine.clear(engine);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    instance = null;
  };

  instance = {
    engine,
    runner,
    mouse,
    mouseConstraint,
    canvas,
    setPointerCapture,
    destroy,
  };

  return instance;
}

/**
 * Add a Matter.Body to the shared world.
 * Initialises the engine singleton if it hasn't been created yet.
 */
export function addBody(body: Matter.Body): void {
  const { engine } = getPhysicsEngine();
  Matter.Composite.add(engine.world, body);
}

/**
 * Remove a Matter.Body from the shared world.
 * No-ops gracefully if the engine doesn't exist.
 */
export function removeBody(body: Matter.Body): void {
  if (!instance) return;
  Matter.Composite.remove(instance.engine.world, body);
}

/**
 * Enable pointer-event capture on the physics canvas.
 * Call this when chaos starts so the user can drag elements.
 */
export function enablePhysicsPointer(): void {
  instance?.setPointerCapture(true);
}

/**
 * Disable pointer-event capture on the physics canvas.
 * Call this when healing/reset completes.
 */
export function disablePhysicsPointer(): void {
  instance?.setPointerCapture(false);
}

/**
 * Fully tear down the engine. Called once all PhysicsNode components
 * have finished their cleanup (e.g. after a successful heal/reset).
 */
export function destroyPhysicsEngine(): void {
  instance?.destroy();
}
