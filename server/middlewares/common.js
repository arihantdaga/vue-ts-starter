'use strict';

const defaultDescript = "My App - Write your diary online beautifully and share your notes with others or read what other people are sharing";
const defaultTitle = "My App | Your new Digital Diary";
const request = require("request-promise");
const config = require("../config");

function setMeta(name){
    return (req,res,next)=>{
        switch(name){
            case "home":
                res.locals.title = "My App | Your new Digital Diary"
                res.locals.description = "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling";
                return next();
            case "login":
                res.locals.title = "Login | My App"
                res.locals.description = "Login to My App";
                return next();
            case "signup":
                res.locals.title = "Register | My App"
                res.locals.description = "Register with My App";
                return next();
            case "vreifyEmail":
                res.locals.title = "Verify Email | My App"
                res.locals.description = "Verify Email with My App";
                return next();
            case "privacyPolicy":
                res.locals.title = "Privacy Policy | My App"
                res.locals.description = "Privacy Policy of My App";
                return next();
            case "readPublicDiaries":
                res.locals.title = "Read Public Diaries on My App | My App"
                res.locals.description = "Read notes written by poeple and shared public";
                return next();
            case "oneNote":
                let noteId = req.params.id;
                if(!noteId){
                    return next({status: 404, messag: "Did not find this notee"});
                }
                request({
                    method: "GET",
                    url : `${config.API_HOST}${config.API_URLS.getNoteMeta}`,
                    qs: {
                        noteId: noteId
                    },
                    json: true
                }).then(note=>{
                    // console.log(data);
                    if(!note){
                        res.locals.title = "My App | Your new Digital Diary"
                        res.locals.description = "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling";
                        return next();
                    }else{
                        res.locals.title = `${note.title} | My App - Your new digital diary`;
                        res.locals.description = note.content ? note.content.substr(0,100) : defaultDescript;
                        res.locals.androidUri = `theopendiaries://note/${note._id}`;
                        res.locals.androidAppLink = `android-app://com.feturtles.theopendiaries/https/theopendiaries.com/note/${note._id}`
                        return next();
                    }
                }).catch(err=>{
                    res.locals.title = "My App | Your new Digital Diary"
                    res.locals.description = "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling";
                    return next();
                })

                // find if the not is public
                /* NotesModel.findOne({_id: noteId}).select({
                    title: 1,
                    short_content:1,
                    is_public: 1
                }).lean().exec().then(note=>{
                    if(!note){
                        return next({status: 404, messag: "Did not find this notee"});
                    }
                    else{
                        if(note.is_public){
                            res.locals.title = `${note.title} | My App - Your new digital diary`;
                            res.locals.description = note.content ? note.content.substr(0,100) : defaultDescript;
                            res.locals.androidUri = `theopendiaries://note/${note._id}`;
                            res.locals.androidAppLink = `android-app://com.feturtles.theopendiaries/https/theopendiaries.com/note/${note._id}`
                            return next();
                        }else{
                            // leave the title stting of privat note on front end only.
                            res.locals.title = defaultTitle;
                            res.locals.description = defaultDescript;
                            return next();
                        }
                    }
                }).catch(err=>{
                    // Setting default title
                    res.locals.title = "My App | Your new Digital Diary"
                    res.locals.description = "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling";
                    return next();
                }); */
                break;

            case "myAccount":
                res.locals.title = `User Profile | My App - Your new Digital Diary`;
                res.locals.description = `User profile`;
                return next();
            case "myDiary":
                res.locals.title = `My Diary | My App - Your new Digital Diary`;
                res.locals.description = `My Diary`;
                return next();
            case "myPaper":
                res.locals.title = `My Paper - Write Diary | My App - Your new Digital Diary`;
                res.locals.description = `My Paper - Write Diary`;
                return next();

            case "usreDiary":
                let userId = req.params.userId;
                if(!userId){
                    return next({status: 404, messag: "Did not find this user"});
                }
                request({
                    method: "GET",
                    url : `${config.API_HOST}${config.API_URLS.getUserMeta}`,
                    qs: {
                        userId: userId
                    },
                    json: true
                }).then(user=>{
                    if(!user){
                        return next({status: 400, message: "We dont know this user"});
                    }
                    res.locals.title = `${user.pet_name}'s Diary | My App - Your new Digital Diary`;
                    res.locals.description = `${user.pet_name}'s Diary - Read what ${user.pet_name} has shard pulicly`;
                    
                    res.locals.androidUri = `theopendiaries://user-diary/${user._id}`;
                    res.locals.androidAppLink = `android-app://com.feturtles.theopendiaries/https/theopendiaries.com/user-diary/${user._id}`

                    return next();
                }).catch(err=>{
                    // Setting default title
                    res.locals.title = "My App | Your new Digital Diary"
                    res.locals.description = "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling";
                    return next();
                });

                /* UserModel.findOne({_id: userId}).select({
                    pet_name: 1
                }).lean().exec().then(user=>{
                    if(!user){
                        return next({status: 400, message: "I dont know this user"});
                    }
                    res.locals.title = `${user.pet_name}'s Diary | My App - Your new Digital Diary`;
                    res.locals.description = `${user.pet_name}'s Diary - Read what ${user.pet_name} has shard pulicly`;
                    
                    res.locals.androidUri = `theopendiaries://user-diary/${user._id}`;
                    res.locals.androidAppLink = `android-app://com.feturtles.theopendiaries/https/theopendiaries.com/user-diary/${user._id}`

                    return next();
                }).catch(err=>{
                    // Setting default title
                    res.locals.title = "My App | Your new Digital Diary"
                    res.locals.description = "My App - Write your digital diary online beautifully and share your notes with others or read what other people are feeling";
                    return next();
                }); */

                break;
            case "forgotPassword":
                res.locals.title = "Forgot password | My App"
                res.locals.description = "Forgot password on My App";
                return next();
            case "suggestIdeas":
                res.locals.title = "Suggest Idea for My App | My App"
                res.locals.description = "Suggest new ideas to implement on the My App"
                return next();
            default:
            return next();
            break;
        }
    }
}
module.exports = {
    setMeta
}
