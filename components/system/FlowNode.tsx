// Single source of truth for the left-margin plumb-line diamond, shared by
// every stacked-surface flow (home EditorialFlow, AboutFlow, AduFlow) and the
// flow-less VerticalBrandMark. One vocabulary site-wide (Brian, 2026-07-09
// rail-consistency pass):
//   • shape/size: 8px square rotated 45° → diamond
//   • x: node center collinear with the rail (−3.5px inside the w-px track)
//   • seam placement: −translate-y-1/2 centers the diamond ON its junction
//   • pre-ignition: maroon ring + ink center — legible on light AND dark
//     surfaces (home crosses both), so it never disappears or flips look
//   • ignited: .flow-node-lit (globals.css) fills solid maroon
// The class is exported so VerticalBrandMark renders a pixel-identical diamond
// without duplicating the string.
export const FLOW_NODE_CLASS =
  "flow-node absolute -left-[3.5px] h-2 w-2 -translate-y-1/2 rotate-45 border border-[var(--color-accent)]/65 bg-black/65 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-colors duration-200";

export default function FlowNode({
  top,
}: {
  top: number;
}) {
  return <div data-flow-node="" className={FLOW_NODE_CLASS} style={{ top }} />;
}
