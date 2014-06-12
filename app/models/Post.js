//Post.js

define(["jquery", "backbone", "utils","collections/Questions"],
    function($, Backbone, Utils, Questions){
    var startIndex = 0;
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
                return function(ts, render) {
                    var timeStr = "";
                    var now = (new Date()).getTime();
                    var duration = Math.floor((now / 1000 - render(ts) ));
                    if ( duration < 60 ) {
                        timeStr = "刚刚";
                    } else if ( duration < 3600 ) {
                        timeStr = Math.floor( duration / 60 ) + "分钟前";
                    } else if ( duration < 3600 * 24 ) {
                        timeStr = Math.floor( duration / 3600 ) + "小时前";
                    } else if ( duration < 3600 * 24 * 30 ) {
                        timeStr = Math.floor( duration / 3600 / 24 ) + "个月前";
                    } else {
                        timeStr = "1年前";
                    }
                    return timeStr;
                };
                
                
            },
            "getIndex": function() {
                return ++startIndex;
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
                self.setStaticQuestionById({
                           "onSuccess": function() {
                               self.set("isStatic", true);
                               self.trigger("fetchSuccess");
                               self.isFetchSuccess = true;
                           }
                });
                
            } else if ( !this.openId ) {
                if ( Utils.isWechat() ) {
                    this.login();
                } else {
                    this.fetchData({
                        onSuccess: function() {
                            self.set("isStatic", true);
                            self.trigger("fetchSuccess");
                            self.isFetchSuccess = true;
                        }
                    });
                }
                
            } else {
                this.fetchData({
                        onSuccess: function() {
                            self.checkLike();
                            self.set("isStatic", false);
                        }
                });
                
            }
            
        },
        setStaticQuestionById: function(options) {
            if ( !this.questionId ) {
                this.questionId = "random"; 
            }
            var self = this;
            var url = "http://secret.fimvisual.com/index.php/Home/Index/Question/questionid/" + this.questionId ;
            $.ajax({
                  url: url,
                  //url: "app/data/openid.json",
                  type : "get",
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    self.set(data);
                    if ( options && options.onSuccess ) {
                        options.onSuccess();
                    }                    
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    if ( options & options.onError ) {
                        options.onError(textStatus);
                    }
                  }
            });         
        },
        fetchData: function(options) {
            var self = this;
            var url = "http://secret.fimvisual.com/index.php/Home/Index/Post/questionid/" + this.questionId + "/userid/" + this.postId + "/";
            $.ajax({
                  url: url,
                  //url: "app/data/openid.json",
                  type : "get",
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    self.set(data);
                    if ( options && options.onSuccess ) {
                        options.onSuccess();
                    }                    
                  },
                  error: function(jqXHR, textStatus, errorThrown){
                    if ( options & options.onError ) {
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
                    options.onSuccess(options.content);
                      
                  },
                  error: function(jqXHR, textStatus, errorThrown){
            
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