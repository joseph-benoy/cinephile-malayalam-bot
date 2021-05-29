function getLinks() {
    const response = UrlFetchApp.fetch("https://malayalam.filmibeat.com/reviews/");
    const $ = Cheerio.load(response.getContentText());
    let links = [];
    $("a").each(function(){
      var link = $(this).attr('href');
      if(link.startsWith("/reviews")&&link.endsWith(".html")){
        links.push(link);
      }
    });
    links = [...new Set(links)];
    
  
  }