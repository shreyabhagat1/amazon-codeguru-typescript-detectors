function retrieveProduct(x: any) {}
function sanitizer(x: any): boolean {
  return true;
}

// {fact rule=path-traversal@v1.0 defects=1}
var express = require("express");
var app = express();
var path = require("path");
function pathTraversalNoncompliant() {
  app.get(
    "/products",
    (req: { query: { path: any } }, res: { send: (arg0: string) => void }) => {
      const basePath = "/data/product/images/";
      // Noncompliant: user-supplied path is not sanitized and could contain malicious characters.
      var targetPath = path.join(basePath, req.query.path);
      retrieveProduct(targetPath);
      res.send("Here is your requested product!");
    },
  );
}
// {/fact}

// {fact rule=path-traversal@v1.0 defects=0}
var express = require("express");
var app = express();
var path = require("path");

function pathTraversalCompliant() {
  app.get(
    "/products",
    (req: { query: { path: any } }, res: { send: (arg0: string) => void }) => {
      const basePath = "/data/product/images/";
      // Compliant: user-supplied relative-path is sanitized.
      const queryPath = sanitizer(req.query.path);
      if (queryPath) {
        const targetPath = path.join(basePath, queryPath);
        retrieveProduct(targetPath);
        res.send("Here is your requested product!");
      } else res.send("Invalid product!");
    },
  );
}
// {/fact}
