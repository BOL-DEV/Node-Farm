/////////////
// Introduction

// const BOL = "He is Cool"
// console.log(BOL);

const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

// console.log(url);

/////////////////////////////////
//// FILES

/*
// Blocking/Synchronous way
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(text);

const textOut = `This is all we know about avocado: ${textIn} .\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/Output.txt", textOut);
console.log("Written");


//Non blockng/Asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("ERROR: 🎇", err);

  fs.readFile(`./txt/${data1}.txt`, "utf-8", (_, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (_, data) => {
      console.log(data);

      fs.writeFile("./txt/final.txt", `${data2}\n${data}`, (err) => {
        console.log("File is successfully created");
      });
    });
  });
});

console.log("Calm down jare");

*/

/////////////////////////////////
//// SERVERS

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);

// console.log(dataObj);

const server = http.createServer((req, res) => {
  // console.log(res);

  const { query, pathname: pathName } = url.parse(req.url, true);

  // const pathName = req.url;

  //Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

    res.end(output);
  }
  //Product page
  else if (pathName === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }
  // API
  else if (pathName === "/api") {
    res.end(data);

    /*
    fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (_, data) => {
      // console.log(data);

      const productData = JSON.parse(data);
      console.log(productData);
      res.end(data);
    });
*/
    // res.end("API");
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-head": "hello-world",
    });
    res.end("This page can not be found");
  }
});

server.listen(4004, "127.0.0.1", () => {
  console.log("Listening to requests on port 4004");
});
