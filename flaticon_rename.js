const fs = require("fs");
const path = require("path");
const BASE_DIR = './src/assets/font';

const updateFileNames = ()=>{
    return new Promise((resolve,reject)=>{
        const extensions = ["eot","woff","svg", "html","ttf"];
        files = fs.readdirSync(BASE_DIR);
        const now = Date.now();
        const random = 'xyaWm';
        const postfix = `${now}${random}`;
        if(!files || !files.length){
            return reject("No Files Found");
        }
        let promises = files.map(file=>{
            return new Promise((resolve,reject)=>{
                const [name,extension] = file.split(".");
                if(extensions.indexOf(extension)> -1){
                    const newFileName = `${name}_${postfix}.${extension}`;
                    fs.rename(path.join(BASE_DIR,file), path.join(BASE_DIR,newFileName), (err)=>{
                        if(err){
                            console.log("Error Occured in Renaming File : ", file);
                            console.error(err);
                            return reject(err);
                        }else{
                            return resolve()
                        }
                    });
                }else{
                    // Need not change this file's name anyway.
                    return resolve();
                }
            });
        });
        Promise.all(promises).then(()=>{
            console.log("[Done] Updated Flaticon Font File's Names");
            return resolve(postfix);
        }).catch(err=>{
            return reject(err);
        })
        
    })
    
}
const updateFlatIconScss = (postfix) => {
    fs.readFile(path.join(BASE_DIR,'_flaticon.scss'), 'utf8', (err,data)=>{
        if (err) {
            console.log("Error in updating _flaticon.scss");
            return console.error(err);
        }
        // data.replace(/url\("/assets/font/(Flaticon)?([\.a-zA-Z\?\#]*)"\)/g, 'url("/assets/font/$1'+postfix+'' ))
        data = data.replace(/\/assets\/font\/Flaticon/g, '/assets/font/Flaticon_'+postfix);
        console.log(data);
        fs.writeFile(path.join(BASE_DIR,'_flaticon.scss'),data, 'utf-8', (err)=>{
            if(err){
                console.log("Error in updating _flaticon.scss");
                return console.error(err);
            }else{
                console.log("[Done] Updated _flaticons.scss");
            }
        });
    })
}

const postfix = updateFileNames().then(postfix=>{
    return updateFlatIconScss(postfix);    
}).catch(err=>{
    console.log("Could not complete Flaticon Rename Process, An Error Occured");
    console.error(err);
});






