"use client";

import { useState } from "react";

const states = [
  { title: "FORWARD", action: "PUSH / ACCELERATE", angle: -16, description: "Tilt forward to move the vehicle ahead." },
  { title: "NEUTRAL", action: "UPRIGHT / STILL", angle: 0, description: "Release the grip to remain stationary." },
  { title: "BRAKE", action: "PULL / DECELERATE", angle: 13, description: "Pull back to slow the vehicle down." },
  { title: "REVERSE", action: "PULL FURTHER", angle: 24, description: "Continue pulling to reverse at low speed." },
];

export default function InteractionDeck() {
  const [selected, setSelected] = useState(0);
  const active = states[selected];

  return (
    <div className="interaction-control">
      <div className="interaction-demo" aria-live="polite">
        <span className="interaction-indicator">LIVE INPUT / {active.title}</span>
        <img
          src="/media/product-side.webp"
          alt={active.description}
          style={{ transform: `rotate(${active.angle}deg)` }}
        />
        <span className="interaction-description">{active.description}</span>
      </div>
      <div className="interaction-buttons" aria-label="Explore steering control states">
        {states.map((state, index) => (
          <button
            className={index === selected ? "is-active" : ""}
            key={state.title}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={index === selected}
          >
            <span>0{index + 1}</span>
            <strong>{state.title}</strong>
            <small>{state.action}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
