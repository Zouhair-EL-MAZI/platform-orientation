import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200/80 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/30 dark:bg-slate-950/85 dark:text-white dark:ring-slate-700/80 dark:hover:bg-slate-900"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
