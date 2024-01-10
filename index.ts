import {writeOrUpdateResourceFile} from "./src/resource-file-generator";

function index(){
    writeOrUpdateResourceFile().then(() => console.log("✅ Successfully updated resource file"))
}
index()