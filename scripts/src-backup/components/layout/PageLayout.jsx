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

  return (
    <div
      className={`min-h-screen bg-slate-50 dark:bg-[#060918] font-inter text-slate-800 dark:text-slate-200 transition-colors duration-300 relative flex flex-col ${className}`}
    >
      <SEO title={title} description={description} keywords={keywords} />

      {/* Antigravity Space Background */}
      {showBackground && <BackgroundAnimation />}


      <Navbar />

      <main className="flex-1 w-full relative z-10">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
