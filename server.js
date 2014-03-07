var markdownpdf = require("markdown-pdf")
  , fs = require("fs")

markdownpdf().from("/path/to/document.md").to("/path/to/document.pdf", function () {
  console.log("Done")
});
