import { useState, useRef, useCallback, useEffect } from "react";

const DEFAULT_SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:8000";

/**
 * Custom hook for real-time streaming AI chat using Server-Sent Events (SSE)
 * with MongoDB conversation session persistence and Google Gemini (@google/genai).
 */
export const useAiChat = ({
  conversationId = null,
  systemInstruction = "You are Nexora AI, a brilliant, helpful, and concise AI assistant.",
  model = "gemini-2.0-flash",
  onSessionCreated,
  onConversationUpdated,
  onError,
  onFinish,
} = {}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // { file, previewUrl, base64 }
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const activeSessionIdRef = useRef(conversationId);

  // Load chat history from database when conversationId changes
  useEffect(() => {
    let isMounted = true;

    if (!conversationId || conversationId === "new") {
      setMessages([]);
      setIsHistoryLoading(false);
      setError(null);
      activeSessionIdRef.current = null;
      return;
    }

    // If conversationId was set by the active streaming session, do not re-fetch and overwrite active stream
    if (conversationId === activeSessionIdRef.current) {
      return;
    }

    activeSessionIdRef.current = conversationId;

    const fetchConversationMessages = async () => {
      setIsHistoryLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${DEFAULT_SERVER_URL}/api/conversations/${conversationId}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Conversation not found");
          }
          throw new Error("Failed to load conversation history");
        }

        const data = await response.json();
        if (isMounted && data.messages) {
          const formatted = data.messages.map((m) => ({
            id: m._id,
            role: m.role,
            content: m.content,
            imageUrl: m.imageUrl,
            createdAt: m.createdAt,
          }));
          setMessages(formatted);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Load conversation error:", err);
          setError(err.message || "Failed to load conversation");
        }
      } finally {
        if (isMounted) {
          setIsHistoryLoading(false);
        }
      }
    };

    fetchConversationMessages();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Cleanup image preview on unmount or when image changes
  useEffect(() => {
    return () => {
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl);
      }
    };
  }, [selectedImage]);

  /**
   * Stop current streaming generation
   */
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  /**
   * Send a prompt and optional image, streaming the AI response
   */
  const sendMessage = useCallback(
    async (promptOverride, imageOverride) => {
      const promptText = (promptOverride !== undefined ? promptOverride : input).trim();
      const imagePayload = imageOverride !== undefined ? imageOverride : selectedImage;

      if ((!promptText && !imagePayload) || isLoading || isStreaming) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setError(null);
      setIsLoading(true);
      setIsStreaming(false);

      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: promptText,
        imageUrl: imagePayload?.base64 || imagePayload?.previewUrl || null,
        createdAt: new Date().toISOString(),
      };

      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantPlaceholder = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };

      // Clear input and attachments
      setInput("");
      setSelectedImage(null);
      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

      try {
        // Retrieve custom user API key from localStorage if set
        const customApiKey =
          localStorage.getItem("nexora_google_api_key") ||
          (() => {
            try {
              const settings = JSON.parse(localStorage.getItem("nexora_user_settings") || "{}");
              return settings.googleApiKey;
            } catch {
              return null;
            }
          })();

        const headers = {
          "Content-Type": "application/json",
        };
        if (customApiKey) {
          headers["x-goog-api-key"] = customApiKey;
        }

        const effectiveModel = model === "gemini-3.8-flash" || model === "gemini-2.5-flash" ? "gemini-2.0-flash" : model || "gemini-2.0-flash";

        const response = await fetch(`${DEFAULT_SERVER_URL}/api/conversations/stream`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            conversationId: conversationId && conversationId !== "new" ? conversationId : undefined,
            prompt: promptText,
            imageUrl: imagePayload?.base64 || null,
            systemInstruction,
            model: effectiveModel,
            apiKey: customApiKey || undefined,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("ReadableStream not supported by response.");
        }

        setIsLoading(false);
        setIsStreaming(true);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;

            const dataContent = trimmed.replace(/^data:\s*/, "");
            if (dataContent === "[DONE]") {
              break;
            }

            let parsed = null;
            try {
              parsed = JSON.parse(dataContent);
            } catch (jsonErr) {
              if (jsonErr.message && jsonErr.message !== "Unexpected end of JSON input") {
                console.warn("SSE parse error:", jsonErr.message);
              }
              continue;
            }

            if (parsed) {
              if (parsed.type === "session_created" && parsed.conversation) {
                // Instantly update parent/sidebar and URL without wiping streaming state
                activeSessionIdRef.current = parsed.conversation._id;
                onSessionCreated?.(parsed.conversation);
              }

              if (parsed.error) {
                const streamErrMsg =
                  typeof parsed.error === "string"
                    ? parsed.error
                    : parsed.error.message || "AI generation failed";
                throw new Error(streamErrMsg);
              }

              if (parsed.text) {
                accumulatedContent += parsed.text;
                const currentText = accumulatedContent;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: currentText, isStreaming: true }
                      : msg
                  )
                );
              }
            }
          }
        }

        // Finalize assistant message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent, isStreaming: false }
              : msg
          )
        );

        onConversationUpdated?.(accumulatedContent);
        onFinish?.({
          id: assistantMessageId,
          role: "assistant",
          content: accumulatedContent,
        });
      } catch (err) {
        if (err.name === "AbortError") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          return;
        }

        console.error("AI Chat stream error:", err);
        const errMsg = err.message || "Something went wrong while generating response.";
        setError(errMsg);
        onError?.(err);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: accumulatedContent
                    ? `${msg.content}\n\n*[Generation stopped due to error: ${errMsg}]*`
                    : `⚠️ Error: ${errMsg}`,
                  isStreaming: false,
                  hasError: true,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [
      conversationId,
      input,
      selectedImage,
      isLoading,
      isStreaming,
      model,
      systemInstruction,
      onSessionCreated,
      onConversationUpdated,
      onError,
      onFinish,
    ]
  );

  return {
    messages,
    input,
    setInput,
    selectedImage,
    setSelectedImage,
    sendMessage,
    stop,
    isLoading,
    isStreaming,
    isHistoryLoading,
    error,
    setMessages,
  };
};

export default useAiChat;
