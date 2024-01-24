import "tailwindcss/tailwind.css";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup } from "./dojo/setup";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { GameProvider } from "./hooks/GameContext.tsx";
import { dojoConfig } from "./dojo/dojoConfig";

async function init() {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("React root not found");
    const root = ReactDOM.createRoot(rootElement as HTMLElement);

    // const setupResult = await setup();
    const setupResult = await setup(dojoConfig());
    root.render(
        <React.StrictMode>
            <DojoProvider value={setupResult}>
                <GameProvider>
                    <App />
                </GameProvider>
            </DojoProvider>
        </React.StrictMode>
    );
}

init();
