// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "utils"],
    function ($, Backbone, Mustache, template, AnimationScheduler, Utils) {

        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                var self = this;
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
            },
            events: {

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
                this.backgroundMarginTop = 0 - $(".post").width() / 2;
                this.textPadding = ($('.post').height() - $('.post-content').height()) / 2;
                
                $(".postBackground").css ({
                  "margin-top": this.backgroundMarginTop 
                });
                
                

                $(".post-content").css({
                    "padding-top":this.textPadding,
                    "padding-bottom":this.textPadding
                });
                
                this.animationScheduler = new AnimationScheduler(
                    this.$el.find(".topBanner,.post,.comments,#btnLink,.qrcode"),
                    {
                        "isSequential":true,
                        "sequentialDelay":1000
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
                        $(".postBackground").css ({
                          "margin-top": self.backgroundMarginTop + eventData.beta * 0.5
                        });
                    
                    }, false);
                }
            },
            preloadWebfontsAndRender: function() {
                var self = this;
                self.render();
            }
        });
        return StartView;
    }

);