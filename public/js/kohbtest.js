(function () {


    var widgets = {};

    function init() {




        console.log(' Init');

        //var $wc = $('#testcontainer');
        //var widgetTemplateScript = $('#test-template').html();
        //var widgetTemplate ;
        //for (var i = 1; i < 5; i++) {
        //
        //    var data = {
        //            blah2: 'some-id',
        //            blah3: 'A Title 1 ' + i
        //    };
        //
        //    widgetTemplate = Handlebars.compile(widgetTemplateScript);
        //    $wc.append(widgetTemplate(data));
        //}


        var i = 17;
        var $wc = $('#testcontainer');
        var widgetTemplateScript = $('#test-template').html();
        var widgetTemplate;

        var data = {
                blah2: 'some-id',
                blah3: 'A Title 1 ' + i
        };
        widgetTemplate = Handlebars.compile(widgetTemplateScript);
        var precompiled = widgetTemplate(data);

        console.log(precompiled);

        /* ---- Begin integration of Underscore template engine with Knockout. Could go in a separate file of course. ---- */
        ko.handlebarsTemplateEngine = function () {};

        ko.handlebarsTemplateEngine.prototype = ko.utils.extend(new ko.templateEngine(), {

            renderTemplateSource: function (templateSource, bindingContext, options) {

                // Precompile and cache the templates for efficiency

                // Run the template and parse its output into an array of DOM elements
                var renderedMarkup = precompiled(bindingContext).replace(/\s+/g, " ");
                return ko.utils.parseHtmlFragment(renderedMarkup);
            },
            createJavaScriptEvaluatorBlock: function (script) {
                return "{{ " + script + " }}";
            }
        });
        ko.setTemplateEngine(new ko.handlebarsTemplateEngine());
        /* ---- End integration of Handlebars template engine with Knockout ---- */

        var viewModel = {
            people: ko.observableArray([
                {name: 'Rod', age: 123},
                {name: 'Jane', age: 125}
            ])
        };

        var blah = ko.applyBindings(viewModel);

        console.log(blah);
        // if (false) {
             $wc.append(precompiled);
        // }

    }



    $(function() {
        init();

        console.log(ko);




        // THIS CODE is from the KO Site
        if (false) {
            /* ---- Begin integration of Underscore template engine with Knockout. Could go in a separate file of course. ---- */
            ko.handlebarsTemplateEngine = function () {
            };

            ko.handlebarsTemplateEngine.prototype = ko.utils.extend(new ko.templateEngine(), {

                renderTemplateSource: function (templateSource, bindingContext, options) {

                    // Precompile and cache the templates for efficiency

                    var precompiled = templateSource['data']('precompiled');
                    if (!precompiled) {
                        precompiled = _.template("<% with($data) { %> " + templateSource.text() + " <% } %>");
                        templateSource['data']('precompiled', precompiled);
                    }
                    // Run the template and parse its output into an array of DOM elements
                    var renderedMarkup = precompiled(bindingContext).replace(/\s+/g, " ");
                    return ko.utils.parseHtmlFragment(renderedMarkup);
                },
                createJavaScriptEvaluatorBlock: function (script) {
                    return "<%= " + script + " %>";
                }
            });
            ko.setTemplateEngine(new ko.handlebarsTemplateEngine());
            /* ---- End integration of Underscore template engine with Knockout ---- */

            var viewModel = {
                people: ko.observableArray([
                    {name: 'Rod', age: 123},
                    {name: 'Jane', age: 125}
                ])
            };

            ko.applyBindings(viewModel);
        }
    });


})();