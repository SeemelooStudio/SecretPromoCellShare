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
                Utils.setPageTitle(this.model.get("Text"));
                
                this.animationScheduler = new AnimationScheduler(
                    this.$el.find(".logo-right,.topBanner-content,.post-content"),
                    {
                        "isSequential":true,
                        "sequentialDelay":1000
                    }
                );
                this.animationScheduler.animateIn(function(){
                    self.$el.find(".container").addClass("boxShadow");
                });
            },
            preloadWebfontsAndRender: function() {
                var self = this;
                self.render();
            }
        });
        return StartView;
    }

);