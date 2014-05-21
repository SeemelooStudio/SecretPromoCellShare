// Questions.js

define(["jquery", "backbone"],

    function ($, Backbone) {
        var Question = Backbone.Model.extend({
            idAttribute: "Id"
        });
        var Questions = Backbone.Collection.extend({
            url: function() {
               return "app/data/questions.json";
            },
            model:Question
        });

        return Questions;
    }

);