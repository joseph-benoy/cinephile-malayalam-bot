function getContent(url){
  let data = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(data);
  let p = $('.oi-article-rt p').text();
  let h = $(".filmibeat-article-heading").text();
  h = h.split("—").shift();
  return `*${h}*\n\n${p}`;
}

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
function sendReply(chatId,data){
  const endPoint = "https://api.telegram.org/bot1812099927:AAGU_HN_pXr6GoGHLuzNaAUfV4UazUDJsz8/sendMessage";
  const options = {
    method : "post",
    contentType: 'application/json',
    payload:JSON.stringify(data)
  };
  const response = UrlFetchApp.fetch(endPoint,options);
}
function sendChatAction(chatId){
  let data = {
    chat_id:chatId,
    action:'typing'
  };
  const endPoint = "https://api.telegram.org/bot1812099927:AAGU_HN_pXr6GoGHLuzNaAUfV4UazUDJsz8/sendChatAction";
  const options = {
    method : "post",
    contentType: 'application/json',
    payload:JSON.stringify(data)
  };
  const response = UrlFetchApp.fetch(endPoint,options);
}
function doPost(e){
  const update = JSON.parse(e.postData.contents);
  const messageText = update.message.text;
  const chatId = update.message.chat.id;
  const fullName = update.message.from.first_name+" "+update.message.from.last_name;
  let data = {};
  if(messageText=="/start"){
        sendChatAction(chatId);
        let btnMarkup = {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [['Movie Reviews']]
        };
        data = {
        text : `*Hello ${fullName}!*\nWelcome to Cinephile Malayalam bot. Choose the options from the menu accordingly.`,
        parse_mode : "markdown",
        chat_id : chatId,
        reply_markup : btnMarkup
    };
  }
  else if(messageText=="Movie Reviews"){
    sendChatAction(chatId);
        let movieList = getMovieList();
        let movieLinkList = getLinks();
        let btns = [];
        for(x of movieList){
          btns.push([{'text':x}]);
        }
        let i=0;
        for(x of movieLinkList){
          btns[i][0].callback_data = x;
          i++;
        }
        btns.push(['Back to home']);
        let btnMarkup = {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: btns
        };
        data = {
        text : `*Select movie from the list*`,
        parse_mode : "markdown",
        chat_id : chatId,
        reply_markup : btnMarkup
    };
  }
  else if(messageText=="Back to home"){
        sendChatAction(chatId);
            let btnMarkup = {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [['Movie Reviews']]
        };
        data = {
        text : `*Main Menu*`,
        parse_mode : "markdown",
        chat_id : chatId,
        reply_markup : btnMarkup
    };
  }
  else{
    sendChatAction(chatId);
    let movieList = getMovieList();
    const index = movieList.indexOf(messageText);
    if(index>-1){
      let movieLinkList = getLinks()[index];
      if(movieLinkList==""||movieLinkList==undefined){
        let btnMarkup = {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [['Back to home']]
        };
        data = {
          text : `*Sorry couldn't find any reviews for this movie. Please try again later!*`,
          parse_mode : "markdown",
          chat_id : chatId,
          reply_markup : btnMarkup
        };        
      }
      else{
        let btnMarkup = {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [['Back to home']]
        };
        let content = getContent(movieLinkList);
        data = {
          text : content,
          parse_mode : "markdown",
          chat_id : chatId,
          reply_markup : btnMarkup
        };
      }
    }
    else{
        let btnMarkup = {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [['Back to home']]
        };
        data = {
          text : `*Sorry couldn't find any reviews for this movie. Please try again later!*`,
          parse_mode : "markdown",
          chat_id : chatId,
          reply_markup : btnMarkup
        };  
    }
  }
  sendReply(chatId,data);
}