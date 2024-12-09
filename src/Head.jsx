
function Head() {
    const colors = {
        background: "#3C3D37",
        foreground: "#ECDFCC"
    }
    const headCSS = {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: colors.background,
        color: colors.foreground,
        userSelect: "none",
        margin: "5px"
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
    };
    return (
        <div style={headCSS}>
            <button style={btnCSS}>
                <img src="/folderIcon.svg" style={iconCSS} />
            </button>
            <h3>NoteDown</h3>
            <button style={btnCSS}>
                <img src="/fileIcon.svg" style={iconCSS} />
            </button>
        </div>
    );
}
export default Head;