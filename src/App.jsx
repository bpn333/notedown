import { useState, useEffect, useCallback } from "react";
import Head from "./Head";
import Body from "./Body";
import Tail from "./Tail";
import Inventory from "./Inventory";
import "./index.css";

const getColorsFromURL = () => {
  const params = new URLSearchParams(location.search);
  const colorsParam = params.get("colors");
  return colorsParam ? colorsParam.split(",") : ['#3C3D37', '#ECDFCC', '#697565', '#181C14'];
};

function App() {
  const [lines, setLines] = useState(['']);
  const [uiVisible, setUiVisible] = useState(() => {
    const params = new URLSearchParams(location.search);
    const ui = params.get("ui");
    if (ui && (ui.toLowerCase() == "f" || ui.toLowerCase() == "false")) return false;
    return true;
  });
  const [colors, setColors] = useState(getColorsFromURL());
  const [inventoryVisible, setInventoryVisible] = useState(false);
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
  }, [lines]);

  useEffect(() => {
    document.body.style.backgroundColor = colors[3];
  }, [colors])

  const handleKeys = useCallback((event) => {
    if (event.key === "Escape" && inventoryVisible) {
      setInventoryVisible(false);
      return;
    }
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
    if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey && !["INPUT", "TEXTAREA"].includes(event.target.tagName)) {
      if (event.key.toLowerCase() === "f") {
        const nextVisible = !uiVisible;
        const url = new URL(window.location);
        if (nextVisible) url.searchParams.delete("ui");
        else url.searchParams.set("ui", "f");
        window.history.pushState({}, "", url);
        setUiVisible(nextVisible);
      }
      if (event.key.toLowerCase() === "i") {
        setInventoryVisible((visible) => !visible);
      }
    }
  }, [inventoryVisible, lines, uiVisible]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [handleKeys]);

  const wordCount = lines.reduce((count, line) => count + line.split(/\s+/).filter(Boolean).length, 0);
  const characterCount = lines.reduce((count, line) => count + line.length, 0);
  return (
    <>
      {uiVisible && <Head setLines={setLines} colors={colors} />}
      <Body lines={lines} setLines={setLines} colors={colors} />
      {uiVisible && <Tail colors={colors} setColors={setColors} words={wordCount} chars={characterCount} />}
      {inventoryVisible && <Inventory colors={colors} onClose={() => setInventoryVisible(false)} />}
    </>
  );
}
export default App;