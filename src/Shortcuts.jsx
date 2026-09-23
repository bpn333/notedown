const shortcuts = [
    ["H", "Show or hide shortcuts"],
    ["F", "Toggle the interface"],
    ["I", "Open the image inventory"],
    ["Ctrl + O", "Open a Markdown or text file"],
    ["Ctrl + S", "Download the current note as Markdown"],
    ["Ctrl + V", "Paste text or image while editing a line"],
    ["Escape", "Close an open dialog"],
];

function Shortcuts({ colors, onClose }) {
    return (
        <div
            className="shortcuts-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            onClick={onClose}
        >
            <section
                className="shortcuts"
                style={{ backgroundColor: colors[0], color: colors[1], borderColor: colors[3] }}
                onClick={(event) => event.stopPropagation()}
            >
                <header className="shortcuts-header">
                    <span className="shortcuts-title">SHORTCUTS</span>
                    <button
                        className="shortcuts-close"
                        style={{ color: colors[1] }}
                        onClick={onClose}
                        aria-label="Close shortcuts"
                    >
                        ×
                    </button>
                </header>
                <div className="shortcuts-list">
                    {shortcuts.map(([key, description]) => (
                        <div className="shortcut-row" key={key}>
                            <kbd style={{ color: colors[1], borderColor: colors[3] }}>{key}</kbd>
                            <span>{description}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Shortcuts;
