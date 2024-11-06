/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import run from "../config/gemini";

// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;

    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }

    // Step 1: Format Bold Text
    let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Step 2: Format Code Blocks (detect ``` and replace with <pre><code>)
    formattedResponse = formattedResponse.replace(
      /```([\s\S]*?)```/g,
      "<pre><code>$1</code></pre>"
    );

    // Step 3: Add Line Breaks
    formattedResponse = formattedResponse.replace(/\*/g, "<br/>");

    // Step 4: Split words to display gradually
    const formattedResponseArray = formattedResponse.split(" ");
    formattedResponseArray.forEach((word, index) => {
      delayPara(index, word + " ");
    });

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
