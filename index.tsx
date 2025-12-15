import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to mount React application:", error);
  // Fallback UI for fatal errors to prevent white screen of death
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; text-align: center;">
      <h1>Application Failed to Start</h1>
      <p>Please check the console for more details.</p>
      <pre style="text-align: left; background: #f0f0f0; padding: 10px; overflow: auto;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}