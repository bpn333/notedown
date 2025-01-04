import { useRef } from "react";

function Head({ setLines, colors }) {
    const headCSS = {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: colors[0],
        color: colors[1],
        userSelect: "none",
        margin: "3px",
        alignItems: "center"
    };
    const btnCSS = {
        backgroundColor: "transparent",
        border: "none",
        margin: "3px",
        cursor: "pointer",
        color: "red"
    };
    const iconCSS = {
        width: "33px",
        height: "33px",
        padding: "3px",
        fill: colors[3]
    };

    const fileInputRef = useRef(null);

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const lines = content.split("\n");
                setLines(lines);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div style={headCSS}>
            <button
                style={btnCSS}
                onClick={() => setLines([''])}
            >
                <svg style={iconCSS} >
                    <use href="/icons/trashIcon.svg#trashIcon" />
                </svg>
            </button>
            <span style={{ fontSize: "30px", fontFamily: "ultraKill", fontWeight: "1000" }} onClick={() => window.location.href = "https://github.com/bpn333/notedown"}>NoteDown</span>
            <button style={btnCSS} onClick={handleFileClick}>
                <svg style={iconCSS} >
                    <use href="/icons/fileIcon.svg#fileIcon" />
                </svg>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".txt,.md"
            />
        </div>
    );
}

export default Head;
