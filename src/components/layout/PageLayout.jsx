import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SEO from "../common/SEO";
import BackgroundAnimation from "../background/BackgroundAnimation";

/**
 * Standard PageLayout wrapper with Antigravity Space Background
 */
export const PageLayout = ({
  title,
  description,
  keywords,
  children,
  className = "",
  showFooter = true,
  showBackground = true,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen bg-canvas font-inter text-fg transition-colors duration-300 relative flex flex-col ${className}`}
    >
      <SEO title={title} description={description} keywords={keywords} />

      {/* Antigravity Space Background */}
      {showBackground && <BackgroundAnimation />}

      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-brand-violet via-brand-violet to-brand-cyan shadow-[0_0_10px_rgb(var(--primary-rgb)/0.7)] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />

      <main className="flex-1 w-full relative z-10">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
