const express = require("express");
const router = express.Router();
const {setMeta} = require("./middlewares/common");

router.get("/", setMeta("home"), rendereApp);
router.get("/login", setMeta("login"), rendereApp);
router.get("/signup", setMeta("signup"), rendereApp);
router.get("/verify-email", setMeta("vreifyEmail"), rendereApp);
router.get("/privacy-policy", setMeta("privacyPolicy"), rendereApp);
router.get("/read-public-diaries", setMeta("readPublicDiaries"), rendereApp);
router.get("/note/:id", setMeta("oneNote"), rendereApp);
router.get("/my-account", setMeta("myAccount"), rendereApp);
router.get("/my-diary", setMeta("myDiary"), rendereApp);
router.get("/my-diary/paper", setMeta("myPaper"), rendereApp);
router.get("/my-diary/paper/:noteId", setMeta("myPaper"), rendereApp);
router.get("/user-diary/:userId", setMeta("usreDiary"), rendereApp);
router.get("/forgot-password", setMeta("forgotPassword"), rendereApp);
router.get("/suggest-ideas", setMeta("suggestIdeas"), rendereApp);



function rendereApp(req,res,next){
    let meta = {
        title: res.locals.title || "My App | Your Online Digital Diary",
        description: res.locals.description || "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling"
      }
      res.locals = {...res.locals, ...meta};
      return res.render("app");
};

module.exports = router;
