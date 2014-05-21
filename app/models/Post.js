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
            
            this.questions = options.questions;            
            if ( id ) {
                question = this.questions.findWhere({ "Id": parseInt(id) });
                if ( question ) {
                    this.set(question.toJSON());
                } else {
                    this.set(this.questions.first().toJSON());
                }
            } else {
                this.set(this.questions.first().toJSON());
            }
            
        }
    });
    
    return Post;
        
});