/* eslint-disable no-undef */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// images references in the manifest
import "../../assets/icon-16.png";
import "../../assets/icon-32.png";
import "../../assets/icon-80_1.png";

/* global document, Office, Word */
// global document, Office, require */
const ssoAuthHelper = require("./../helpers/ssoauthhelper");

Office.onReady((info) => {
  // eslint-disable-next-line no-undef
  localStorage.setItem("outsideOffice", false);
  document.getElementById("getGraphDataButton").onclick = ssoAuthHelper.getGraphData();
  document.getElementById("sideload-msg").style.display = "none";
  document.getElementById("app-body").style.display = "flex";
  if (!(localStorage.getItem("buttonText") == "Firmar Ahora")) {
    localStorage.setItem("buttonText", "Firmar Ahora");
  } else {
    document.getElementById("run").innerHTML = "Firmar Ahora";
  }
  if (info.host === Office.HostType.Word) {
    document.getElementById("run").onclick = runWord;
  } else if (info.host === Office.HostType.Excel) {
    document.getElementById("run").onclick = runExcel;
  } else if (info.host === Office.HostType.PowerPoint) {
    document.getElementById("run").onclick = runPowerPoint;
  }
});

export async function runWord() {
  return Word.run(async (context) => {
    document.getElementById("load-banner").style.display = "block";
    localStorage.setItem("outsideOffice", true);
    localStorage.setItem("userFromOffice", false);
    localStorage.setItem("noob", "0"); //garantiza que no usa info de office, ya que fue llamado desde clic en iniciar sesion

    // if (localStorage.getItem("word-document1") === null) {
    var documentName = "empty";
    if (Office.context.document.url != null) {
      var url = Office.context.document.url;
      documentName = url.substring(url.lastIndexOf("/") + 1);
    }

    Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 4194304 }, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        localStorage.setItem("word-document-name1", documentName);
        const file = result.value;
        console.log(`slices: ${file.sliceCount}`);
        const totalSlices = file.sliceCount;
        const doSomething = (currentSlice) =>
          new Promise((resolve) => {
            file.getSliceAsync(currentSlice, (result) => {
              if (result.status === Office.AsyncResultStatus.Succeeded) {
                const { data } = result.value;
                const indice = result.value.index;
                if (data) {
                  const buff = Buffer.from(data, "utf-8");
                  const base64 = buff.toString("base64");
                  console.log(base64);
                  localStorage.setItem(`word-document${indice + 1}`, base64);
                  //console.log(`Word to PDF y guardado en sessionStorage ${indice + 1}`);
                  resolve(currentSlice + 1 >= totalSlices ? "ok" : "no");
                }
              }

            });
            console.log("Here is " + currentSlice);
          });

        const loop = (currentSlice) =>
          doSomething(currentSlice).then((result) => {
            if (result === "ok") {
              console.log("Finished slicing");
              file.closeAsync((result) => {
                console.log(result);
                console.log(currentSlice);
              });
            } else {
              console.log(currentSlice);
              return loop(currentSlice + 1);
            }
          });

        loop(0).then(() => {
          console.log("all done!");
          document.getElementById("load-banner").style.display = "none";
          Office.context.ui.displayDialogAsync("https://nervous-aryabhata-655da7.netlify.app/app.html", {
            width: 30,
            height: 75,
          });
        });
      } else {
        document.getElementById("load-banner").style.display = "none";
        document.getElementById("main-content").innerHTML =
          "Error al transformar el documento. Recargue esta página e intente nuevamente";
        console.log("Error al cargar pdf ");
      }
    });
    await context.sync();
  });
}

export async function runExcel() {
  return Excel.run(async (context) => {
    document.getElementById("load-banner").style.display = "block";
    localStorage.setItem("outsideOffice", true);
    localStorage.setItem("userFromOffice", false);
    localStorage.setItem("noob", "0"); //garantiza que no usa info de office, ya que fue llamado desde clic en iniciar sesion

    // if (localStorage.getItem("word-document1") === null) {
    var documentName = "empty";
    if (Office.context.document.url != null) {
      var url = Office.context.document.url;
      documentName = url.substring(url.lastIndexOf("/") + 1);
    }

    Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 4194304 }, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        localStorage.setItem("word-document-name1", documentName);
        const file = result.value;
        console.log(`slices: ${file.sliceCount}`);
        const totalSlices = file.sliceCount;
        const doSomething = (currentSlice) =>
          new Promise((resolve) => {
            file.getSliceAsync(currentSlice, (result) => {
              if (result.status === Office.AsyncResultStatus.Succeeded) {
                const { data } = result.value;
                const indice = result.value.index;
                if (data) {
                  const buff = Buffer.from(data, "utf-8");
                  const base64 = buff.toString("base64");
                  console.log(base64);
                  localStorage.setItem(`word-document${indice + 1}`, base64);
                  //console.log(`Word to PDF y guardado en sessionStorage ${indice + 1}`);
                  resolve(currentSlice + 1 >= totalSlices ? "ok" : "no");
                }
              }

            });
            console.log("Here is " + currentSlice);
          });

        const loop = (currentSlice) =>
          doSomething(currentSlice).then((result) => {
            if (result === "ok") {
              console.log("Finished slicing");
              file.closeAsync((result) => {
                console.log(result);
                console.log(currentSlice);
              });
            } else {
              console.log(currentSlice);
              return loop(currentSlice + 1);
            }
          });

        loop(0).then(() => {
          console.log("all done!");
          document.getElementById("load-banner").style.display = "none";
          Office.context.ui.displayDialogAsync("https://nervous-aryabhata-655da7.netlify.app/app.html", {
            width: 30,
            height: 75,
          });
        });
      } else {
        document.getElementById("load-banner").style.display = "none";
        document.getElementById("main-content").innerHTML =
          "Error al transformar el documento. Recargue esta página e intente nuevamente";
        console.log("Error al cargar pdf ");
      }
    });
    await context.sync();
  });
}

export async function runPowerPoint() {
  return PowerPoint.run(async (context) => {
    localStorage.setItem("outsideOffice", true);
    localStorage.setItem("userFromOffice", false);
    localStorage.setItem("noob", "0"); //garantiza que no usa info de office, ya que fue llamado desde clic en iniciar sesion
    Office.context.ui.displayDialogAsync("https://nervous-aryabhata-655da7.netlify.app/app.html", {
      width: 30,
      height: 75,
    });

    // if (localStorage.getItem("word-document1") === null) {
    var documentName = "empty";
    if (Office.context.document.url != null) {
      var url = Office.context.document.url;
      documentName = url.substring(url.lastIndexOf("/") + 1);
    }

    Office.context.document.getFileAsync(Office.FileType.Pdf, { sliceSize: 4194304 }, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const file = result.value;
        console.log(`slices: ${file.sliceCount}`);
        file.getSliceAsync(0, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            const { data } = result.value;
            console.log("DATA: ");
            console.log(data);
            if (data) {
              const buff = Buffer.from(data, "utf-8");
              const base64 = buff.toString("base64");
              console.log("base64: ");
              console.log(base64);
              localStorage.setItem("word-document1", base64);
              localStorage.setItem("word-document-name1", documentName);
              console.log("PowerPoint to PDF y guardado en LocalStorage:");
              console.log(localStorage.getItem("word-document-name1"));
              console.log(localStorage.getItem("word-document1"));
              //console.log(Office.context.document.Name);
            }
          }
          file.closeAsync((result) => {
            console.log(result.status);
          });
        });
      } else {
        console.log("Error al cargar pdf ");
      }
    });
    //}//

    await context.sync();
  });
}
