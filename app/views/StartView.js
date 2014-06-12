// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "text!templates/Comment.html", "animationscheduler", "utils"],
    function ($, Backbone, Mustache, template, commentTemplate, AnimationScheduler, Utils) {

        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                var self = this;

                 if ( this.model.isFetchSuccess ) {
                    this.preloadWebfontsAndRender();
                } else {
                    this.listenTo(this.model, "fetchSuccess", this.preloadWebfontsAndRender);
                }
                
            },
            events: {
                "click #submitComment":"onClickSubmit",
                "click #like":"onClickLike"
            },
            render: function () {
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON() ));
                this.isRendered = true;
                this.trigger("render");
                return this;
            },
            postRender: function() {
                var self = this;     
                Utils.setPageTitle("你敢回答么：" + this.model.get("Text"));           
                this.backgroundMarginTop = 0 - $(".post").width() * 0.6;
                this.maxDistance = $(".post").width() * 0.1;
                this.textPadding = ($('.post').height() - $('.post-content').height()) / 2;
                
                $(".postBackground").css ({
                  "margin-top": this.backgroundMarginTop,
                  "margin-left": self.backgroundMarginTop
                });
                
                

                $(".post-content").css({
                    "padding-top":this.textPadding,
                    "padding-bottom":this.textPadding
                });
                
                this.animationScheduler = new AnimationScheduler(
                    this.$el.find(".topBanner,.post,.comments,#btnLink"),
                    {
                        "isSequential":true,
                        "sequentialDelay":500
                    }
                );
                this.foxAnimation = new AnimationScheduler(
                    this.$el.find("#btnLink-fox")
                );
                this.animationScheduler.animateIn(function(){
                  self.foxAnimation.animateIn();
                });
                
                
                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', function(eventData){
                        var distanceBeta = eventData.beta * 0.4;
                        var distanceGamma = event.gamma * 0.4;
 
                        $(".postBackground").css ({
                          "margin-top":  self.backgroundMarginTop + distanceBeta,
                          "margin-left": self.backgroundMarginTop + distanceGamma
                        });
                    
                    }, false);
                }
            },
            preloadWebfontsAndRender: function() {
                var self = this;
                self.render();
            },
            showDownloadTips: function(ev) {
                
                if ( Utils.isWechat() ) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    Backbone.history.navigate("download", { trigger: false, replace: true });
                    $("#main").addClass("blur");
                    $("#downloadOverlay").fadeIn();
                    $("#downloadOverlay").click(function(){
                        $("#main").removeClass("blur");
                        $("#downloadOverlay").fadeOut();
                            Backbone.history.navigate("", { trigger: false, replace: true });
                    });
                    
                    
                }
                _hmt.push(['_trackEvent', 'download', 'click', 'PromoCell']);
                
            },
            onClickSubmit: function(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var content = this.$el.find("#commentText").val();
                var self = this;
                if ( content && content !== "" ) {
                    this.$el.find("#commentContainer").addClass("animated fadeOutDown");
                    this.model.comment({
                        "content": content,
                        "onSuccess": function() {
                            self.appendComment(content);
                        }
                    });
                }
                
            },
            onClickLike: function(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var self = this;
                this.model.like({
                    onSuccess: function() {
                        self.toggleLike();
                    }
                });
            },
            toggleLike: function() {
                var isLiked = this.model.get("isLiked");
                var likeCount = this.model.get("LikeCount");
                
                if ( isLiked ) {
                    this.model.set("isLiked", false );
                    this.model.set("LikeCount", likeCount - 1);
                    this.$el.find(".icon-heart-liked").removeClass("icon-heart-liked").addClass("icon-heart");
                    this.$el.find("#likeCount").text(likeCount - 1);
                } else {
                    this.model.set("isLiked", true );
                    this.model.set("LikeCount", likeCount + 1);
                    this.$el.find(".icon-heart").removeClass("icon-heart").addClass("icon-heart-liked")
                    this.$el.find("#likeCount").text(likeCount + 1);
                }
            },
            appendComment: function(content) {
                var comment = _.template(commentTemplate, {});
                this.$el.find('.comments').append(Mustache.render(comment, {
                    "Text":content,
                    "UserAvatarColor": this.model.get("getRandomColorWithoutVanilla"),
                    "UserAvatarImg": this.model.get("getRandomIcon")
                } ));
                
                this.$el.find("#commentText").val("");
                
            },
            submitCommentFail: function(content) {
                
            }
        });
        return StartView;
    }

);