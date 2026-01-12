import projectJson from "./package.json" with { type: "json" };
import fs from "fs";
import path from "path";


function updateVersionInPackageJson() {
    const v = process.argv[2].replace(/^v/, '');
    projectJson.version = v;
    const updatedJson = JSON.stringify(projectJson, null, 2);
    fs.writeFileSync(path.join(".", 'package.json'), updatedJson, 'utf8');
    console.log(`Updated version to ${projectJson.version} in package.json`);
}

updateVersionInPackageJson();