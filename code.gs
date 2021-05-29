function getLinks() {
    const response = UrlFetchApp.fetch("https://malayalam.filmibeat.com/reviews/");
    const $ = Cheerio.load(response.getContentText());
    let links = [];
    $("a").each(function () {
      var link = $(this).attr('href');
      if (link.startsWith("/reviews") && link.endsWith(".html")) {
        links.push(link);
      }
    });
    links = [...new Set(links)];
    let fullLinks = [];
    for (x of links) {
      fullLinks.push("https://malayalam.filmibeat.com" + x);
    }
    return fullLinks;
  }
  function getMovieList() {
    const response = UrlFetchApp.fetch("https://malayalam.filmibeat.com/reviews/");
    const $ = Cheerio.load(response.getContentText());
    let movieList = [];
    $('img').each(function(){
      var altText = $(this).attr('alt');
      if(altText!=undefined){
        if(altText.indexOf("Movie")>0){
          altText = altText.substr(0,altText.indexOf(" Movie"));
          movieList.push(altText);
        }
      }
    });
    return movieList;
  }  