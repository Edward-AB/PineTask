let _counter = Date.now();

/** Generate a unique ID */
export function uid() {
  return String(++_counter);
}
