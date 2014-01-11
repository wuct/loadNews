var jsdom = require("jsdom");
var fs = require('fs');
var async = require('async');
 
/*
 * GET home page.
 */
exports.index = function(req, res, next){
  var TNLlink = [];
  var link;
  jsdom.env({
    url: "http://www.thenewslens.com/",
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (err, window) {
      /* save link to TNKlist array */
      if (err) return next(err);
      var $ = window.$;
      $(".panel a.pull-left").each(function(){
        TNLlink.push($(this).attr("href"));
      });
      console.log("TNLlink length :" + TNLlink.length);
 
      TNLlink.forEach(function(link){
        console.log("nothing");
        console.log(link);
        jsdom.env({
          url: link,
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (err, window) {
            if (err) return next(err);
            var $ = window.$;
            var newsArticle = "";
            var newsTitle = $("h2.entry-title").text();
            $("#zh-content p").each(function(){
              newsArticle = newsArticle + $(this).text() + "\n";
            });
            fs.writeFile("news/TNL3/" + newsTitle + ".txt", newsArticle , function(err) {
              if(err) {
                console.log(err);
              } else {
                console.log("The file was saved!");
              }
            });
          }
        });
      });
    }
  });
  res.render('index', { title: 'Express' });
};
 
 
exports.ettoday = function(req, res, next){
  var ettodayLink = [];
  var link2;
  jsdom.env({
    url: "http://www.ettoday.net/",
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (err, window) {
      /* save link to yahooList array */
      if (err) return next(err);
      var $ = window.$;
      $(".block_content h3 a").each(function(){
        link2 = $(this).attr("href").toString();
        if ( link2.indexOf("news") == 1 ) {
          ettodayLink.push("http://www.ettoday.net" + link2);
        }
      });
      console.log("ettodayLink length :" + ettodayLink.length);

      var loadTasks = [];

      ettodayLink.forEach(function(link_e){
        console.log("ettodayLink: "+link_e);

        loadTasks.push(function (cb){
	        jsdom.env({
	          url: link_e,
	          scripts: ["http://code.jquery.com/jquery.js"],
	          done: function (err, window) {
	            if (err) return next(err);
	            var $ = window.$;
	            var title = $("h2.title").text();
	            console.log(title);
	            // fs.writeFile("news/ettoday/" + title + ".txt", "ariticle \ntest" , function(err) {
	            //   if(err) {
	            //     console.log(err);
	            //   } else {
	            //     console.log("The file was saved!");
	            //   }
	            // });

	        	// done, do next tasks
	        	cb(null);
	          }
	        });
        });

      });

      async.waterfall(loadTasks);

    }
  });
  res.render('index', { title: 'ettoday' });
};