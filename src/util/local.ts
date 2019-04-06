
const getJson = (obj: any): string => {
    if (!obj) {
        return null;
    }
    try {
        return JSON.stringify(obj);
    } catch (err) {
        return null;
    }
}
const getObject = (str: string) => {
    try {
        return JSON.parse(str);
    }
    catch (err) {
        // console.log("error occured in parseing");
        return null;
    }
}
const setItem = (key, val) => {
    if (!val) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, val);
    }
}

const getUser = ()=> {
    return getObject(localStorage.getItem("user"));
}

const setUser = (user)=>{
    return setItem("user", getJson(user));
}

const setNotepadPrefrences = (prefrences)=>{
    return setItem("notepad_prefs", getJson(prefrences));
}
const getNotepadPrefrences = ()=>{
    return getObject(localStorage.getItem("notepad_prefs"));
}

const localService = {
    getUser,
    setUser,
    getNotepadPrefrences,
    setNotepadPrefrences

}

export {localService};