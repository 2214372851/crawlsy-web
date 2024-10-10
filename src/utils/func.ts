/**
 * 实现函数的节流（目的是频繁触发中缩减频率）
 * @param fn {Function} 实际要执行的函数
 * @param delay {Number} 执行间隔，单位是毫秒(ms)，默认100ms
 * @return {Function} 可被调用执行的函数
 */
export const debounce = (fn: Function, delay: number = 500): Function => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return function (...args: any[]) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    };
}
