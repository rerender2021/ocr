import { IPackConfig } from "ave-pack";

const config: IPackConfig = {
  build: {
    projectRoot: __dirname,
    target: "node14-win-x64",
    input: "./dist/_/_/app.js",
    output: "./bin/ocr.exe",
    // set DEBUG_PKG=1
    debug: false, 
    edit: false
  },
  resource: {
    icon: "./assets/ocr.ico",
    productVersion: "0.0.1",
    productName: "Ave OCR",
    fileVersion: "0.0.1",
    companyName: "QberSoft",
    fileDescription: "A simple ocr app",
    LegalCopyright: `© ${new Date().getFullYear()} Ave React Copyright.`,
  },
};

export default config;
