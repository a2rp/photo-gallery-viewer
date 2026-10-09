import { useEffect, useMemo, useState } from "react";
import { FiArrowDown, FiHeart, FiSearch, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const startingPhotos = [
    { id: 1, title: "Light by the water", note: "A small detail on the lake edge", collection: "Nature", image: "yellow-leaf.jpg", shape: "tall", favorite: true },
    { id: 2, title: "Forest current", note: "After the rain, the creek ran clear", collection: "Nature", image: "waterfall.jpg", shape: "wide", favorite: false },
    { id: 3, title: "Studio study", note: "Notes from a quiet afternoon", collection: "Details", image: "visual-notes.jpg", shape: "square", favorite: false },
    { id: 4, title: "Turntable detail", note: "Needle down, afternoon on", collection: "Objects", image: "vinyl.jpg", shape: "tall", favorite: true },
    { id: 5, title: "Sunlit wall", note: "Warm light on an old surface", collection: "Details", image: "sunlit-texture.jpg", shape: "square", favorite: false },
    { id: 6, title: "Late lunch", note: "A table shared with friends", collection: "Places", image: "shared-table.jpg", shape: "wide", favorite: false },
    { id: 7, title: "Rocky shore", note: "The last stretch before the tide", collection: "Places", image: "rocky-shore.jpg", shape: "tall", favorite: true },
    { id: 8, title: "Open country", note: "A road with nowhere to be", collection: "Nature", image: "open-country.jpg", shape: "wide", favorite: false },
];
const collections = ["All photos", "Nature", "Objects", "Places", "Details"];
const storageKey = "stillroom-gallery-favorites";
const photoSrc = (image) => import.meta.env.BASE_URL + "images/" + image;

const PhotoGalleryViewer = () => {
    const [photos, setPhotos] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey)) ?? startingPhotos; } catch { return startingPhotos; } });
    const [collection, setCollection] = useState("All photos");
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [search, setSearch] = useState("");
    const [activePhoto, setActivePhoto] = useState(null);
    useEffect(() => localStorage.setItem(storageKey, JSON.stringify(photos)), [photos]);
    useEffect(() => {
        const onKeyDown = (event) => { if (event.key === "Escape") setActivePhoto(null); };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);
    const visiblePhotos = useMemo(() => photos.filter((photo) => {
        const matchesCollection = collection === "All photos" || photo.collection === collection;
        const matchesFavorite = !favoritesOnly || photo.favorite;
        return matchesCollection && matchesFavorite && (photo.title + " " + photo.note + " " + photo.collection).toLowerCase().includes(search.toLowerCase());
    }), [photos, collection, favoritesOnly, search]);
    const toggleFavorite = (id) => {
        setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, favorite: !photo.favorite } : photo));
        setActivePhoto((current) => current?.id === id ? { ...current, favorite: !current.favorite } : current);
    };

    return <div className={styles.gallery}>
        <section className={styles.galleryHead} id="gallery"><div><p className={styles.label}>A field of small moments</p><h1>Keep a little light.</h1><p>Photographs, details, and places worth looking at twice.</p></div><div className={styles.photoCount}><strong>{photos.length}</strong><span>frames in this room</span></div></section>
        <div className={styles.galleryTools} id="collections"><div className={styles.collectionFilters} role="group" aria-label="Filter gallery by collection">{collections.map((item) => <button type="button" key={item} onClick={() => setCollection(item)} aria-pressed={collection === item} className={collection === item ? styles.activeFilter : ""}>{item}</button>)}</div><button type="button" className={favoritesOnly ? styles.favoriteActive : styles.favoriteFilter} onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly}><FiHeart aria-hidden="true" /> Favorites</button><label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a moment" aria-label="Search photos" /></label></div>
        <div className={styles.gallerySummary}><span>{visiblePhotos.length} photos</span><span>Local collection / Updated for your eyes only</span></div>
        <section className={styles.photoGrid} aria-label="Photo gallery">{visiblePhotos.map((photo) => <article className={styles.photoCard + " " + styles[photo.shape]} key={photo.id}>
            <button className={styles.photoButton} type="button" onClick={() => setActivePhoto(photo)} aria-label={"Open photo " + photo.title}><img src={photoSrc(photo.image)} alt={photo.note} /><span className={styles.photoCaption}><span>{photo.title}</span><small>{photo.collection}</small></span></button>
            <button className={photo.favorite ? styles.favoriteOn : styles.favoriteOff} type="button" onClick={() => toggleFavorite(photo.id)} aria-label={(photo.favorite ? "Remove " : "Add ") + photo.title + (photo.favorite ? " from" : " to") + " favorites"} aria-pressed={photo.favorite}><FiHeart aria-hidden="true" /></button>
        </article>)}</section>
        {!visiblePhotos.length && <p className={styles.empty}>No photos fit those filters. Try another collection.</p>}
        <p className={styles.localNote}>Images are included with this app and stay on this page.</p>
        {activePhoto && <div className={styles.lightbox} onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePhoto(null); }}><section className={styles.lightboxPanel} role="dialog" aria-modal="true" aria-labelledby="photo-title"><button className={styles.closeLightbox} type="button" autoFocus onClick={() => setActivePhoto(null)} aria-label="Close photo"><FiX /></button><img className={styles.largeImage} src={photoSrc(activePhoto.image)} alt={activePhoto.note} /><div className={styles.photoDetails}><div><span>{activePhoto.collection}</span><h2 id="photo-title">{activePhoto.title}</h2><p>{activePhoto.note}</p></div><div><button type="button" className={activePhoto.favorite ? styles.favoriteActive : styles.favoriteFilter} onClick={() => toggleFavorite(activePhoto.id)} aria-pressed={activePhoto.favorite}><FiHeart /> {activePhoto.favorite ? "Saved" : "Save"}</button><a href={photoSrc(activePhoto.image)} download={activePhoto.image} aria-label={"Download " + activePhoto.title}><FiArrowDown /> Download</a></div></div></section></div>}
    </div>;
};

export default PhotoGalleryViewer;
