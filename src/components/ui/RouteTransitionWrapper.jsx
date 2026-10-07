import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  AuthSkeleton,
  HomeSkeleton,
  ChatSkeleton,
  ProfileSkeleton,
} from "./PageSkeletons";
import useGlobalScrollAnimation from "../../customHooks/useGlobalScrollAnimation";

/**
 * RouteTransitionWrapper
 * Listens for route changes and displays a realistic skeleton loader
 * corresponding to the active route for ~1.2 seconds before showing real content.
 */
const RouteTransitionWrapper = ({ children }) => {
  const location = useLocation();
  useGlobalScrollAnimation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [progress, setProgress] = useState(0);
  const prevPathRef = React.useRef(location.pathname);
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    // 1. Initial page load skeleton
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setIsLoading(true);
      setCurrentPath(location.pathname);
      setProgress(25);

      const pInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(pInterval);
            return 90;
          }
          return prev + 25;
        });
      }, 150);

      const timer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }, 400);

      return () => {
        clearInterval(pInterval);
        clearTimeout(timer);
      };
    }

    const prevPath = prevPathRef.current;
    prevPathRef.current = location.pathname;

    // 2. Prevent reloading or unmounting when navigating within the chat (/chat <-> /chat/:id)
    if (prevPath.startsWith("/chat") && location.pathname.startsWith("/chat")) {
      setCurrentPath(location.pathname);
      setIsLoading(false);
      return;
    }

    // 3. Reset loading state on genuine cross-page route change
    setIsLoading(true);
    setCurrentPath(location.pathname);
    setProgress(20);
    window.scrollTo({ top: 0, behavior: "instant" });

    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(pInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, 400);

    return () => {
      clearInterval(pInterval);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  // Determine skeleton type by path
  const renderSkeleton = () => {
    const path = currentPath.toLowerCase();

    if (path === "/signup") {
      return <AuthSkeleton type="signup" />;
    }
    if (path === "/login") {
      return <AuthSkeleton type="login" />;
    }
    if (path.startsWith("/chat")) {
      return <ChatSkeleton />;
    }
    if (path.startsWith("/profile")) {
      return <ProfileSkeleton />;
    }
    if (path === "/" || path === "") {
      return <HomeSkeleton />;
    }
    return <HomeSkeleton />;
  };

  return (
    <>
      {/* Top Loading Progress Line */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-violet transition-all duration-300 ease-out shadow-[0_0_12px_rgb(var(--primary-rgb)/0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Render Skeleton or Main Content */}
      {isLoading ? (
        <div className="animate-fadeIn h-full w-full">{renderSkeleton()}</div>
      ) : (
        <div className="animate-fadeIn h-full w-full">{children}</div>
      )}
    </>
  );
};

export default RouteTransitionWrapper;
