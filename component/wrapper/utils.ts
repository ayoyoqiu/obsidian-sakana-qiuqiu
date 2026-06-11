export type RequiredDeep<T> = {
  [K in keyof T]: RequiredDeep<T[K]>;
} & Required<T>;

/**
 * simple is object
 */
export function isObject(value: unknown) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

/**
 * simple deep clone
 */
export function cloneDeep<T>(value: T): T {
  if (typeof window.structuredClone === 'function') {
    return window.structuredClone(value);
  } else {
    return JSON.parse(JSON.stringify(value));
  }
}

/**
 * simple deep merge
 */
export function mergeDeep<T extends object, U extends object>(target: T, source: U): T & U {
  const _target = cloneDeep(target) as Record<string, unknown>;
  const _source = cloneDeep(source) as Record<string, unknown>;
  if (!isObject(_target) || !isObject(_source)) {
    return _target as T & U;
  }
  Object.keys(_source).forEach((key) => {
    if (isObject(_source[key])) {
      if (!isObject(_target[key])) {
        _target[key] = {};
      }
      _target[key] = mergeDeep(_target[key] as Record<string, unknown>, _source[key] as Record<string, unknown>);
    } else {
      _target[key] = _source[key];
    }
  });
  return _target as T & U;
}

/**
 * throttle a func with requestAnimationFrame,
 * https://github.com/wuct/raf-throttle/blob/master/rafThrottle.js
 */
export function throttle<T extends (...args: unknown[]) => void>(callback: T): T {
  let requestId: number | null = null;
  let lastArgs: unknown[];
  const later = (context: unknown) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };
  const throttled = function (this: unknown, ...args: unknown[]) {
    lastArgs = args;
    if (requestId === null) {
      requestId = window.requestAnimationFrame(later(this));
    }
  } as unknown as T;
  return throttled;
}

/**
 * get the canvas context with device pixel ratio
 */
export function getCanvasCtx(
  canvas: HTMLCanvasElement,
  appSize: number,
  devicePixelRatio = (window.devicePixelRatio || 1) * 2
) {
  const canvasRenderSize = appSize * devicePixelRatio;
  canvas.width = canvasRenderSize;
  canvas.height = canvasRenderSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  // scale all drawing operations by the dpr
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
  return ctx;
}
