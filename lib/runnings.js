exports.header = null

exports.footer = {
  height: "1cm",
  contents: function(pageNum, numPages) {
    if (numPages == 1) {
      return "";
    }
    return "<div class='pageCount' style='position:absolute;bottom:0;width:100%;text-align:center;font-size:0.6rem;font-family:\"Open Sans\", Helvetica, Arial, sans-serif;'>" + 
        "<span class='pageNum'>" + pageNum + "</span>" + 
        "<span class='sep'> of </span>" + 
        "<span class='numPages'>" + numPages + "</span>" +
      "</div>";
  }
}