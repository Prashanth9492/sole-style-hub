import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Filter out Razorpay's biometric fingerprinting CORS errors (these are expected and harmless)
const originalError = console.error;
console.error = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  
  // Suppress Razorpay loader CORS warnings (these are intentional security checks)
  if (
    message.includes('loader.min.js') ||
    message.includes('loopback') ||
    message.includes('ERR_CONNECTION_REFUSED') ||
    message.includes('ERR_FAILED') ||
    (message.includes('CORS') && message.includes('api.razorpay.com')) ||
    (message.includes('localhost') && message.includes('.png'))
  ) {
    return;
  }
  
  originalError.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
