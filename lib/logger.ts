export const logger = {
  info: (...args: unknown[]) => {
    // biome-ignore lint/suspicious/noConsole: will add a proper logger later
    console.log(...args)
  },
  warn: (...args: unknown[]) => {
    // biome-ignore lint/suspicious/noConsole: will add a proper logger later
    console.warn(...args)
  },
  error: (...args: unknown[]) => {
    // biome-ignore lint/suspicious/noConsole: will add a proper logger later
    console.error(...args)
  },
}
