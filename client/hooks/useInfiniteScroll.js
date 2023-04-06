import { useEffect, useState, useCallback, useRef } from "react";

// bool 값을 반환
const useInfiniteScroll = (targetEl) => {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  // intersecting = true로 상태를 바꿔주는 함수
  // memoization되어 다시 선언되지 않음
  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(
          // targetEl과 entry element 들 중 하나라도 겹치면
          // intersecting을 true로 설정
          entries.some((entry) => entry.isIntersecting),
        ),
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (targetEl.current) getObserver().observe(targetEl.current);

    // 화면 상에서 옵저버가 필요 없어지면 cleanup
    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
