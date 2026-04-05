import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    // Hide on mobile
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    const glow = glowRef.current;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    };

    const animateGlow = () => {
      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.08;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.08;
      glow.style.transform = `translate(${glowPos.current.x - 200}px, ${glowPos.current.y - 200}px)`;
      raf.current = requestAnimationFrame(animateGlow);
    };

    const onEnterLink = () => {
      cursor.style.transform += " scale(2.5)";
      cursor.style.background = "#00f5a0";
    };

    const onLeaveLink = () => {
      cursor.style.background = "#00f5a0";
    };

    document.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animateGlow);

    const links = document.querySelectorAll("a, button");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <>
      {/* Small sharp dot */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#00f5a0",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "transform 0.08s ease, background 0.2s",
          mixBlendMode: "difference",
        }}
      />

      {/* Spotlight glow */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,245,160,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 99998,
          transition: "none",
        }}
      />
    </>
  );
}