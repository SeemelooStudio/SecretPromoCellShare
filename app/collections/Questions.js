// Questions.js

define(["jquery", "backbone"],

    function ($, Backbone) {
        var Question = Backbone.Model.extend({
            idAttribute: "Id"
        });
        var Questions = Backbone.Collection.extend({
            url: function() {
               return "app/data/questions.json?v=2";
            },
            model:Question
        });

        return Questions;
    }

);