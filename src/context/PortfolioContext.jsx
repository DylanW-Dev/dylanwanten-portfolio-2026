import { createContext, useContext, useMemo, useState } from "react";

const PortfolioContext = createContext(null);

export function usePortfolio() {
    const ctx = useContext(PortfolioContext);
    if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
    return ctx;
}

export default function PortfolioProvider({ children }) {
    const [mode, setMode] = useState("developer"); // 'developer' | 'recruiter'
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);

    const toggleSkill = (skill) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const clearSkills = () => setSelectedSkills([]);

    const value = useMemo(
        () => ({
            mode,
            setMode,
            selectedSkills,
            toggleSkill,
            clearSkills,
            isFlipped,
            setIsFlipped,
        }),
        [mode, selectedSkills, isFlipped]
    );

    return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
