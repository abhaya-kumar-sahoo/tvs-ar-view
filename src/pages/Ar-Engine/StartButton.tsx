// createARButton.js
export default function createARButton(renderer, sessionInit = {}) {
  // Merge default sessionInit with provided options
  const defaultSessionInit = {
    requiredFeatures: sessionInit.requiredFeatures || [],
    optionalFeatures: sessionInit.optionalFeatures || [],
  };
  if (!defaultSessionInit.requiredFeatures.includes("hit-test")) {
    defaultSessionInit.requiredFeatures.push("hit-test");
  }

  // Create button
  const button = document.createElement("button");
  button.id = "ARButton";
  button.textContent = "Start AR";

  // Styling (colorful animated gradient)
  button.style.position = "absolute";
  button.style.bottom = "50%"; // Centered vertically, as in your code
  button.style.left = "50%";
  button.style.transform = "translateX(-50%)";
  button.style.padding = "12px 24px";
  button.style.border = "1px solid #ffffff"; // White border for contrast
  button.style.borderRadius = "8px";
  button.style.background =
    "linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ff00ff)"; // Initial gradient
  button.style.backgroundSize = "400%"; // Large size for smooth animation
  button.style.color = "#ffffff";
  button.style.font = "normal 16px sans-serif";
  button.style.textAlign = "center";
  button.style.cursor = "pointer";
  button.style.opacity = "0.8";
  button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  button.style.zIndex = "999";
  button.style.display = "";

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      #ARButton {
        animation: gradientShift 10s ease infinite;
      }
    `;
  document.head.appendChild(style);

  // Hover effects
  button.onmouseenter = () => {
    button.style.opacity = "1.0";
    button.style.transform = "translateX(-50%) scale(1.05)"; // Slight scale for emphasis
  };
  button.onmouseleave = () => {
    button.style.opacity = "0.8";
    button.style.transform = "translateX(-50%)";
  };

  // DOM overlay for exit button
  let overlay = null;
  if (!sessionInit.domOverlay) {
    overlay = document.createElement("div");
    overlay.style.display = "none";
    document.body.appendChild(overlay);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "38");
    svg.setAttribute("height", "38");
    svg.style.position = "absolute";
    svg.style.right = "20px";
    svg.style.top = "20px";
    overlay.appendChild(svg);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 12,12 L 28,28 M 28,12 12,28");
    path.setAttribute("stroke", "#fff");
    path.setAttribute("stroke-width", 2);
    svg.appendChild(path);

    defaultSessionInit.optionalFeatures.push("dom-overlay");
    defaultSessionInit.domOverlay = { root: overlay };
  }

  let currentSession = null;

  // Start AR session
  async function onSessionStarted(session) {
    session.addEventListener("end", onSessionEnded);

    renderer.xr.setReferenceSpaceType("local");
    await renderer.xr.setSession(session);

    button.textContent = "Stop AR";
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
    if (defaultSessionInit.domOverlay) {
      defaultSessionInit.domOverlay.root.style.display = "";
    }

    currentSession = session;
  }

  // End AR session
  function onSessionEnded() {
    currentSession.removeEventListener("end", onSessionEnded);

    button.textContent = "Start AR";
    button.style.opacity = "0.8";
    button.style.cursor = "pointer";
    if (defaultSessionInit.domOverlay) {
      defaultSessionInit.domOverlay.root.style.display = "none";
    }

    currentSession = null;
    window.location.href = "/";

    // window.location.reload();
  }

  // Disable button for errors
  function disableButton(message) {
    button.textContent = message;
    button.style.opacity = "0.5";
    button.style.cursor = "auto";
    button.style.background = "#ff4444"; // Red for error
    button.style.animation = "none"; // Stop animation on error
    button.onmouseenter = null;
    button.onmouseleave = null;
    button.onclick = null;
  }

  // Button click handler
  button.onclick = async () => {
    if (currentSession === null) {
      try {
        const session = await navigator.xr.requestSession(
          "immersive-ar",
          defaultSessionInit
        );
        await onSessionStarted(session);
      } catch (error) {
        console.warn("Failed to start AR session:", error);
        // disableButton("AR Failed");
        setTimeout(() => {
          button.textContent = "Start AR";
          button.style.background =
            "linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ff00ff)";
          button.style.backgroundSize = "400%";
          button.style.animation = "gradientShift 10s ease infinite";
          button.style.opacity = "0.8";
          button.style.cursor = "pointer";
          button.onclick = button.onclick; // Restore click handler
        }, 2000);
      }
    } else {
      currentSession.end();
    }
  };

  // Check WebXR support
  if ("xr" in navigator) {
    navigator.xr
      .isSessionSupported("immersive-ar")
      .then((supported) => {
        if (!supported) {
          disableButton("AR Not Supported");
        }
      })
      .catch((error) => {
        console.warn("Error checking AR support:", error);
        disableButton("AR Not Allowed");
      });
  } else {
    disableButton(
      window.isSecureContext ? "WebXR Not Available" : "WebXR Needs HTTPS"
    );
  }

  // Add exit button functionality to SVG
  if (overlay) {
    overlay.querySelector("svg").addEventListener("click", () => {
      if (currentSession) {
        currentSession.end();
      }
    });
  }

  return button;
}
