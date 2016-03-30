hideSideBar();
$('document').ready(function () {
    $.ajaxSetup({
        error: function () {
            bootbox.alert('Có lỗi xảy ra vui lòng kiểm tra lại');
        }
    });
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'fast',
        showCount: false,
        autoExpand: true,
//        cookie: 'dcjq-accordion-1',
        classExpand: 'dcjq-current-parent'
    });

    //sidebar dropdown menu auto scrolling
    jQuery('#sidebar .sub-menu > a').click(function () {
        var o = ($(this).offset());
        diff = 250 - o.top;
        if (diff > 0)
            $("#sidebar").scrollTo("-=" + Math.abs(diff), 500);
        else
            $("#sidebar").scrollTo("+=" + Math.abs(diff), 500);
    });

    //sidebar toggle
    $(function () {
        function responsiveView() {
            var isForceHide = $('ul#nav-accordion').hasClass('forceHide'),
                    wSize = $(window).width();

            if (wSize <= 768 && !isForceHide) {
                $('.colProductName').css('width', '100%');
                $('#container').addClass('sidebar-close');
                $('#sidebar > ul').hide();
            }

            if (wSize > 768 && !isForceHide) {
                $('.colProductName').css('width', '25%');
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
            }
        }
        $(window).on('load', responsiveView);
        $(window).on('resize', responsiveView);
    });

    $('#leftMenuToggle').click(function () {
        $('ul#nav-accordion').removeClass('forceHide');
        if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
            $("#sidebar").niceScroll({styler: "fb", cursorcolor: "#e8403f", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled: false, cursorborder: '', scrollspeed: '120'});
        }
    });
    // custom scrollbar


    // widget tools
    jQuery('.panel .tools .fa-chevron-down').click(function () {
        var el = jQuery(this).parents(".panel").children(".panel-body");
        if (jQuery(this).hasClass("fa-chevron-down")) {
            jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });
    jQuery('.panel .tools .fa-remove').click(function () {
        jQuery(this).parents(".panel").parent().remove();
    });
//    tool tips
    $('body').tooltip({
        selector: '.tooltips'
    });
//    popovers
    $('.popovers').popover();

    /**
     * input mask
     */
    if ($('.date-mask').length) {
        $('.date-mask').inputmask({"mask": "99/99/9999"});
    }
});

function responsiveTable(arrWidth, tableElem, center) {
    center = typeof center !== 'undefined' ? center : false;
    var tableHeader = tableElem.find('th');
    if (arrWidth.length !== 0) {
        $.each(tableHeader, function (k, v) {
            $(v).css({
                'width': arrWidth[k] + '%',
                'text-align': center === true ? 'center' : ''
            });
        });
    } else {
        $.each(tableHeader, function (k, v) {
            $(v).css({
                'width': 'auto',
                'text-align': center === true ? 'center' : ''
            });
        });
    }
}
function hideSideBar() {
    $(document).ready(function () {
        $('#sidebar').css({
            'marginLeft': '-210px',
            'overflow': 'hidden',
            'outline': 'none'
        });
        $('#main-content').css('marginLeft', '0px');
        setTimeout(function () {
            $('#sidebar > ul').hide();
        }, 1000);
    });
}
function clearForm(ele) {
    $(ele).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}
function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
var dates = {
    convert: function (d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year, d.month, d.date) :
                NaN
                );
    },
    compare: function (a, b) {
        return (
                isFinite(a = this.convert(a).valueOf()) &&
                isFinite(b = this.convert(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
                );
    },
    inRange: function (d, start, end) {
        return (
                isFinite(d = this.convert(d).valueOf()) &&
                isFinite(start = this.convert(start).valueOf()) &&
                isFinite(end = this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
                );
    }
};