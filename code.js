figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "scan") {
    let results = [];

    // Get all text layers
    const textNodes = figma.currentPage.findAll((node) => node.type === "TEXT");

    textNodes.forEach((node) => {
      const textSize = node.fontSize;
      const fills = node.fills;

      // Extract color
      if (fills.length > 0 && fills[0].type === "SOLID") {
        const rgb = fills[0].color;
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
        const contrast = luminance > 0.5 ? "Low Contrast" : "Good Contrast";

        results.push({
          name: node.name || "Unnamed Text",
          fontSize: textSize,
          contrast: contrast,
        });
      }
    });

    figma.ui.postMessage({ type: "results", data: results });
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};

const BASE_URL = "https://uki-ai-backend.vercel.app"; // Update with your actual backend URL

export async function fetchAuditResults(data) {
    try {
        const response = await fetch(`${BASE_URL}/audit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching audit results:", error);
    }
}
