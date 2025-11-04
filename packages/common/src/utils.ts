import { isEmpty } from "lodash-es";

/**
 * Waits for all promises to settle. Only returns the results of the promises that resolve.
 * If throwOnReject is true, it will throw an array of all the rejected reasons.
 * If throwOnReject is false, it will log the rejected reasons and return the results.
 * By default, it will throw if any of the promises reject.
 */
export async function promiseAllSettled<T>(promises: Promise<T>[], { throwOnReject = true } = {}): Promise<T[]> {
  const results: Array<any> = await Promise.allSettled(promises);
  const rejectReasons = results.filter(r => r.status === "rejected").map(r => (r as PromiseRejectedResult).reason);

  if (!isEmpty(rejectReasons)) {
    if (throwOnReject) {
      throw rejectReasons;
    }
  }

  return results.filter(r => r.status === "fulfilled").map(r => (r as PromiseFulfilledResult<T>).value);
}

/**
 * Throws an error if the value is null or undefined
 *
 * @param value - The value to check
 * @returns The value if it is not null or undefined
 *
 * @example
 * const user = notNullable(getUser());
 * // user is not null or undefined
 */
export function notNullable<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
  return value;
}
