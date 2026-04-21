import { motion } from "framer-motion";

export type BodyZone =
  | "Head"
  | "Neck"
  | "Chest"
  | "Abdomen"
  | "Pelvis"
  | "Left Upper Arm"
  | "Left Lower Arm"
  | "Right Upper Arm"
  | "Right Lower Arm"
  | "Left Thigh"
  | "Left Calf"
  | "Right Thigh"
  | "Right Calf"
  | "Upper Back"
  | "Lower Back";

interface Props {
  active: BodyZone | null;
  onSelect: (z: BodyZone) => void;
}

const STROKE = "oklch(0.35 0.03 265)";
const ACTIVE_FILL = "oklch(0.86 0.08 265)"; // indigo-200-ish via tokens
const IDLE_FILL = "transparent";

export function BodyMap({ active, onSelect }: Props) {
  const fill = (z: BodyZone) => (active === z ? ACTIVE_FILL : IDLE_FILL);

  const Segment = ({
    zone,
    d,
    children,
  }: {
    zone: BodyZone;
    d?: string;
    children?: React.ReactNode;
  }) => {
    const common = {
      onClick: () => onSelect(zone),
      style: { cursor: "pointer" } as const,
      stroke: STROKE,
      strokeWidth: 2,
      strokeLinejoin: "round" as const,
      fill: fill(zone),
    };
    return (
      <motion.g whileTap={{ scale: 0.97 }} aria-label={zone}>
        {d ? <path d={d} {...common} /> : children}
        {!d && children}
      </motion.g>
    );
  };

  // Reusable figure renderer. xOffset shifts the entire figure horizontally.
  // Front and back share the same skeleton; only torso labels differ.
  const Figure = ({
    xOffset,
    variant,
  }: {
    xOffset: number;
    variant: "front" | "back";
  }) => {
    const x = (n: number) => n + xOffset;
    const torsoUpper: BodyZone = variant === "front" ? "Chest" : "Upper Back";
    const torsoMid: BodyZone = variant === "front" ? "Abdomen" : "Lower Back";

    return (
      <g>
        {/* Head */}
        <motion.circle
          cx={x(80)}
          cy={48}
          r={26}
          fill={fill("Head")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Head")}
          whileTap={{ scale: 0.96 }}
          style={{ cursor: "pointer" }}
        />
        {/* Neck */}
        <motion.rect
          x={x(70)}
          y={74}
          width={20}
          height={14}
          rx={4}
          fill={fill("Neck")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Neck")}
          whileTap={{ scale: 0.96 }}
          style={{ cursor: "pointer" }}
        />

        {/* Chest / Upper Back */}
        <motion.path
          d={`M${x(40)} 92 Q${x(80)} 84 ${x(120)} 92 L${x(124)} 142 Q${x(80)} 150 ${x(36)} 142 Z`}
          fill={fill(torsoUpper)}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect(torsoUpper)}
          whileTap={{ scale: 0.98 }}
          style={{ cursor: "pointer" }}
        />
        {/* Abdomen / Lower Back */}
        <motion.path
          d={`M${x(44)} 146 Q${x(80)} 152 ${x(116)} 146 L${x(114)} 188 Q${x(80)} 194 ${x(46)} 188 Z`}
          fill={fill(torsoMid)}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect(torsoMid)}
          whileTap={{ scale: 0.98 }}
          style={{ cursor: "pointer" }}
        />
        {/* Pelvis */}
        <motion.path
          d={`M${x(48)} 192 L${x(112)} 192 L${x(108)} 230 Q${x(80)} 238 ${x(52)} 230 Z`}
          fill={fill("Pelvis")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Pelvis")}
          whileTap={{ scale: 0.98 }}
          style={{ cursor: "pointer" }}
        />

        {/* Right Upper Arm (viewer's left) */}
        <motion.path
          d={`M${x(34)} 96 Q${x(22)} 100 ${x(20)} 142 L${x(34)} 146 Q${x(40)} 110 ${x(40)} 96 Z`}
          fill={fill("Right Upper Arm")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Right Upper Arm")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />
        {/* Right Lower Arm */}
        <motion.path
          d={`M${x(20)} 148 L${x(34)} 150 L${x(36)} 200 L${x(22)} 202 Z`}
          fill={fill("Right Lower Arm")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Right Lower Arm")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />

        {/* Left Upper Arm (viewer's right) */}
        <motion.path
          d={`M${x(126)} 96 Q${x(138)} 100 ${x(140)} 142 L${x(126)} 146 Q${x(120)} 110 ${x(120)} 96 Z`}
          fill={fill("Left Upper Arm")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Left Upper Arm")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />
        {/* Left Lower Arm */}
        <motion.path
          d={`M${x(140)} 148 L${x(126)} 150 L${x(124)} 200 L${x(138)} 202 Z`}
          fill={fill("Left Lower Arm")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Left Lower Arm")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />

        {/* Right Thigh */}
        <motion.path
          d={`M${x(54)} 234 L${x(78)} 234 L${x(76)} 306 L${x(56)} 306 Z`}
          fill={fill("Right Thigh")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Right Thigh")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />
        {/* Right Calf */}
        <motion.path
          d={`M${x(58)} 310 L${x(76)} 310 L${x(74)} 380 L${x(60)} 380 Z`}
          fill={fill("Right Calf")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Right Calf")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />

        {/* Left Thigh */}
        <motion.path
          d={`M${x(82)} 234 L${x(106)} 234 L${x(104)} 306 L${x(84)} 306 Z`}
          fill={fill("Left Thigh")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Left Thigh")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />
        {/* Left Calf */}
        <motion.path
          d={`M${x(84)} 310 L${x(102)} 310 L${x(100)} 380 L${x(86)} 380 Z`}
          fill={fill("Left Calf")}
          stroke={STROKE}
          strokeWidth={2}
          onClick={() => onSelect("Left Calf")}
          whileTap={{ scale: 0.97 }}
          style={{ cursor: "pointer" }}
        />

        {/* Label */}
        <text
          x={x(80)}
          y={400}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill="oklch(0.5 0.02 265)"
          style={{ letterSpacing: 1 }}
        >
          {variant === "front" ? "FRONT" : "BACK"}
        </text>
      </g>
    );
  };

  return (
    <div className="flex w-full items-center justify-center">
      <svg
        viewBox="0 0 340 410"
        className="h-[300px] w-full max-w-[360px] drop-shadow-[0_8px_24px_oklch(0.55_0.15_265/0.12)]"
        aria-label="Body map — front and back"
      >
        <Figure xOffset={0} variant="front" />
        <Figure xOffset={170} variant="back" />
      </svg>
    </div>
  );
}
