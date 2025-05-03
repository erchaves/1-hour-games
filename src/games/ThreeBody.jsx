import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

const ThreeBody = () => {
  const [pendulumState, setPendulumState] = useState({
    positions: [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ],
    isRunning: false,
    simulationTime: 0,
    debugInfo: "", // For troubleshooting
    angularVelocity: 0
  });

  // Track key presses and touch inputs
  const [keysPressed, setKeysPressed] = useState({
    ArrowLeft: false,
    ArrowRight: false,
  });

  // Track if controls are visible
  const [showControls, setShowControls] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Configuration options
  const [config, setConfig] = useState({
    masses: [1.8, 0.6, 1.7],
    lengths: [90, 70, 96],
    initialAngles: [Math.PI / 4, Math.PI / 2, Math.PI / 6],
    gravity: 4.0,
    damping: 0.11,
    timeStep: 0.05, // Increasing time step for more dramatic motion
    forceTarget: 0, // 0, 1, or 2 for which pendulum receives force
    forceMagnitude: 450, // Default force magnitude
  });

  // Animation frame reference
  const animationRef = useRef(null);
  // Physics system state
  const stateRef = useRef({
    // [θ1, θ2, θ3, ω1, ω2, ω3]
    state: [...config.initialAngles, 0, 0, 0],
    time: 0,
  });

  // Compute derivatives for the state variables with force application
  // state = [θ1, θ2, θ3, ω1, ω2, ω3]
  // returns [ω1, ω2, ω3, α1, α2, α3]
  const computeDerivatives = (state, applyForceParam) => {
    const theta1 = state[0];
    const theta2 = state[1];
    const theta3 = state[2];
    const omega1 = state[3];
    const omega2 = state[4];
    const omega3 = state[5];

    // Angular velocity derivatives (just the current angular velocities)
    const dTheta1 = omega1;
    const dTheta2 = omega2;
    const dTheta3 = omega3;

    // Simplified angular acceleration calculations with improved coupling
    let dOmega1 =
      -(config.gravity / (config.lengths[0] / 100)) * Math.sin(theta1) -
      config.damping * omega1;
    let dOmega2 =
      -(config.gravity / (config.lengths[1] / 100)) * Math.sin(theta2) -
      config.damping * omega2;
    let dOmega3 =
      -(config.gravity / (config.lengths[2] / 100)) * Math.sin(theta3) -
      config.damping * omega3;

    // Add coupling effects
    dOmega1 +=
      0.5 *
      omega2 *
      omega2 *
      Math.sin(theta1 - theta2) *
      (config.masses[1] / config.masses[0]);
    dOmega2 +=
      0.5 *
      omega1 *
      omega1 *
      Math.sin(theta2 - theta1) *
      (config.masses[0] / config.masses[1]);
    dOmega2 +=
      0.5 *
      omega3 *
      omega3 *
      Math.sin(theta2 - theta3) *
      (config.masses[2] / config.masses[1]);
    dOmega3 +=
      0.5 *
      omega2 *
      omega2 *
      Math.sin(theta3 - theta2) *
      (config.masses[1] / config.masses[2]);

    // Apply external forces
    if (applyForceParam && (keysPressed.ArrowLeft || keysPressed.ArrowRight)) {
      const rotationDirection = keysPressed.ArrowLeft ? -1 : 1; // -1 clockwise, 1 counter-clockwise
      const forceMagnitude = config.forceMagnitude / 100;
      const targetIdx = config.forceTarget;

      // Direct application of rotation to angular velocity
      if (targetIdx === 0) {
        dOmega1 += rotationDirection * forceMagnitude;
      } else if (targetIdx === 1) {
        dOmega2 += rotationDirection * forceMagnitude;
      } else if (targetIdx === 2) {
        dOmega3 += rotationDirection * forceMagnitude;
      }
    }

    return [dTheta1, dTheta2, dTheta3, dOmega1, dOmega2, dOmega3];
  };

  // Implement the RK4 integration step - add state limits to prevent instability
  const rk4Step = () => {
    const h = config.timeStep;
    const state = [...stateRef.current.state];

    // Step 1
    const k1 = computeDerivatives(state, true); // Apply force in first step

    // Step 2
    const state2 = state.map((val, idx) => val + (k1[idx] * h) / 2);
    const k2 = computeDerivatives(state2, false); // Don't apply force again

    // Step 3
    const state3 = state.map((val, idx) => val + (k2[idx] * h) / 2);
    const k3 = computeDerivatives(state3, false);

    // Step 4
    const state4 = state.map((val, idx) => val + k3[idx] * h);
    const k4 = computeDerivatives(state4, false);

    // Combine to update state
    for (let i = 0; i < state.length; i++) {
      stateRef.current.state[i] +=
        (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);

      // Apply limits to prevent instability - limit both angles and velocities
      if (i < 3) {
        // Angles (first three values)
        // Keep angles between -10π and 10π
        while (stateRef.current.state[i] > 10 * Math.PI)
          stateRef.current.state[i] -= 2 * Math.PI;
        while (stateRef.current.state[i] < -10 * Math.PI)
          stateRef.current.state[i] += 2 * Math.PI;
      } else {
        // Angular velocities (last three values)
        // Limit angular velocities to reasonable values
        const maxVelocity = 10;
        if (stateRef.current.state[i] > maxVelocity)
          stateRef.current.state[i] = maxVelocity;
        if (stateRef.current.state[i] < -maxVelocity)
          stateRef.current.state[i] = -maxVelocity;
      }
    }

    stateRef.current.time += h;
  };

  // Compute positions of the pendulum bobs based on current angles
  const computePositions = () => {
    const origin = { x: 250, y: 250 };
    const positions = [{ ...origin }]; // Start at the pivot point
    let x = origin.x,
      y = origin.y;

    for (let i = 0; i < 3; i++) {
      const angle = stateRef.current.state[i];
      const length = config.lengths[i];

      x += length * Math.sin(angle);
      y += length * Math.cos(angle);

      positions.push({ x, y });
    }

    return positions.slice(1); // Remove origin point
  };

  // Apply direct forces to the angular velocity
  const applyDirectForce = () => {
    if (keysPressed.ArrowLeft || keysPressed.ArrowRight) {
      const direction = keysPressed.ArrowLeft ? -0.5 : 0.5; // Much gentler force

      // Apply force directly to angular velocity
      const targetIndex = config.forceTarget + 3; // Angular velocities start at index 3
      stateRef.current.state[targetIndex] += direction;

      return true; // Force was applied
    }
    return false; // No force applied
  };

  // Animation loop - simplified with gentler forces
  const animate = () => {
    // Apply direct forces
    const forceApplied = applyDirectForce();
    // Execute the physics step
    rk4Step();

    const newPositions = computePositions();

    // Debug info
    let debugInfo = pendulumState.debugInfo;
    if (forceApplied) {
      const direction = keysPressed.ArrowLeft ? "CLOCKWISE" : "";
      const otherDirection = keysPressed.ArrowRight ? "COUNTER-CLOCKWISE" : "";
      debugInfo = `Rotating Mass ${
        config.forceTarget + 1
      }: ${direction} ${otherDirection}`;
    }

    // Get the angular velocity of the blue mass (first pendulum)
    // Angular velocity is in radians per second, convert to rotations per second
    const angularVelocity = Math.abs(stateRef.current.state[3]) / (2 * Math.PI);

    // Check for win condition - more than 1 rotation per second
    if (angularVelocity > 1) {
      setHasWon(true);
    }

    // For display, round to 2 decimal places
    const displayAngularVelocity = Math.round(angularVelocity * 100) / 100;

    setPendulumState((prev) => ({
      ...prev,
      positions: newPositions,
      simulationTime: stateRef.current.time,
      debugInfo: debugInfo,
      angularVelocity: displayAngularVelocity
    }));

    animationRef.current = requestAnimationFrame(animate);
  };

  // Reset the simulation
  const resetSimulation = () => {
    cancelAnimationFrame(animationRef.current);
    stateRef.current = {
      state: [...config.initialAngles, 0, 0, 0],
      time: 0,
    };

    const newPositions = computePositions();
    setPendulumState({
      positions: newPositions,
      isRunning: true,
      simulationTime: 0,
      debugInfo: "Simulation reset",
      angularVelocity: 0
    });

    setHasWon(false);

    // Restart animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Touch and keyboard handler functions
  const handleTouchStart = (direction) => {
    setKeysPressed((prev) => ({
      ...prev,
      [direction === "left" ? "ArrowLeft" : "ArrowRight"]: true,
    }));

    // Apply a small immediate impulse
    const targetIndex = config.forceTarget + 3; // Angular velocities start at index 3
    const impulse = direction === "left" ? -0.5 : 0.5;
    stateRef.current.state[targetIndex] += impulse;

    setPendulumState((prev) => ({
      ...prev,
      debugInfo: `${direction.toUpperCase()} touch applied to mass ${config.forceTarget + 1}`,
    }));
  };

  const handleTouchEnd = (direction) => {
    setKeysPressed((prev) => ({
      ...prev,
      [direction === "left" ? "ArrowLeft" : "ArrowRight"]: false,
    }));
  };

  // Handle key events and touch inputs for force application
  useEffect(() => {
    // Define key handler functions
    const handleKeyDown = (e) => {
      // Prevent scrolling with arrow keys
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();

        // Apply a small immediate impulse
        if (e.key === "ArrowLeft") {
          const targetIndex = config.forceTarget + 3; // Angular velocities start at index 3
          stateRef.current.state[targetIndex] -= 0.5; // Small impulse
          setPendulumState((prev) => ({
            ...prev,
            debugInfo: `LEFT key applied to mass ${config.forceTarget + 1}`,
          }));
        } else if (e.key === "ArrowRight") {
          const targetIndex = config.forceTarget + 3;
          stateRef.current.state[targetIndex] += 0.5; // Small impulse
          setPendulumState((prev) => ({
            ...prev,
            debugInfo: `RIGHT key applied to mass ${config.forceTarget + 1}`,
          }));
        }

        // Update keysPressed state for continuous force
        setKeysPressed((prev) => ({
          ...prev,
          [e.key]: true,
        }));
      }

      // Number keys to select force target
      if (["1", "2", "3"].includes(e.key)) {
        const newTarget = parseInt(e.key) - 1;
        setConfig((prev) => ({
          ...prev,
          forceTarget: newTarget,
        }));
        setPendulumState((prev) => ({
          ...prev,
          debugInfo: `Selected mass ${newTarget + 1}`,
        }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setKeysPressed((prev) => ({
          ...prev,
          [e.key]: false,
        }));
      }
    };

    // Add key event listeners
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [config.forceTarget]);

  // Start simulation automatically when component loads
  useEffect(() => {
    // Start the simulation immediately
    if (!pendulumState.isRunning) {
      animationRef.current = requestAnimationFrame(animate);
      setPendulumState((prev) => ({ ...prev, isRunning: true }));
    }

    return () => {
      // Cleanup animation on unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Pendulum colors
  const colors = ["#3498db", "#e74c3c", "#2ecc71"];

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Link to="/" className="mb-8 text-arcade-yellow hover:text-arcade-green transition-colors">
        ← Back to Menu
      </Link>

      <h1 className="text-4xl font-arcade mb-4">3 BODY</h1>

      {/*Start */}
      <div className="flex flex-col items-center p-4 rounded-lg">
        <h3 className="text-m mb-4">
          Win by spinning all three planets around the middle
        </h3>

        <div className="relative w-full h-96 bg-white rounded-lg shadow mb-4">

          {/* Progress bar at top */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gray-200 rounded-t-lg">
            <div
              className="h-full bg-blue-500 rounded-tl-lg transition-all duration-300 ease-out"
              style={{
                width: `${Math.min(pendulumState.angularVelocity / 1.0 * 100, 100)}%`,
                opacity: pendulumState.angularVelocity > 0 ? 1 : 0.3
              }}
            ></div>
            <div className="absolute inset-2 flex items-center justify-right text-xs font-semibold text-white">
              Goal: {Math.min(Math.round(pendulumState.angularVelocity / 1.0 * 100), 100)}%
            </div>
          </div>

          {/* Mass selection buttons on left side */}
          <div className="absolute left-2 top-1/3 transform -translate-y-1/2 flex flex-col gap-4 z-10">
            {[0, 1, 2].map((i) => (
              <label
                key={`mass-select-${i}`}
                className="flex items-center cursor-pointer select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                <input
                  type="radio"
                  name="mass-select"
                  checked={config.forceTarget === i}
                  onChange={() => setConfig({ ...config, forceTarget: i })}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    config.forceTarget === i ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: colors[i] }}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <span className="text-white font-bold">{i + 1}</span>
                </div>
              </label>
            ))}
          </div>

          <svg viewBox="0 0 500 700" className="w-full h-full">
            {/* Origin point */}
            <circle cx="250" cy="250" r="4" fill="#333" />

            {/* Pendulum rods */}
            <line
              x1="250"
              y1="250"
              x2={pendulumState.positions[0].x}
              y2={pendulumState.positions[0].y}
              stroke="#666"
              strokeWidth="2"
            />
            <line
              x1={pendulumState.positions[0].x}
              y1={pendulumState.positions[0].y}
              x2={pendulumState.positions[1].x}
              y2={pendulumState.positions[1].y}
              stroke="#666"
              strokeWidth="2"
            />
            <line
              x1={pendulumState.positions[1].x}
              y1={pendulumState.positions[1].y}
              x2={pendulumState.positions[2].x}
              y2={pendulumState.positions[2].y}
              stroke="#666"
              strokeWidth="2"
            />

            {/* Pendulum bobs with rotation indicators */}
            {pendulumState.positions.map((pos, index) => (
              <g key={`bob-${index}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={10 + 5 * config.masses[index]}
                  fill={colors[index]}
                />

                {/* Rotation indicators (curved arrows) */}
                {index === config.forceTarget && (
                  <>
                    {keysPressed.ArrowLeft && (
                      <g>
                        {/* Clockwise rotation indicator */}
                        <path
                          d={`M ${pos.x} ${pos.y - 25} A 20 20 0 0 1 ${pos.x + 20} ${pos.y} L ${pos.x + 15} ${pos.y + 5} L ${pos.x + 25} ${pos.y} L ${pos.x + 20} ${pos.y - 10}`}
                          fill="none"
                          stroke="#ff9900"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                    {keysPressed.ArrowRight && (
                      <g>
                        {/* Counter-clockwise rotation indicator */}
                        <path
                          d={`M ${pos.x} ${pos.y - 25} A 20 20 0 0 0 ${pos.x - 20} ${pos.y} L ${pos.x - 15} ${pos.y + 5} L ${pos.x - 25} ${pos.y} L ${pos.x - 20} ${pos.y - 10}`}
                          fill="none"
                          stroke="#ff9900"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </g>
                    )}

                    {/* Highlight the selected mass */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={15 + 5 * config.masses[index]}
                      fill="none"
                      stroke="#ff9900"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity={0.8}
                    />
                  </>
                )}
              </g>
            ))}

            {/* Win message overlay */}
            {hasWon && (
              <g>
                <rect x="50" y="250" width="400" height="150" rx="15" fill="rgba(0,0,0,0.8)" />
                <text x="250" y="310" textAnchor="middle" fill="#fff" fontSize="36" fontWeight="bold">
                  You Won!
                </text>
              </g>
            )}
          </svg>

          {/* Touch rotation buttons at bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
            <button
              id="rotate-left-button"
              className="w-20 h-20 rounded-full bg-blue-500 text-white text-3xl flex items-center justify-center shadow-lg border-2 border-white select-none rotate-180"
              onContextMenu={(e) => e.preventDefault()}
              onTouchStart={(e) => {
                e.preventDefault();
                const handleStart = () => handleTouchStart('left');
                handleStart();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                const handleEnd = () => handleTouchEnd('left');
                handleEnd();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                const handleDown = () => handleTouchStart('left');
                handleDown();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                const handleUp = () => handleTouchEnd('left');
                handleUp();
              }}
              onMouseLeave={(e) => {
                e.preventDefault();
                const handleLeave = () => handleTouchEnd('left');
                handleLeave();
              }}
            >
              ↻
            </button>

            <button
              id="rotate-right-button"
              className="w-20 h-20 rounded-full bg-blue-500 text-white text-3xl flex items-center justify-center shadow-lg border-2 border-white select-none rotate-180"
              onContextMenu={(e) => e.preventDefault()}
              onTouchStart={(e) => {
                e.preventDefault();
                const handleStart = () => handleTouchStart('right');
                handleStart();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                const handleEnd = () => handleTouchEnd('right');
                handleEnd();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                const handleDown = () => handleTouchStart('right');
                handleDown();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                const handleUp = () => handleTouchEnd('right');
                handleUp();
              }}
              onMouseLeave={(e) => {
                e.preventDefault();
                const handleLeave = () => handleTouchEnd('right');
                handleLeave();
              }}
            >
              ↺
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            onClick={() => setShowControls(!showControls)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showControls ? "Hide Controls" : "Show Controls"}
          </button>
        </div>

        {showControls && (
          <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Configuration</h3>

              <div className="flex flex-col gap-2">
                <div>
                  <label className="block text-sm">Gravity</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.1"
                    value={config.gravity}
                    onChange={(e) =>
                      setConfig({ ...config, gravity: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-right">
                    {config.gravity.toFixed(1)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm">Damping</label>
                  <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    value={config.damping}
                    onChange={(e) =>
                      setConfig({ ...config, damping: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="text-xs text-right">
                    {config.damping.toFixed(2)}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-sm mb-1">Force Controls</h4>

                  <div className="flex items-center mb-2">
                    <label className="block text-sm mr-2">Target Mass:</label>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <button
                          key={`force-target-${i}`}
                          onClick={() => setConfig({ ...config, forceTarget: i })}
                          className={`w-8 h-8 rounded-full text-sm ${
                            config.forceTarget === i
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200"
                          }`}
                          style={
                            config.forceTarget === i
                              ? { backgroundColor: colors[i] }
                              : {}
                          }
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs ml-2">(Press 1,2,3 to select)</div>
                  </div>

                  <div className="flex items-center mb-2 bg-yellow-100 p-2 rounded">
                    <div className="text-xs">
                      <strong>Controls:</strong> Press and hold left/right arrow
                      keys to apply rotation to the selected mass.
                      <br />
                      • Left arrow = Clockwise rotation
                      <br />• Right arrow = Counter-clockwise rotation
                      <br />• Or use the rotation buttons at bottom of screen for touch
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm">Force Magnitude</label>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="50"
                      value={config.forceMagnitude}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          forceMagnitude: parseFloat(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs">
                      <span>Rotation strength</span>
                      <span>{config.forceMagnitude}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetSimulation}
                  className="px-4 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 mt-2"
                >
                  Apply Changes
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Pendulum Properties</h3>

              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={`pendulum-${i}`}
                    style={{ borderLeft: `4px solid ${colors[i]}` }}
                    className="pl-2"
                  >
                    <label className="block text-xs">Length {i + 1}</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={config.lengths[i]}
                      onChange={(e) => {
                        const newLengths = [...config.lengths];
                        newLengths[i] = parseInt(e.target.value);
                        setConfig({ ...config, lengths: newLengths });
                      }}
                      className="w-full"
                    />
                    <div className="text-xs">{config.lengths[i]}</div>

                    <label className="block text-xs mt-1">Mass {i + 1}</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={config.masses[i]}
                      onChange={(e) => {
                        const newMasses = [...config.masses];
                        newMasses[i] = parseFloat(e.target.value);
                        setConfig({ ...config, masses: newMasses });
                      }}
                      className="w-full"
                    />
                    <div className="text-xs">{config.masses[i].toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm hidden">
          <div className="bg-gray-200 p-2 rounded-lg shadow">
            <p>
              Simulation Time: {pendulumState.simulationTime.toFixed(2)}s
              {(keysPressed.ArrowLeft || keysPressed.ArrowRight) &&
                ` | Rotating Mass ${config.forceTarget + 1}: ${
                  keysPressed.ArrowLeft ? "Clockwise" : "Counter-clockwise"
                }`}
            </p>
            <p className="font-bold text-blue-600 mt-1">
              Blue Mass Speed: {pendulumState.angularVelocity} rotations/sec
            </p>
            {pendulumState.debugInfo && (
              <p className="text-xs text-red-500 mt-1">{pendulumState.debugInfo}</p>
            )}
          </div>
        </div>

        {/* Mobile usage hint */}
        <div className="text-xs text-gray-500 mt-2 text-center">
          Use the side buttons to select a mass, and bottom buttons to apply rotation
        </div>
      </div>


    </div>
  );
};

export default ThreeBody;
