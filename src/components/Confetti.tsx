import React from "react";
import tw, { styled } from "twin.macro";
import { useSpring, animated, config, interpolate } from "react-spring";

const Piece = styled.svg`
  ${tw`absolute pointer-events-none w-2 h-2`};
  will-change: transform;
`;
const AnimatedPiece = animated(Piece);
type ConfettoProps = {
  anchorRef: React.RefObject<SVGElement | HTMLElement>;
  initialSpeedX?: number;
  initialSpeedY?: number;
  rotate?: number;
  color: string;
  size: number;
};

type ShapeProps = Pick<ConfettoProps, "size" | "color">;

const Circle: React.FC<ShapeProps> = ({ color, size }) => (
  <circle
    cx={`${size / 2}`}
    cy={`${size / 2}`}
    r={`${(size / 2) * 0.6}`}
    fill={color}
  />
);

const Triangle: React.FC<ShapeProps> = ({ color, size }) => {
  const flipped = Math.round(Math.random()) === 1;
  return (
    <polygon
      points={`${size / 2},0 ${size},${randomInRange(
        flipped ? size / 2 : 0,
        size
      )} 0,${randomInRange(flipped ? 0 : size / 2, size)}`}
      fill={color}
    />
  );
};

const Square: React.FC<ShapeProps> = ({ color, size }) => {
  const flipped = Math.round(Math.random()) === 1;
  return (
    <rect
      height={`${randomInRange(0, flipped ? size : size / 2)}`}
      width={`${randomInRange(0, flipped ? size / 2 : size)}`}
      fill={color}
    />
  );
};

const RandomShape: React.FC<ShapeProps> = ({ color, size }) => {
  const Shape = [Circle, Square, Triangle][randomInRange(0, 2)];
  return <Shape color={color} size={size} />;
};
const Confetto: React.FC<ConfettoProps> = ({
  anchorRef,
  initialSpeedX = 200,
  initialSpeedY = 100,
  rotate = 0,
  color = "#FF4A4A",
  size,
}) => {
  const { initialX, initialY } = alignToAnchor(anchorRef.current);
  const { speedY, speedX, opacity } = useSpring({
    config: config.default,
    from: { speedY: initialSpeedY, speedX: initialSpeedX, opacity: 80 },
    to: { speedY: 0, speedX: 0, opacity: 0 },
  }) as any;
  let totalY = 0;
  let totalX = 0;
  const startTime = new Date().getTime() / 1000;
  let lastTime = startTime;
  const frictionPerSecond = 30;
  return (
    <AnimatedPiece
      style={{
        opacity,
        transform: interpolate([speedX, speedY], (speedX, speedY) => {
          const currentTime = new Date().getTime() / 1000;
          const duration = currentTime - lastTime;
          const verticalTraveled = speedY * duration;
          const horizontalTraveled = speedX * duration;
          totalY += verticalTraveled;
          totalX += horizontalTraveled;
          lastTime = currentTime;
          const totalFriction = frictionPerSecond * (currentTime - startTime);
          const finalX = initialX + totalX;
          const finalY = initialY - totalY + totalFriction;
          return `translate3d(${finalX}px, ${finalY}px, 0) rotate(${rotate}deg)`;
        }),
      }}
    >
      <RandomShape color={color} size={size} />
    </AnimatedPiece>
  );
};

const colors: string[] = [
  // primary color
  "hsl(360deg 100% 64%)",
  // secondary color
  "hsl(53deg 100% 55%)",
  // another green filler colors
  "hsl(155deg 100% 53%)",
];

const randomInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const Confetti: React.FC<Pick<ConfettoProps, "anchorRef">> = ({
  anchorRef,
}) => {
  const confettiExploded = React.useRef<boolean>(false);
  React.useEffect(() => {
    confettiExploded.current = true;
  }, []);
  return confettiExploded.current ? null : (
    <>
      {Array.from({ length: 50 }, (_, index) => (
        <Confetto
          key={index}
          anchorRef={anchorRef}
          color={colors[randomInRange(0, colors.length)]}
          initialSpeedX={randomInRange(-500, 500)}
          initialSpeedY={randomInRange(500, 700)}
          rotate={randomInRange(0, 360)}
          size={randomInRange(8, 12)}
        />
      ))}
    </>
  );
};

function alignToAnchor(element: HTMLElement | SVGElement | null) {
  if (!element) {
    return {
      initialX: 0,
      initialY: 0,
    };
  }
  const { width, top, height } = element.getBoundingClientRect();
  return {
    initialX: width / 2,
    initialY: height / 2 - 20,
  };
}

export default Confetti;
