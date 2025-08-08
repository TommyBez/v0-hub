export const logger = {
  log: (message: string) => {
    // biome-ignore lint/suspicious/noConsole: will add a proper logger later
    console.log(message)
  },
  error: (message: string) => {
    // biome-ignore lint/suspicious/noConsole: will add a proper logger later
    console.error(message)
  },
}
