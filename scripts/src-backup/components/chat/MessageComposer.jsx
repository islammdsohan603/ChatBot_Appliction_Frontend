/**
 * MessageComposer — ChatGPT-style bottom input bar for composing and sending messages.
 * Re-exports / wraps ChatInput for seamless drop-in compatibility.
 */
import ChatInput from "./ChatInput";

const MessageComposer = (props) => {
  return <ChatInput {...props} />;
};

export default MessageComposer;
