import { useState, useEffect, useRef } from "react";
import Head from "./Head";
import Body from "./Body";
import Tail from "./Tail";
import "./index.css";

const getColorsFromURL = () => {
  const params = new URLSearchParams(location.search);
  const colorsParam = params.get("colors");
  return colorsParam ? colorsParam.split(",") : ['#3C3D37', '#ECDFCC', '#697565', '#ECDFCC'];
};

function App() {
  const [lines, setLines] = useState(['']);
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
      window.addEventListener('keydown', handleSave);
      isListenerAdded.current = true;
    }
    return () => {
      window.removeEventListener('keydown', handleSave);
      isListenerAdded.current = false;
    }
  }, [lines]);

  const handleSave = (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      const fileName = prompt("Enter file name", "data.md");
      if (fileName) {

        const fileBlob = new Blob([lines.join("\n")], { type: 'text/plain' });
        const fileURL = URL.createObjectURL(fileBlob);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(fileURL);  // Clean up
      }
    }
  };
  const wordCount = lines.reduce((count, line) => count + line.split(/\s+/).filter(Boolean).length, 0);
  const characterCount = lines.reduce((count, line) => count + line.length, 0);
  console.log(wordCount, characterCount)
  return (
    <>
      <Head setLines={setLines} colors={colors} />
      <Body lines={lines} setLines={setLines} colors={colors} />
      <Tail colors={colors} setColors={setColors} words={wordCount} chars={characterCount} />
    </>
  );
}
export default App;