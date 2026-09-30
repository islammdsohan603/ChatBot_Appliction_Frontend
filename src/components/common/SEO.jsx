import { useEffect } from "react";

/**
 * SEO helper component to dynamically update document title and meta tags.
 */
export const SEO = ({
  title,
  description = "Nexora AI is an advanced, multimodal real-time AI chatbot application with live streaming, conversation history, and secure encryption.",
  keywords = "AI chatbot, Nexora AI, Gemini Flash, real-time messaging, multimodal AI, WebSocket, React",
}) => {
  useEffect(() => {
    document.title = title ? `${title} | Nexora AI` : "Nexora AI — Real-Time AI Chatbot";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;
  }, [title, description, keywords]);

  return null;
};

export default SEO;
