import { useState, useEffect, useRef } from "react";

export function useCountUp(end, duration = 2000, suffix = "") {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    // Handle non-numeric like "10x", "99%", "500+"
    const numericEnd = parseFloat(end);
    if (isNaN(numericEnd)) {
      setCount(end);
      return;
    }

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setCount(Math.floor(eased * numericEnd));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(numericEnd);
    };

    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}