import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

function Body() {
    const colors = {
        background: "#697565",
        foreground: "#ECDFCC"
    };

    const [lines, setLines] = useState(['']);
    const [editingIndex, setEditingIndex] = useState(0);
    const inputRefs = useRef([]);

    const handleLineClick = (index) => {
        setEditingIndex(index);
    };

    const handleEditChange = (event, index) => {
        const newLines = [...lines];
        newLines[index] = event.target.value;
        setLines(newLines);
    };

    const containerCSS = {
        margin: "10px",
        padding: "10px",
        backgroundColor: colors.background,
        minHeight: "90vh",
        overflowY: "auto",
        overflowWrap: "break-word",
        fontFamily: "Roboto Mono, monospace"
    };

    const lineCSS = {
        color: colors.foreground,
        margin: "0px"
    };

    const inputCSS = {
        width: "100%",
        border: "none",
        backgroundColor: "transparent",
        color: colors.foreground,
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
        <div id="container" style={containerCSS}>
            <div>
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
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        console.log('Total lines = ' + lines.length)
                                        const newLines = [...lines];
                                        newLines.splice(editingIndex + 1, 0, '');
                                        setLines(newLines);
                                        setEditingIndex(editingIndex + 1);
                                        e.preventDefault();
                                    }
                                    else if (e.key === 'Backspace' && editingIndex > 0 && !lines[editingIndex]) {
                                        setEditingIndex(editingIndex - 1);
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
        </div>
    );
}

export default Body;
