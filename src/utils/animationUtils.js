import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

export const usePressAnimation = (scale = 0.96) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: scale,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [scaleValue, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  }, [scaleValue]);

  return { scaleValue, onPressIn, onPressOut };
};

export const useFadeIn = (duration = 300) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const fadeIn = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [opacity, duration]);

  return { opacity, fadeIn };
};

export const useSlideUp = (distance = 20, duration = 300) => {
  const translateY = useRef(new Animated.Value(distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration * 0.8,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();
  }, [translateY, opacity, duration, distance]);

  return { translateY, opacity, animateIn };
};

export const useShimmer = (duration = 1500) => {
  const shimmerValue = useRef(new Animated.Value(-1)).current;

  const startShimmer = useCallback(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [shimmerValue, duration]);

  const stopShimmer = useCallback(() => {
    shimmerValue.stopAnimation();
  }, [shimmerValue]);

  return { shimmerValue, startShimmer, stopShimmer };
};

export const createStaggerAnimation = (itemsLength, staggerDelay = 50, baseDuration = 300) => {
  return Array.from({ length: itemsLength }).map((_, index) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    const animateIn = () => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: baseDuration,
        delay: index * staggerDelay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    };

    return { animatedValue, animateIn };
  });
};

export const usePulse = () => {
  const scale = useRef(new Animated.Value(1)).current;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [scale]);

  const stopPulse = useCallback(() => {
    scale.stopAnimation();
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, startPulse, stopPulse };
};

export default {
  usePressAnimation,
  useFadeIn,
  useSlideUp,
  useShimmer,
  createStaggerAnimation,
  usePulse,
};
