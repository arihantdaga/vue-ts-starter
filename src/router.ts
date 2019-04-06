import Vue from "vue";
import VueRouter, { Location, Route, RouteConfig } from "vue-router";
import { makeHot, reload } from "./util/hot-reload";
import { LoginService } from "./util/login";
import NProgress from "nprogress";

const homeComponent = () =>
  import("./components/home").then(({ HomeComponent }) => HomeComponent);
const loginComponent = () =>
  import("./components/login").then(({ LoginComponent }) => LoginComponent);
const forgotPasswordComponent = () =>
  import("./components/login").then(
    ({ ForgotPasswordComponent }) => ForgotPasswordComponent
  );
const signupComponent = () =>
  import("./components/signup").then(({ SignupComponent }) => SignupComponent);

// const homeComponent = () => import(/* webpackChunkName: 'home' */'./components/home').then(({ HomeComponent }) => HomeComponent);
// const aboutComponent = () => import(/* webpackChunkName: 'about' */'./components/about').then(({ AboutComponent }) => AboutComponent);
// const listComponent = () => import(/* webpackChunkName: 'list' */'./components/list').then(({ ListComponent }) => ListComponent);

if (process.env.ENV === "development" && module.hot) {
  const homeModuleId = "./components/home";
  const aboutModuleId = "./components/about";
  const listModuleId = "./components/list";

  // first arguments for `module.hot.accept` and `require` methods have to be static strings
  // see https://github.com/webpack/webpack/issues/5668
  makeHot(
    homeModuleId,
    homeComponent,
    module.hot.accept("./components/home", () =>
      reload(homeModuleId, (<any>require("./components/home")).HomeComponent)
    )
  );
}

let loginService = LoginService.getInstance();
loginService.checkLogin();

Vue.use(VueRouter);

export const createRoutes: () => RouteConfig[] = () => [
  {
    path: "/",
    component: homeComponent,
    name: "HomePage"
  },
  {
    path: "/login",
    component: loginComponent,
    name: "LoginPage"
  },
  {
    path: "/signup",
    name: "SignpPage",
    component: signupComponent
  },
  {
    path: "/forgot-password",
    name: "ForgotPassPage",
    component: forgotPasswordComponent
  },
  { path: "*", redirect: "/" }
];

const createRouter = () => {
  let router = new VueRouter({ mode: "history", routes: createRoutes() });
  router.beforeEach((to, from, next) => {
    NProgress.start();
    NProgress.set(0.1);

    // Its all a jugaad. I KNOW!!!
    // if (
    //   loginService.user.authenticated &&
    //   to.name == "HomePage" &&
    //   from.name == "ReadPublicPage"
    // ) {
    //   NProgress.done();
    // }

    // window.something = to;
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      if (!loginService.user.authenticated) {
        next({
          path: "/login",
          query: { redirect: to.fullPath }
        });
      } else {
        next();
      }
    } else if (
      loginService.user.authenticated &&
      to.matched.some(
        record =>
          record.path == "/login" ||
          record.path == "/signup" ||
          record.name == "HomePage"
      )
    ) {
      next({
        path: "/"
      }); // make sure to always call next()!
    } else {
      next();
    }
  });

  router.afterEach((to, from) => {
    NProgress.done();
    try {
      ga("set", "page", to.path);
      ga("send", "pageview");
    } catch (err) {
      // DO nothing
    }
  });

  return router;
};

export { createRouter };
