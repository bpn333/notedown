import { useEffect, useState } from "react";
import { deleteImage, getImages } from "./imageStore";

function Inventory({ colors, onClose }) {
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        let active = true;
        let imageUrls = [];
        const loadImages = async () => {
            try {
                const storedImages = await getImages();
                if (active) {
                    imageUrls = storedImages.map((image) => URL.createObjectURL(image.blob));
                    setImages(storedImages.map((image, index) => ({
                        ...image,
                        url: imageUrls[index],
                    })));
                }
            } catch (loadError) {
                console.error("Unable to load the image inventory.", loadError);
                if (active) setError("inventory unavailable");
            }
        };
        loadImages();
        return () => {
            active = false;
            imageUrls.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
        };
    }, []);

    const copyMarkdown = async (image) => {
        try {
            await navigator.clipboard.writeText(`![](/api/${image.id})`);
            setCopiedId(image.id);
            window.setTimeout(() => setCopiedId((currentId) => (
                currentId === image.id ? null : currentId
            )), 1400);
        } catch (copyError) {
            console.error("Unable to copy image markdown.", copyError);
            setError("copy failed");
        }
    };

    const removeImage = async (image) => {
        try {
            await deleteImage(image.id);
            URL.revokeObjectURL(image.url);
            setImages((currentImages) => currentImages.filter((current) => current.id !== image.id));
        } catch (deleteError) {
            console.error("Unable to delete image from the inventory.", deleteError);
            setError("delete failed");
        }
    };

    return (
        <div className="inventory-backdrop" role="dialog" aria-modal="true" aria-label="Image inventory">
            <section
                className="inventory"
                style={{ backgroundColor: colors[0], color: colors[1], borderColor: colors[3] }}
            >
                <header className="inventory-header">
                    <div>
                        <span className="inventory-title">INVENTORY</span>
                        <span className="inventory-count">{images.length}/∞</span>
                    </div>
                    <button className="inventory-close" style={{ color: colors[1] }} onClick={onClose} aria-label="Close inventory">×</button>
                </header>
                {error && <p className="inventory-error">{error}</p>}
                {images.length === 0 && !error ? (
                    <p className="inventory-empty">no images yet<br /><span>ctrl+v to collect one</span></p>
                ) : (
                    <div className="inventory-grid">
                        {images.map((image) => (
                            <div className="inventory-slot" key={image.id} style={{ backgroundColor: colors[2], borderColor: colors[3] }}>
                                <button className="inventory-image-button" onClick={() => copyMarkdown(image)} title="Copy Markdown">
                                    <img src={image.url} alt="Saved clipboard image" />
                                    {copiedId === image.id && <span className="inventory-copied">COPIED</span>}
                                </button>
                                <button className="inventory-delete" onClick={() => removeImage(image)} aria-label="Delete image">
                                    <svg><use href="/icons/trashIcon.svg#trashIcon" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Inventory;
