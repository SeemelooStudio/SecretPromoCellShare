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
            "isPost":false,
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
            
            if ( ! this.questionId  ) {
                this.questionId = Utils.getParameterByName("questionid", window.location.href);
            }
            if ( !this.postId ) {
                this.postId = Utils.getParameterByName("userid", window.location.href);
            }
            if ( (!this.questionId) || this.questionId ==="XXX" || this.questionId ==="groupl-rl-1" ) {
                window.location.href="http://secret-ajax.hortor.net/impress/";
            }
            if ( this.questionId==="groupvalen-rl-1" || this.questionId ==="777" ) {
                window.location.href="http://secret-ajax.hortor.net/valentine/";
            }
            if ( (!this.postId)) {
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
                            self.set("isPost", true);
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
                            self.set("isPost", true);
                        }
                });
                shareInfo.link = window.location.hostname + window.location.pathname +  "?questionid="+ this.questionId + "&userid=" + this.postId;
                
            }
            
        },
        setStaticQuestionById: function(options) {
            if ( !this.questionId ) {
                this.questionId = "random"; 
            }
            var self = this;
            var url = "http://seemeloo.hortor.net/index.php";
            $.ajax({
                  url: url,
                  data:{
                    "m":"home",
                    "c":"index",
                    "a":"question",
                    "questionid":this.questionId,
                  },
                  //url: "app/data/openid.json",
                  type : "get",
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    if ( data.QuestionId != self.questionId ) {
                        window.location.href="http://secret-ajax.hortor.net/impress/";
                    } else {
                       self.set(data);
                        if ( options && options.onSuccess ) {
                            options.onSuccess();
                        }  
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
            var url = "http://seemeloo.hortor.net/index.php";
            $.ajax({
                  url: url,
                  data:{
                    "m":"home",
                    "c":"index",
                    "a":"post",
                    "questionid":this.questionId,
                    "userid":this.postId
                  },
                  type : "get",
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
                    if ( data.Text ) {
                        self.set(data);
                        if ( self.get("CommentCount") > 0 ) {
                            shareInfo.title = "你有" + self.get("CommentCount") + "个朋友回答了这个问题，你呢？";
                        }
                        if ( options && options.onSuccess ) {
                            options.onSuccess();
                        } 
                    } else {
                        window.location.href="http://secret-ajax.hortor.net/impress/";
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
            window.setTimeout( function(){
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4430f486fe653764&redirect_uri=http%3A%2F%2Fseemeloo.hortor.net%2Fwx.php" + encodeURIComponent(parma) + "&response_type=code&scope=snsapi_base&state=data#wechat_redirect";
            },0);
            
        },
        comment: function(options) {
            var self = this;
            $.ajax({
                  url: "http://seemeloo.hortor.net/index.php",
                  //url: "app/data/openid.json",
                  type : "post",
                  data: {
                        "m":"home",
                        "c":"index",
                        "a":"comment",
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
                  url: "http://seemeloo.hortor.net/index.php",
                  //url: "app/data/openid.json",
                  type : "post",
                  data: {
                        "m":"home",
                        "c":"index",
                        "a":"like",
                      "questionid": this.questionId,
                      "userid": this.postId,
                      "openid": this.openId
                  },
                  dataType: "jsonp",
                  success: function(data, textStatus, jqXHR){
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
            var url = "http://seemeloo.hortor.net/index.php";
            $.ajax({
               url: url,
               type: "get",
               data: {
                        "m":"home",
                        "c":"index",
                        "a":"like",
                      "questionid": this.questionId,
                      "userid": this.postId,
                      "openid": this.openId,
                      "checklike":1
               },
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