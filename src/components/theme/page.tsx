import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"
import { Tooltip } from "@nextui-org/react";
export default function ThemeSwitcher() {
    const [theme, setTheme] = useState(() =>
        typeof window !== "undefined" && window.localStorage.getItem("theme") === "dark"
            ? "dark"
            : "light"
    );
    // const [theme, setTheme] = useState(() => {
    //     if (typeof window !== "undefined") {
    //         const storedTheme = localStorage.getItem("theme");
    //         if (storedTheme) return storedTheme;
    //         return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    //     }
    //     return "light";
    // });


    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    return (
        <Tooltip content={theme === "dark" ? "ธีมสว่าง" : "ธีมมืด"}>
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full  dark:bg-gray-800  dark:hover:bg-gray-700 transition"
        >
            {theme === "dark" ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
        </button>
    </Tooltip>

    );
}
