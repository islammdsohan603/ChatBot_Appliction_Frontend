import Navbar from "./Navbar";
import Footer from "./Footer";
import SEO from "../common/SEO";
import BackgroundAnimation from "../background/BackgroundAnimation";
import ScrollProgress from "../ui/ScrollProgress";

/**
 * Standard PageLayout wrapper with Antigravity Space Background and smooth scrolling
 */
export const PageLayout = ({
  title,
  description,
  keywords,
  children,
  className = "",
  showFooter = true,
  showBackground = true,
  showMoon = false,
  showScrollProgress = true,
}) => {
  return (
    <div
      className={`min-h-screen bg-canvas font-inter text-fg transition-colors duration-300 relative flex flex-col ${className}`}
    >
      <SEO title={title} description={description} keywords={keywords} />

      {/* GSAP ScrollTrigger Scrub Progress Bar & Smooth Back-to-Top Button */}
      {showScrollProgress && <ScrollProgress />}

      {/* Antigravity Space Background (Moon disabled per design) */}
      {showBackground && <BackgroundAnimation showMoon={showMoon} />}

      <Navbar />

      <main className="flex-1 w-full relative z-10">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
