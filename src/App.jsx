import React, { useState, useEffect } from "react";
import EvmDashboard from "./evm-dashboard";
import WorkforceDashboard from "./hr";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    // Listen to pushState/replaceState calls
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  const navigateTo = (newPath) => {
    window.history.pushState({}, "", newPath);
  };

  return (
    <div style={{ background: "#0B1220", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Premium Top Navigation Bar */}
      <nav style={{
        background: "#111A2B",
        borderBottom: "1px solid #22304A",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 100,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      }}>
        {/* Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "linear-gradient(135deg, #3ED598, #818CF8)",
            width: 32,
            height: 32,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 12px rgba(62, 213, 152, 0.4)",
            fontWeight: "bold",
            color: "#0B1220",
            fontSize: 14,
            letterSpacing: "-0.5px"
          }}>
            BL
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#E7ECF5" }}>My dashboard</div>
            <div style={{ fontSize: 9, color: "#8A9AB5", letterSpacing: "0.05em" }}></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 6, background: "#0B1220", borderRadius: 8, padding: 3, border: "1px solid #22304A" }}>
          <button
            onClick={() => navigateTo("/")}
            style={{
              border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 6,
              fontSize: 12, fontWeight: 600, fontFamily: "system-ui, sans-serif",
              background: (path !== "/hr" && path !== "/hr/") ? "#2E3F5C" : "transparent",
              color: (path !== "/hr" && path !== "/hr/") ? "#E7ECF5" : "#8A9AB5",
              transition: "all 0.15s",
            }}
          >
            Project EVM S-Curve
          </button>
          <button
            onClick={() => navigateTo("/hr")}
            style={{
              border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 6,
              fontSize: 12, fontWeight: 600, fontFamily: "system-ui, sans-serif",
              background: (path === "/hr" || path === "/hr/") ? "#2E3F5C" : "transparent",
              color: (path === "/hr" || path === "/hr/") ? "#E7ECF5" : "#8A9AB5",
              transition: "all 0.15s",
            }}
          >
            Workforce Analytics
          </button>
        </div>
      </nav>

      {/* Main dashboard content view */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {path === "/hr" || path === "/hr/" ? <WorkforceDashboard /> : <EvmDashboard />}
      </div>
    </div>
  );
}

export default App;


