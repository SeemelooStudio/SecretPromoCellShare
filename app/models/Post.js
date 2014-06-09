//Post.js

define(["jquery", "backbone", "utils",'base64'],
    function($, Backbone, Utils){
    var Post = Backbone.Model.extend({
        defaults:{

            
        },
        initialize: function(options){
            //get id from query string
            var id = Utils.getParameterByName("id", window.location.href);
            var question;
            var index;
            
            this.questions = options.questions;            
            if ( id ) {
                question = this.questions.findWhere({ "Id": id });
                
            } else {
                index = Math.floor(Math.random() * this.questions.length);
                question = this.questions.at(index);
            }
            
            if ( question ) {
                    this.set(question.toJSON());
            } else {
                    index = Math.floor(Math.random() * this.questions.length);
                    this.set(this.questions.at(index).toJSON());
            }
            
            shareInfo.desc = this.get("shareText");
            shareInfo.img_url = this.get("BackgroundImageUrl");
            
        }
    });
    
    return Post;
        
});