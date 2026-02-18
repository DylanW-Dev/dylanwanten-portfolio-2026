import screenshotIMG from "../assets/screenshot.png";

export const sections = {
    info: {
        label: "Personal Info",
        sub: "Contact & Bio",
        content: {
            name: "Your Name",
            role: "React Front-End Developer",
            email: "your.email@example.com",
            location: "Brussels, Belgium",
            bio:
                "I build clean, interactive interfaces with React. I care about usability, accessibility, and UI polish.",
        },
    },

    education: {
        label: "Education",
        sub: "Training & Background",
        content: {
            items: [
                { title: "Meta Front-End Developer Professional Certificate", meta: "Coursera • 2025" },
                { title: "Your Degree / School", meta: "2020 – 2022" },
            ],
        },
    },

    skills: {
        label: "Skills",
        sub: "Click to explore",
        content: {
            technical: [
                "React",
                "JavaScript",
                "TypeScript",
                "Hooks",
                "Context API",
                "React Router",
                "APIs",
                "Forms & Validation",
                "Accessibility",
                "Testing (RTL/Jest)",
                "Tailwind / CSS",
                "Git",
            ],
            soft: ["Communication", "Collaboration", "Problem Solving", "Adaptability"],
        },
    },

    work: {
        label: "Work Experience",
        sub: "Projects & Roles",
        content: {
            items: [
                {
                    title: "Front-End Developer",
                    meta: "Company • 2024 – Present",
                    bullets: [
                        "Built responsive UI components and reusable patterns.",
                        "Integrated APIs with loading/error states and caching strategies.",
                        "Collaborated with designers to ship polished UI quickly.",
                    ],
                },
            ],
        },
    },
};

export const certificates = [
    {
        title: "Meta Front-End Developer Professional Certificate",
        issuer: "Coursera / Meta",
        image: screenshotIMG,
        link: "#",
    },
    {
        title: "Advanced React",
        issuer: "Coursera / Meta",
        image: "/certificate-placeholder.png",
        link: "#",
    },
    {
        title: "Version Control",
        issuer: "Coursera / Meta",
        image: "/certificate-placeholder.png",
        link: "#",
    },
];

export const socials = [
    { label: "LinkedIn", href: "#", icon: "in" },
    { label: "GitHub", href: "#", icon: "gh" },
    { label: "Portfolio", href: "#", icon: "↗" },
    { label: "Email", href: "mailto:your.email@example.com", icon: "@" },
];
