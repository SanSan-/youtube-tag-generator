import { MutableRefObject, useCallback, useMemo, useRef } from 'react';

export const useFocus = (): [MutableRefObject<HTMLInputElement>, VoidFunction] => {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = useCallback(() => {
    if (htmlElRef.current) {
      htmlElRef.current.focus();
    }
  }, [htmlElRef]);

  return useMemo(() => [htmlElRef, setFocus], [htmlElRef, setFocus]);
};
