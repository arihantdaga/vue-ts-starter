export class Constants {
  // API_BASE;
  // API_URLS;
  constructor() {}
  get API_HOST() {
    // return "http://localhost:4040";
    return process.env.API_HOST;
  }
  get API_BASE() {
    // return "http://localhost:4040";
    return process.env.API_BASE;
  }
  get API_URLS() {
    return {
      login: {
        method: "POST",
        url: "/api/v1/auth/login"
      },
      signup: {
        method: "POST",
        url: "/api/v1/auth/register"
      },
      fb_login: {
        method: "POST",
        url: "/api/v1/auth/facebook"
      }
    };
  }

  get fbAppId() {
    return "anything";
  }
}
