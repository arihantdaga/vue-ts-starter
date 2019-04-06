export interface ILogger {
  info(msg: any);
  warn(msg: any);
  error(msg: any);
}

export class Logger implements ILogger {
  info(msg: any) {
    if (process.env.ENV === "development") {
      console.info(msg);
    }
  }

  warn(msg: any) {
    if (process.env.ENV === "development") {
      console.warn(msg);
    }
  }

  error(msg: any) {
    if (process.env.ENV === "development") {
      console.error(msg);
    }
  }
}
