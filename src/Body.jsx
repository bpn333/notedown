import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

function Body({ lines, setLines, colors }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const inputRefs = useRef([]);
    const pos = useRef(null);

    const handleLineClick = (index) => {
        setEditingIndex(index);
    };

    const handleEditChange = (event, index) => {
        const newLines = [...lines];
        newLines[index] = event.target.value;
        setLines(newLines);
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                const imageUrl = URL.createObjectURL(blob);
                const newLines = [...lines];
                newLines[editingIndex] += ` ![](${imageUrl})`;
                setLines(newLines);
                event.preventDefault();
                break;
            }
        }
    };

    const containerCSS = {
        margin: "3px 10px",
        padding: "10px",
        backgroundColor: colors[2],
        flexGrow: '1',
        overflowY: "auto",
        overflowWrap: "break-word",
        fontFamily: "Roboto Mono, monospace"
    };

    const lineCSS = {
        color: colors[3],
        margin: "0px",
        cursor: "default"
    };

    const inputCSS = {
        width: "100%",
        border: "none",
        backgroundColor: "transparent",
        color: colors[3],
        outline: "none",
        fontSize: "20px",
        borderBottom: "3px solid #181C14"
    };

    useEffect(() => {
        if (inputRefs.current[editingIndex]) {
            const input = inputRefs.current[editingIndex];
            input.focus();
            if (pos.current != null) {
                input.setSelectionRange(pos.current, pos.current);
                pos.current = null;
            }
            else {
                input.setSelectionRange(input.value.length, input.value.length);
            }
        }
    }, [editingIndex]);

    return (
        <div
            id="container"
            style={containerCSS}
            onPaste={handlePaste}
        >
            {lines.map((line, index) => (
                <div
                    key={index}
                    onClick={() => handleLineClick(index)}
                    style={lineCSS}
                >
                    {editingIndex === index ? (
                        <input
                            ref={(el) => inputRefs.current[index] = el}
                            value={line}
                            onChange={(e) => handleEditChange(e, index)}
                            onBlur={(e) => { setEditingIndex(null) }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const newLines = [...lines];
                                    const currentLine = newLines[editingIndex];
                                    const cursorPosition = e.target.selectionStart;
                                    const beforeCursor = currentLine.slice(0, cursorPosition);
                                    const afterCursor = currentLine.slice(cursorPosition);
                                    newLines[editingIndex] = beforeCursor;
                                    newLines.splice(editingIndex + 1, 0, afterCursor);
                                    setLines(newLines);
                                    setEditingIndex(editingIndex + 1);
                                    e.preventDefault();
                                }
                                else if (e.key === 'Backspace') {
                                    if (editingIndex > 0 && e.target.selectionStart == 0) {
                                        const newLines = [...lines];
                                        newLines[editingIndex - 1] += newLines[editingIndex];
                                        newLines.splice(editingIndex, 1);
                                        setLines(newLines);
                                        setEditingIndex(editingIndex - 1);
                                        e.preventDefault();
                                    }
                                }
                                else if (e.key === 'ArrowDown') {
                                    if (editingIndex < lines.length - 1) {
                                        const cursorPosition = e.target.selectionStart;
                                        if (!(cursorPosition > lines[editingIndex + 1].length)) {
                                            pos.current = cursorPosition;
                                        }
                                        setEditingIndex(editingIndex + 1);
                                        e.preventDefault();
                                    }
                                }
                                else if (e.key === 'ArrowUp') {
                                    if (editingIndex > 0) {
                                        const cursorPosition = e.target.selectionStart;
                                        if (!(cursorPosition > lines[editingIndex - 1].length)) {
                                            pos.current = cursorPosition;
                                        }
                                        setEditingIndex(editingIndex - 1);
                                        e.preventDefault();
                                    }
                                }
                                else if (e.key === 'Delete') {
                                    const newLines = [...lines];
                                    if (!lines[editingIndex] && editingIndex > 0) {
                                        newLines.splice(editingIndex, 1);
                                        if (editingIndex === lines.length - 1 && editingIndex > 0) {
                                            setEditingIndex(editingIndex - 1);
                                        } else {
                                            setEditingIndex(editingIndex);
                                        }
                                        setLines(newLines);
                                        e.preventDefault();
                                    }
                                    else if (e.target.selectionStart === lines[editingIndex].length && editingIndex < lines.length - 1) {
                                        newLines[editingIndex] += newLines[editingIndex + 1];
                                        newLines.splice(editingIndex + 1, 1);
                                        setLines(newLines);
                                        e.preventDefault();
                                    }
                                }
                            }}
                            style={inputCSS}
                        />
                    ) : (
                        line.trim() ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: marked(line),
                                }}
                            />
                        ) : (
                            <div style={{ height: "20.8px", margin: "16px 0px" }} />
                        )
                    )}
                </div>
            ))}
        </div>
    );
}

export default Body;