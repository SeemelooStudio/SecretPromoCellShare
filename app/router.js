define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var Utils = require("utils");
  //views
  var MainView = require("views/MainView");
  var mainView;
  
  var PrepareView = require("views/PrepareView");
  var prepareView;
  
  var StartView = require("views/StartView");
  var startView;
  
  var Post = require("models/Post");
  var post;

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
        mainView = new MainView();        
        prepareView = new PrepareView();
    },
    routes: {
      "": "index",
      "download":"download",
      "*action":"index"
    },

    index: function() {
        post = new Post();
        startView = new StartView({model: post});
    },
    download: function() {
        if ( Utils.isWechat() ) {
            Backbone.history.navigate("", { trigger: true, replace: true });
        } else {
            window.location.href="https://itunes.apple.com/us/app/mi-misecret/id880007797?ls=1&mt=8";
        }
        
    }
  });
});
