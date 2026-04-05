import { useEffect, useRef, useState } from "react";

export default function AnimatedText({
  text,
  element: Tag = "h1",
  style = {},
  delay = 0,
  stagger = 80,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} style={{ ...style, overflow: "hidden" }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: `opacity 0.6s ease ${delay + i * stagger}ms, transform 0.6s ease ${delay + i * stagger}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}