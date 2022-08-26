import { useEffect, useState } from 'react';

export default function useOnScreen(ref: React.MutableRefObject<any>) {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting),
  );

  useEffect(() => {
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
