import { useState, useEffect, useRef } from "react";
import Head from "./Head";
import Body from "./Body";
import Tail from "./Tail";
import "./index.css";

const getColorsFromURL = () => {
  const params = new URLSearchParams(location.search);
  const colorsParam = params.get("colors");
  return colorsParam ? colorsParam.split(",") : ['#3C3D37', '#ECDFCC', '#697565', '#181C14'];
};

function App() {
  const [lines, setLines] = useState(['']);
  const [uiVisible,] = useState(() => {
    const params = new URLSearchParams(location.search);
    const ui = params.get("ui");
    if (ui && (ui.toLowerCase() == "f" || ui.toLowerCase() == "false")) return false;
    return true;
  });
  const [colors, setColors] = useState(getColorsFromURL());
  const isListenerAdded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedLines = params.get("lines");
    if (encodedLines) {
      const newLines = decodeURIComponent(encodedLines).split("|");
      setLines(newLines);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location);
    const encodedLines = encodeURIComponent(lines.join("|"));
    url.searchParams.set("lines", encodedLines);
    window.history.replaceState(null, "", url);
    if (lines.length > 0 && !isListenerAdded.current) {
      window.addEventListener('keydown', handleKeys);
      isListenerAdded.current = true;
    }
    return () => {
      window.removeEventListener('keydown', handleKeys);
      isListenerAdded.current = false;
    }
  }, [lines]);

  useEffect(() => {
    document.body.style.backgroundColor = colors[3];
  }, [colors])

  const handleKeys = (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      const fileName = prompt("Enter file name", "note");
      if (fileName) {

        const fileBlob = new Blob([lines.join("\n")], { type: 'text/plain' });
        const fileURL = URL.createObjectURL(fileBlob);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = fileName + ".md";
        a.click();
        URL.revokeObjectURL(fileURL);  // Clean up
      }
    }
  };
  const wordCount = lines.reduce((count, line) => count + line.split(/\s+/).filter(Boolean).length, 0);
  const characterCount = lines.reduce((count, line) => count + line.length, 0);
  return (
    <>
      {uiVisible && <Head setLines={setLines} colors={colors} />}
      <Body lines={lines} setLines={setLines} colors={colors} />
      {uiVisible && <Tail colors={colors} setColors={setColors} words={wordCount} chars={characterCount} />}
    </>
  );
}
export default App;