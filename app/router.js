define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  //views
  var MainView = require("views/MainView");
  var mainView;
  
  var PrepareView = require("views/PrepareView");
  var prepareView;
  
  var StartView = require("views/StartView");
  var startView;

  var Questions = require("collections/Questions");
  var questions;
  
  var Post = require("models/Post");
  var post;

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
        mainView = new MainView();        
        prepareView = new PrepareView();
        questions = new Questions();
    },
    routes: {
      "": "index",
      "*action":"index"
    },

    index: function() {
        questions.fetch({
            success: function(){
                post = new Post({questions: questions});
                startView = new StartView({model: post});
            }
        });
    }
  });
});
