import { Box } from "@mui/material";

const DiagramView = ({
  renderedSvg,
  zoomLevel,
  isRotated,
  isMobile,
}) => (
  <Box
    sx={{
      transform: isRotated ? "rotate(90deg)" : "none",
      transformOrigin: "center center",
      transition: "transform 0.3s ease",
      width: isRotated ? "90vh" : "100%",
      height: isRotated ? "90vw" : "auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? 1 : 2,
    }}
  >
    <Box
      sx={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: "center center",
        transition: "transform 0.2s ease",
        bgcolor: "background.paper",
        borderRadius: "12px",
        padding: isMobile ? "15px" : "25px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        maxWidth: isRotated ? "90vh" : "95%",
        width: "100%",
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
      }}
      dangerouslySetInnerHTML={{ __html: renderedSvg }}
    />
  </Box>
);

// Static method for error state rendering
DiagramView.renderErrorState = (container, options) => {
  const {
    isMobile,
    onManualRegenerate,
    remainingGenerations,
    handleManualRegenerate,
    setZoomOpen,
  } = options;

  const canRetry = onManualRegenerate && remainingGenerations > 0;

  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    padding: 40px 20px;
    text-align: center;
    color: #666;
    border: 2px dashed #ff9800;
    border-radius: 8px;
    background: #fff3e0;
    cursor: pointer;
    min-height: ${isMobile ? "300px" : "200px"};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: ${isMobile ? "16px" : "14px"};
  `;

  errorDiv.innerHTML = `
    <div style="font-size: ${
      isMobile ? "64px" : "48px"
    }; margin-bottom: 16px;">📊</div>
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #f57c00; font-size: ${
      isMobile ? "18px" : "16px"
    };">Diagram Display Issue</p>
    <p style="margin: 0 0 15px 0; text-align: center; font-size: ${
      isMobile ? "16px" : "14px"
    };">This mindmap cannot be rendered properly</p>
    ${
      canRetry
        ? `
      <button style="
        background: #1976d2;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-size: ${isMobile ? "16px" : "14px"};
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        Regenerate Mindmap
      </button>
    `
        : `
      <div style="display: inline-flex; align-items: center; gap: 5px; color: #1976d2; font-size: ${
        isMobile ? "16px" : "14px"
      }; font-weight: 500;">
        <svg width="${isMobile ? "20" : "16"}" height="${
            isMobile ? "20" : "16"
          }" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        View Diagram Code
      </div>
    `
    }
  `;

  if (canRetry) {
    const retryButton = errorDiv.querySelector("button");
    retryButton.onclick = (e) => {
      e.stopPropagation();
      handleManualRegenerate();
    };
  }

  errorDiv.onclick = () => setZoomOpen(true);
  container.appendChild(errorDiv);
};

export default DiagramView;
