import { useEffect, useState } from "react";

export default function useTilt(ref) {
    const [style, setStyle] = useState({});

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            setStyle({
                transform: `rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`,
            });
        };

        const reset = () => {
            setStyle({ transform: "rotateX(0deg) rotateY(0deg)" });
        };

        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", reset);

        return () => {
            el.removeEventListener("mousemove", handleMove);
            el.removeEventListener("mouseleave", reset);
        };
    }, [ref]);

    return style;
}
