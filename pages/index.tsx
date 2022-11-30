import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import buildspaceLogo from "../assets/buildspace-logo.png";

const Home = () => {
  const [copyDone, setCopyDone] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("english");

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    if (!userInput) {
      alert("Please enter a name");
      return;
    }

    setCopyDone(false);
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, language }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const onLanguageChange = (event) => {
    console.log(event.target.value);
    setLanguage(event.target.value);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiOutput);
      console.log("Content copied to clipboard");
      setCopyDone(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="root">
      <Head>
        <title>
          Guest Review Generator | Create unique reviews for your guests
        </title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Guest Review Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Create unique reviews for your guests</h2>
          </div>
        </div>
        <div className="prompt-container">
          <div className="prompt-line">
            <div className="prompt-start">Review for</div>
            <input
              placeholder="guests name"
              className="prompt-box"
              value={userInput}
              onChange={onUserChangedText}
            />
            in
            <select
              onChange={onLanguageChange}
              value={language}
              className="select-box"
            >
              <option value="english">🇬🇧 english</option>
              <option value="german">🇩🇪 deutsch</option>
              <option value="spanish">🇪🇸 spanish</option>
              <option value="french">🇫🇷 french</option>
              <option value="chinese">🇨🇳 chinese</option>
              <option value="hindi">🇮🇳 hindi</option>
              <option value="russian">🇨🇷 russian</option>
              <option value="portuguese">🇨🇵 portuguese</option>
            </select>
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
          {/* New code I added here */}
          <div className="prompt-buttons"></div>
        </div>

        {!isGenerating && apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Review</h3>
              </div>
            </div>

            <div className="output-content">
              <p>{apiOutput}</p>
            </div>

            <a
              className="generate-button clipboard-button"
              onClick={copyToClipboard}
            >
              <div className="generate">
                {copyDone ? (
                  <span>
                    Done <span className="done-icon">✅</span>
                  </span>
                ) : (
                  "Copy to 📋"
                )}
              </div>
            </a>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
