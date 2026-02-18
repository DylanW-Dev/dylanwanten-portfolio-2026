import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export default function ModalPortal({ children }) {
    const [mounted, setMounted] = useState(false);

    const el = useMemo(() => {
        const div = document.createElement("div");
        div.setAttribute("data-portal", "modal");
        return div;
    }, []);

    useEffect(() => {
        document.body.appendChild(el);
        setMounted(true);
        return () => {
            try {
                document.body.removeChild(el);
            } catch (_) { }
        };
    }, [el]);

    if (!mounted) return null;
    return createPortal(children, el);
}
