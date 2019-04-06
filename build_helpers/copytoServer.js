const fs = require("fs-extra");
const path = require("path");

async function copyDist() {
/*   const targetDir = "./../opend-backend/dist";
  const sourceDir = "./dist";
  const sourceHtml = "./../opend-backend/dist/index.html";
  const targetAppEjs = "./../opend-backend/server/views/app.ejs"; */

  const sourceHtml = "../dist/index.html";
  const targetAppEjs = "../server/views/app.ejs"; 


  // With a callback:
  // Earlier Version
  /* try {
    await fs.emptyDir(targetDir);
    // console.log("/dist Directory Exists!");
    await fs.copy(sourceDir, targetDir);
    fs.move(sourceHtml, targetAppEjs, { overwrite: true });
  } catch (err) {
    throw err;
  } */

  try{
    await fs.move(path.join(__dirname,sourceHtml), path.join(__dirname, targetAppEjs), { overwrite: true });
  }catch(err){
    throw err;
  }
}

copyDist()
.then(data => {
  // console.log("Done");
})
.catch(err => {
  console.log("Error in copying to server");
  console.log(err);
});
