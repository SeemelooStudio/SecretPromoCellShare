// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "utils"],
    function ($, Backbone, Mustache, template, AnimationScheduler, Utils) {

        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                var self = this;
                /*
                if ( this.model.has("BackgroundImageUrl") ) {
                    var img = new Image();
                    img.onerror = function (err) {
                        self.preloadWebfontsAndRender();
                    };
                    img.onload = function(evt){
                        self.preloadWebfontsAndRender();
                    };
                    img.src = this.model.get("BackgroundImageUrl");                    
                
                } else {
                    this.preloadWebfontsAndRender();
                }
                */
                this.preloadWebfontsAndRender();
            },
            events: {
                "click #btnLink": "showDownloadTips"
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
                
            }
        });
        return StartView;
    }

);