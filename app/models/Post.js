//Post.js

define(["jquery", "backbone", "utils","collections/Questions"],
    function($, Backbone, Utils, Questions){
    var Post = Backbone.Model.extend({
        defaults:{
            "LikeCount":0,
            "CommentCount":0,
            "Comments":[],
            "isStatic":true,
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
            },
            "getTime": function() {
                return "1天前";
            }
            
        },

        initialize: function(options){
            this.isFetchSuccess = false;
            var self = this;
            //get id from query string
            this.questionId = Utils.getParameterByName("id", window.location.href);
            this.postId = Utils.getParameterByName("uid", window.location.href);
            this.openId = Utils.getParameterByName("openid", window.location.href);
            
            if ( ! this.questionId ) {
                this.questionId = Utils.getParameterByName("questionid", window.location.href);
            }
            if ( !this.postId ) {
                this.postId = Utils.getParameterByName("userid", window.location.href);
            }
            if ( !this.postId ) {
                //load static questions
                this.questions = new Questions();
                this.questions.fetch({
                   success: function() {
                       self.setStaticQuestionById(this.questionId);
                       self.trigger("fetchSuccess");
                       self.isFetchSuccess = true;
                   },
                   error: function() {
                       
                   }
                });
                
            } else if ( !this.openId ) {
                this.login();
            } else {
                this.url = "app/data/questions.json?questionid=" + this.questionId + "&" + "?postid=" + this.postId;
                this.fetchData();
                
            }
            
        },
        setStaticQuestionById: function(id) {
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
        },
        fetchData: function() {
            var self = this;
            var url = "http://secret.fimvisual.com/index.php/Home/Index/Post/questionid/" + this.questionId + "/userid/" + this.postId + "/";
            console.log(url);
            $.ajax({
                  url: url,
                  //url: "app/data/openid.json",
                  type : "get",
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    console.log(data);
                    self.set(data);
                    self.checkLike();
                    self.set("isStatic", false);
                    self.trigger("fetchSuccess");
                    self.isFetchSuccess = true;
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus);
                        if ( options.onError ) {
                            options.onError(textStatus);
                        }
                  }
            });
        },
        login: function() {
            var parma = "?userid=" + this.postId + "&questionid=" + this.questionId;
            
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4430f486fe653764&redirect_uri=http%3A%2F%2Fwww.fimvisual.com%2Fwx.php" + encodeURIComponent(parma) + "&response_type=code&scope=snsapi_base&state=data#wechat_redirect";
        },
        getOpenId: function(options) {
                var self = this;
                $.ajax({
                  url: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4430f486fe653764&redirect_uri=http%3A%2F%2Fwww.fimvisual.com%2Fwx.php&response_type=code&scope=snsapi_base&state=data#wechat_redirect",
                  //url: "app/data/openid.json",
                  type : "get",
                  dataType: "json",
                  success: function(data, textStatus, jqXHR){
                    alert(data.openid);
                    if( data && data.openid) {
                        self.set("openid", data.openid);
                        
                    } else {
                        if ( options.onError ) {
                            options.onError();
                        }
                    }
                    
                      
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus);
                        if ( options.onError ) {
                            options.onError(textStatus);
                        }
                  }
                }); 
        },
        comment: function(options) {
            var self = this;
            $.ajax({
                  url: "http://secret.fimvisual.com/index.php/Home/Index/Comment/",
                  //url: "app/data/openid.json",
                  type : "post",
                  data: {
                      "questionid":this.questionId,
                      "userid":this.postId,
                      "openid":this.openId,
                      "content":options.content
                  },
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    console.log(data);
                    options.onSuccess(options.content);
                      
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    console.log(textStatus);
            
                  }
            }); 
        },
        like: function(options) {
            var self = this;
            $.ajax({
                  url: "http://secret.fimvisual.com/index.php/Home/Index/Like/",
                  //url: "app/data/openid.json",
                  type : "post",
                  data: {
                      "questionid": this.questionId,
                      "userid": this.postId,
                      "openid": this.openId
                  },
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    console.log(data);
                    if ( options && options.onSuccess ) {
                        options.onSuccess();
                    }
                      
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    console.log(textStatus);

                  }                
            });
        },
        checkLike: function() {
            var self = this;
            var url = "http://secret.fimvisual.com/index.php/Home/Index/Like/questionid/" + this.questionId + "/userid/" + this.postId + "/openid/" + this.openId  + "/checklike/1/";
            $.ajax({
               url: url,
               type: "get",
               dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    console.log(data);
                    if ( data.status === 1 ) {
                        self.set("isLiked", true);
                    } else {
                        self.set("isLiked", false);
                    }
                    self.trigger("fetchSuccess");
                    self.isFetchSuccess = true;
                    
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    console.log(textStatus);

                  }
            });
        }
        
    });
    
    return Post;
        
});