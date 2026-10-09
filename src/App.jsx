import { useEffect, useState } from "react";
import PhotoGalleryViewer from "./components/photoGalleryViewer/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const update = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, []);
    const repoUrl = "https://github.com/a2rp/photo-gallery-viewer";
    return <div className={styles.appShell} id="top">
        <SiteHeader title="Stillroom" mark="S" repoUrl={repoUrl} navItems={[['Gallery','#gallery'],['Collections','#collections']]} />
        <main className={styles.pageContent}><PhotoGalleryViewer /></main>
        <SiteFooter repoUrl={repoUrl} />
        <BackToTop visible={showBackToTop} />
    </div>;
};

export default App;