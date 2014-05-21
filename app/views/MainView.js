define(["jquery", "backbone", "animationscheduler", "utils"],
    function ($, Backbone, AnimationScheduler, Utils) {
        var MainView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "body",
            // View constructor
            initialize: function (options) {
                            },
            // View Event Handlers
            events: {

            }
        });
        // Returns the View class
        return MainView;
    }
);