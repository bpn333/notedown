function Tail({ colors, setColors, words, chars }) {
    const tailCSS = {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors[0],
        margin: "3px",
        padding: "5px",
        color: colors[3],
    };

    const colorInputCSS = {
        width: "40px",
        height: "40px",
        border: "none",
        cursor: "pointer",
        outline: "2px solid " + colors[3],
        backgroundColor: "transparent"
    };

    const handleColorChange = (index, color) => {
        const newColors = [...colors];
        newColors[index] = color;
        setColors(newColors);
        const url = new URL(window.location);
        url.searchParams.set("colors", newColors.join(","));
        window.history.pushState({}, "", url);
    };
    const counterContainerCss = {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-around",
        fontFamily: "Roboto Mono, monospace",
        fontSize: "15px",
        fontWeight: "1000",
        margin: "1px 0",
    }

    return (
        <div style={tailCSS}>
            <div style={counterContainerCss}>
                <span>words: <span style={{ color: colors[1], fontFamily: "ultraKill" }}>{words}</span></span>
                <span>chars: <span style={{ color: colors[1], fontFamily: "ultraKill" }}>{chars}</span></span>
            </div>
            <svg
                style={{
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                    fill: colors[3]
                }}
                onClick={(e) => window.location.href = "https://github.com/bpn333/notedown"}
            >
                <use href="/icons/githubIcon.svg#githubIcon" />
            </svg>
            {colors.map((color, index) => (
                <input
                    key={index}
                    type="color"
                    value={color}
                    style={colorInputCSS}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                />
            ))}
        </div>
    );
}

export default Tail;