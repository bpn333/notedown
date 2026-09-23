function Head({ clean, colors, onOpenFile }) {
  const headCSS = {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: colors[0],
    color: colors[1],
    userSelect: "none",
    margin: "3px",
    alignItems: "center",
  };
  const btnCSS = {
    backgroundColor: "transparent",
    border: "none",
    margin: "3px",
    cursor: "pointer",
    color: "red",
  };
  const iconCSS = {
    width: "33px",
    height: "33px",
    padding: "3px",
    fill: colors[3],
  };

  return (
    <div style={headCSS}>
      <button style={btnCSS} onClick={clean}>
        <svg style={iconCSS}>
          <use href="/icons/trashIcon.svg#trashIcon" />
        </svg>
      </button>
      <span
        style={{
          fontSize: "30px",
          fontFamily: "ultraKill",
          fontWeight: "1000",
        }}
        onClick={() =>
          (window.location.href = "https://github.com/bpn333/notedown")
        }
      >
        NoteDown
      </span>
      <button style={btnCSS} onClick={onOpenFile}>
        <svg style={iconCSS}>
          <use href="/icons/fileIcon.svg#fileIcon" />
        </svg>
      </button>
    </div>
  );
}

export default Head;
