import { useEffect, useState } from "react";
import { getShowAdult } from "@/lib/adultFilter";

export const useShowAdult = () => {
  const [show, setShow] = useState<boolean>(getShowAdult());
  useEffect(() => {
    const handler = () => setShow(getShowAdult());
    window.addEventListener("adult-filter-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("adult-filter-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return show;
};
