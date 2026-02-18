import { socials } from "../data/section";

export default function SocialNav({ visible }) {
    if (!visible) return null;

    return (
        <div
            className="anim-fadeUp"
            style={{
                position: "fixed",
                top: 18,
                left: 18,
                zIndex: 130,
                padding: 10,
                borderRadius: 16,
                background: "rgba(2,6,23,0.55)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
                display: "flex",
                gap: 8,
                alignItems: "center",
            }}
            aria-label="Social links"
        >
            <div
                style={{
                    fontSize: 12,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: "rgba(199,210,254,0.95)",
                    marginRight: 6,
                }}
            >
                Connect
            </div>

            {socials.map((s) => (
                <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "rgba(226,232,240,0.92)",
                        fontWeight: 700,
                        fontSize: 13,
                    }}
                    title={s.label}
                >
                    <span
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: 8,
                            display: "grid",
                            placeItems: "center",
                            background: "linear-gradient(135deg, rgba(99,102,241,0.55), rgba(167,139,250,0.22))",
                            border: "1px solid rgba(99,102,241,0.35)",
                            fontSize: 12,
                            color: "#fff",
                        }}
                    >
                        {s.icon}
                    </span>
                    <span style={{ opacity: 0.95 }}>{s.label}</span>
                </a>
            ))}
        </div>
    );
}
