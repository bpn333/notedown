function Tail({ colors, setColors }) {
    const tailCSS = {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors[0],
        margin: "5px",
        padding: "5px",
        color: colors[1],
    };

    const colorInputCSS = {
        width: "40px",
        height: "40px",
        border: "none",
        cursor: "pointer",
        outline: "2px solid #181C14",
        padding: "3px",
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

    return (
        <div style={tailCSS}>
            <img src="/githubIcon.svg"
                style={{
                    width: "40px",
                    height: "40px",
                    cursor: "pointer"
                }}
                onClick={(e) => window.location.href = "https://github.com/bpn333/notedown"}
            />
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