
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DocumentProvider } from "@/contexts/DocumentContext";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <DocumentProvider>
      <App />
    </DocumentProvider>
  </React.StrictMode>
);
