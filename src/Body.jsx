import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

function Body({ lines, setLines, colors }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const inputRefs = useRef([]);

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
        margin: "10px",
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
        cursor: "text"
    };

    const inputCSS = {
        width: "100%",
        border: "none",
        backgroundColor: "transparent",
        color: colors[3],
        outline: "none",
        fontSize: "20px"
    };

    useEffect(() => {
        if (inputRefs.current[editingIndex]) {
            const input = inputRefs.current[editingIndex];
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
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
                                    newLines.splice(editingIndex + 1, 0, '');
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
                                        setEditingIndex(editingIndex + 1);
                                        e.preventDefault();
                                    }
                                }
                                else if (e.key === 'ArrowUp') {
                                    if (editingIndex > 0) {
                                        setEditingIndex(editingIndex - 1);
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