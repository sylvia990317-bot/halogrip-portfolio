"use client";

import { useEffect, useRef, useState } from "react";

// Keep in sync with the `aspect-ratio` set on `.rwn` in halogrip.css.
const VB_W = 1600;
const VB_H = 720;
const pctX = (x: number) => `${((x / VB_W) * 100).toFixed(2)}%`;
const pctY = (y: number) => `${((y / VB_H) * 100).toFixed(2)}%`;

const topBuildings: [number, number, number, number][] = [
  [10, 30, 170, 250],
  [260, 70, 130, 210],
  [470, 20, 150, 260],
  [700, 75, 140, 205],
  [920, 25, 160, 260],
  [1160, 70, 120, 215],
];

const bottomBuildings: [number, number, number, number][] = [
  [10, 500, 160, 210],
  [250, 530, 150, 180],
  [480, 490, 140, 220],
  [700, 525, 160, 185],
  [940, 495, 150, 215],
  [1160, 515, 140, 195],
  [1370, 495, 140, 215],
];

const labels = [
  {
    n: "01",
    text: "BLOCKED ROADS",
    x: 470,
    y: 296,
    leader: "M500,300 L500,320 L560,344",
    target: [560, 344] as const,
  },
  {
    n: "02",
    text: "BLOCKED FIRE STATION EXITS",
    x: 118,
    y: 288,
    leader: "M170,292 L170,312 L246,334",
    target: [246, 334] as const,
  },
  {
    n: "03",
    text: "DISRUPTED FIREFIGHTING",
    x: 1288,
    y: 282,
    leader: "M1360,286 L1360,306 L1498,328",
    target: [1498, 328] as const,
  },
];

function TopDownTruck({ beacons }: { beacons: ("red" | "blue")[] }) {
  return (
    <g className="rwn-truck">
      <rect x="0" y="0" width="95" height="42" rx="6" className="rwn-truck-body" />
      <rect x="6" y="16" width="83" height="9" className="rwn-truck-stripe" />
      <circle cx="14" cy="42" r="6" className="rwn-wheel" />
      <circle cx="80" cy="42" r="6" className="rwn-wheel" />
      {beacons.map((color, i) => (
        <circle
          key={color + i}
          cx={beacons.length === 1 ? 70 : 24 + i * 42}
          cy="4"
          r="3.4"
          className={`rwn-beacon rwn-beacon-${color}`}
          style={{ animationDelay: `${i * 340}ms` }}
        />
      ))}
    </g>
  );
}

export default function RealWorldScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`rwn${visible ? " is-visible" : ""}`}>
      <div className="rwn-scrim" aria-hidden="true" />

      <div className="rwn-visual" aria-hidden="true">
        <svg className="rwn-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="rwn-door-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e8a15b" stopOpacity=".6" />
              <stop offset="100%" stopColor="#e8a15b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rwn-flame-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0602c" stopOpacity=".5" />
              <stop offset="100%" stopColor="#e0602c" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="rwn-buildings">
            {topBuildings.map(([x, y, w, h], i) => (
              <rect key={`t${i}`} x={x} y={y} width={w} height={h} className={i % 2 ? "rwn-bldg-b" : "rwn-bldg-a"} />
            ))}
            {bottomBuildings.map(([x, y, w, h], i) => (
              <rect key={`b${i}`} x={x} y={y} width={w} height={h} className={i % 2 ? "rwn-bldg-a" : "rwn-bldg-b"} />
            ))}
          </g>

          <g className="rwn-road">
            <rect x="-20" y="300" width="1640" height="160" />
            <line x1="40" y1="380" x2="1560" y2="380" className="rwn-laneline" />
          </g>

          <g className="rwn-station">
            <rect x="10" y="290" width="270" height="200" className="rwn-station-block" />
            <circle cx="150" cy="380" r="120" fill="url(#rwn-door-glow)" />
            <rect x="225" y="345" width="42" height="70" rx="4" className="rwn-station-door" />
            <g transform="translate(95,352)">
              <TopDownTruck beacons={["red"]} />
            </g>
          </g>

          <g className="rwn-destination">
            <rect x="1370" y="330" width="90" height="160" className="rwn-dest-block" />
            <rect x="1470" y="300" width="120" height="190" className="rwn-dest-block" />
            <circle cx="1500" cy="355" r="130" fill="url(#rwn-flame-glow)" />
            <path
              d="M0,-34 C10,-20 14,-6 6,4 C2,9 -2,9 -6,4 C-14,-6 -10,-20 0,-34 Z"
              transform="translate(1495,330) scale(1.5)"
              className="rwn-flame"
            />
            <g transform="translate(1405,392)">
              <TopDownTruck beacons={["red", "blue"]} />
            </g>
          </g>

          <g className="rwn-car" transform="translate(735,347)">
            <rect x="0" y="0" width="130" height="66" rx="16" className="rwn-car-body" />
            <rect x="16" y="9" width="98" height="18" rx="6" className="rwn-car-glass" />
            <circle cx="65" cy="18" r="5.5" className="rwn-car-sensor" />
            <circle cx="120" cy="15" r="3" className="rwn-car-light" />
            <circle cx="120" cy="51" r="3" className="rwn-car-light" />
          </g>

          <g className="rwn-route">
            <path d="M260,378 C400,335 560,425 700,380" className="rwn-path-a" pathLength={1000} />
            <rect x="696" y="298" width="238" height="322" rx="3" className="rwn-bracket" />
            <path
              d="M930,380 C1020,318 1150,316 1230,354 C1280,376 1312,382 1350,382"
              className="rwn-path-b"
              pathLength={1000}
            />
          </g>

          <g className="rwn-leaders">
            {labels.map((l) => (
              <path key={l.n} d={l.leader} className="rwn-leader" pathLength={1000} />
            ))}
            {labels.map((l) => (
              <circle key={`${l.n}-dot`} cx={l.target[0]} cy={l.target[1]} r="4" className="rwn-leader-dot" />
            ))}
          </g>
        </svg>
      </div>

      <div className="rwn-text shell">
        <span className="eyebrow">[ 02.2 / REAL-WORLD NEED ]</span>
        <h2 id="real-world-need-title">
          THE NEED TO MOVE
          <br />
          THE VEHICLE REMAINS.
        </h2>
      </div>

      <div className="rwn-stat" style={{ "--sx": pctX(700), "--sy": pctY(516) } as React.CSSProperties}>
        <strong>74</strong>
        <p>
          AV-related disruptions to emergency response in San Francisco, Nov 2022–Aug 2023.
          <sup>01</sup>
        </p>
      </div>

      <div className="rwn-labels">
        {labels.map((l) => (
          <div key={l.n} className="rwn-label" style={{ "--lx": pctX(l.x), "--ly": pctY(l.y) } as React.CSSProperties}>
            <span>{l.n}</span>
            {l.text}
          </div>
        ))}
      </div>

      {/* TODO(sylvia): verify and cite the source for the "74" figure */}
      <p className="source-note rwn-source">01 — Source pending verification.</p>
    </div>
  );
}
