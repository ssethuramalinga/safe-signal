import { useEffect, useRef } from "react";

export function useShakeDetector({ enabled, sensitivity, onShake }: { 
  enabled: boolean; 
  sensitivity: number; 
  onShake: () => void; 
}) {
  // Store the callback in a ref so the effect doesn't need to depend on it
  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;

  const last = useRef({ x: 0, y: 0, z: 0, coolDown: 0 });

  useEffect(() => {
    if (!enabled) return;
    
    let subscription: any;
    try {
      const { Accelerometer } = require("expo-sensors");
      const threshold = 2.6 - (Math.max(0.5, Math.min(3.0, sensitivity)) * 0.55);

      subscription = Accelerometer.addListener((data: any) => {
        const now = Date.now();
        if (now < last.current.coolDown) return;

        const delta = Math.abs(data.x - last.current.x) + 
                      Math.abs(data.y - last.current.y) + 
                      Math.abs(data.z - last.current.z);

        last.current = { ...data, coolDown: last.current.coolDown };

        if (delta > threshold) {
          last.current.coolDown = now + 1000; // 1s cooldown
          onShakeRef.current?.();
        }
      });
    } catch (e) { console.error(e); }

    return () => subscription?.remove();
  }, [enabled, sensitivity]); // Stable dependencies
}