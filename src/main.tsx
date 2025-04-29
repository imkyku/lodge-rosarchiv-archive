import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DocumentProvider } from "@/components/DocumentContext";

createRoot(document.getElementById("root")!).render(<App />);
root.render(
    <React.StrictMode>
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </React.StrictMode>
  );