import { lazy } from "react";

const lazyWithRetry = (importFn) =>
  lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      const hasReloaded = sessionStorage.getItem("chunk_reload");
      if (!hasReloaded) {
        sessionStorage.setItem("chunk_reload", "true");
        window.location.reload();
        return; 
      }
      sessionStorage.removeItem("chunk_reload");
      throw error; 
    }
  });

export default lazyWithRetry;
