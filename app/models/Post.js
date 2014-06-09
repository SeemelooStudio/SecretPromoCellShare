//Post.js

define(["jquery", "backbone", "utils",'base64'],
    function($, Backbone, Utils){
    var Post = Backbone.Model.extend({
        defaults:{
            "getRandomMask": function(){
                var MaskRepo = ["Carbon", "Timber", "Disco","Haze","Twilight", "Distressed", "Metal","Tweed", "Grime", "Dream","Denim", "Glow","Plain", "Concrete"];

                return Utils.getRandomItemFromArray(MaskRepo);
            },
            "getRandomColor": function(){
                var ColorRepo = ["Cobalt", "Skyfall", "Aquamarine","Olive","Cash", "EmeraldSea", "Hopscotch","Lavender", "Burst", "Cupid","Peony", "Midnight","Vanilla"];

                return Utils.getRandomItemFromArray(ColorRepo);
            },
            "getRandomColorWithoutVanilla": function(){
                var ColorRepo = ["Cobalt", "Skyfall", "Aquamarine","Olive","Cash", "EmeraldSea", "Hopscotch","Lavender", "Burst", "Cupid","Peony", "Midnight"];

                return Utils.getRandomItemFromArray(ColorRepo);
            },
            "getRandomIcon": function(){
                var IconRepo = ["bird", "bolt", "bone","bug","clove", "coffee", "droid","ghost", "heart", "icecream","jigsaw", "meow","outlet", "owl", "pinwheel","planet", "poo", "rocket","sailboat", "shirt","skull", "spade", "star","wine"];

                return Utils.getRandomItemFromArray(IconRepo);
            }
            
        },
        url:"app/data/post.json",
        initialize: function(options){
            //get id from query string
            var id = Utils.getParameterByName("id", window.location.href);
            var uid = Utils.getParameterByName("uid", window.location.href);
            if ( !id ) {
                id = "random"
            }
            if ( !uid ) {
                uid = "secret"
            }
            this.url = this.url + "?questionid=" + id + "&" + "?uid=" + uid;
            
        }
    });
    
    return Post;
        
});