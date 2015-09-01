console.log(' in index ');

$(function () {

    var c4vm;

    function addTempl(cb) {

        console.log('would add template ');

        var tmplData = {
            idx: ' index 4',
            containerId: 'container4'
        };

        var $tmpl = $('#cont-templ').html();
        var tmpl = Handlebars.compile($tmpl);
        var html = tmpl(tmplData);
        console.log(html);
        $('#outer').append(html);
        setTimeout(function () {
            $('#container4').draggable();
            cb();
        }, 0);

    }

    function bindTmpl() {

        console.log('would BIND template ');

        if ($.isEmptyObject(c4vm)) {
            c4vm = new ContainerViewModel();
            ko.applyBindings(c4vm, document.getElementById("container4"));
        }


    }

    $('#add').on('click', function () {

        // DO Shizzle 'n' that
        console.log(' would add template to dom ');

        // cont-templ
        addTempl(bindTmpl);
    });

    function ContainerViewModel() {

        var self = this;
        self.myItems = ko.observableArray();

        self.myItems.push(Math.random().toString());
        self.myItems.push(Math.random().toString());
        self.myItems.push(Math.random().toString());

        self.addItem = function () {
            self.myItems.push(Math.random().toString());
        };

        self.removePlace = function (place) {
            self.myItems.remove(place);
        };

        return self;
    }


    var container1VM;
    var container2VM;


    // function init() {

    console.log(' In Init ');

    $('#container1').draggable();
    $('#container2').draggable();
    $('#container3').draggable();

    //  }


    if ($.isEmptyObject(container1VM)) {
        container1VM = new ContainerViewModel();
        ko.applyBindings(container1VM, document.getElementById("container3"));
    }

    if ($.isEmptyObject(container2VM)) {
        container2VM = new ContainerViewModel();
        ko.applyBindings(container2VM, document.getElementById("container2"));
    }





    //init();
});