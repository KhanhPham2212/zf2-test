var General = {
    backlink: function () {
        $(document).ready(function () {
            initEditor('textarea#backlink');
        });
    },
    sendMailToAllCustomer: function () {
        $(document).ready(function () {
            $("input[name='email']").tagsInput();
            $('#email').hide();
            $("#frm").validate({
                ignore: '',
                rules: {
                    subject: {required: true, minlength: 3, maxlength: 255},
                }, messages: {
                    subject: {
                        required: 'Xin vui lòng nhập tiêu đề mail.',
                        minlength: 'tiêu đề tin tức tối thiểu từ 3 kí tự trở lên.',
                        maxlength: 'tiêu đề tin tức tối đa 255 kí tự.'
                    }
                }
            });

            $("input[name='htmlFile']").change(function () {
                $(this).parent().prev('input').val($(this).val());
            });

            initEditor('textarea#body');

            $('#type').change(function () {
                var type = parseInt($(this).val());
                if (type === 1) {
                    $('#email').hide();
                    $("input[name='email']").attr('disabled', 'disabled');
                }
                if (type === 2) {
                    $('#email').show();
                    $("input[name='email']").removeAttr('disabled');
                }
            });

            $('#contentType').change(function () {
                var type = parseInt($(this).val());
                if (type === 1) {
                    $('#uploadHTML').hide();
                    $('textarea#body').removeAttr('disabled').show();
                    initEditor('textarea#body');
                }
                if (type === 2) {
                    tinyMCE.remove('textarea#body');
                    $('textarea#body').attr('disabled', 'disabled').hide();
                    $('#uploadHTML').show();
                }
            });

            $('.btnSendMail').click(function () {
                if (!$("div.tagsinput").is(':hidden')) {
                    var email = $.trim($('input.tagsinput').val());
                    if (!email) {
                        return bootbox.alert('<b>Vui lòng nhập email cần gửi.</b>');
                    }
                    var arrEmail = email.split(',');
                    var invalidEmail = 0;
                    $.each(arrEmail, function (k, v) {
                        if (IsEmail(v) === false) {
                            invalidEmail += 1;
                        }
                    });
                    if (invalidEmail > 0) {
                        return bootbox.alert('<b>Có <span style="color:red;">' + invalidEmail + '</span> email không chính xác, xin vui lòng kiểm tra lại.</b>');
                    }
                }
                if ($('#code-promotion').val() == 1 && $('input[name="event-name"]').val() == '') {
                    return bootbox.alert('<b>Vui lòng nhập tên event</b>');
                }

                if (!$("input[name='htmlFile']").is(':hidden')) {
                    var htmlFile = $("input[name='htmlFile']").val();
                    if (!htmlFile) {
                        return bootbox.alert('<b>Vui lòng chọn tệp tin HTML.</b>');
                    }
                    var parts = htmlFile.split('.');
                    var fileType = parts[parts.length - 1];
                    if (fileType !== 'html') {
                        return bootbox.alert('<b>Định dạng tệp tin HTML không chính xác.</b>');
                    }
                }
                if ($('.mce-tinymce').length > 0 && $("input[name='htmlFile']").is(':hidden')) {
                    var mailContent = tinyMCE.activeEditor.getContent({format: 'text'});
                    if (!mailContent) {
                        return bootbox.alert('<b>Nội dung email không được để trống.</b>');
                    }
                }
                $("#frm").submit();
            });

            $('#code-promotion').change(function () {
                var promotion = parseInt($(this).val());
                if (promotion === 1) {
                    bootbox.prompt("Vui lòng nhập tên event", function (result) {
                        if (result !== null) {
                            $('input[name="event-name"]').val(result);
                        } else {
                            $('input[name="event-name"]').val('');
                        }
                    });
                }
            });
        });
    },
    botMonitor: function () {
        $(document).ready(function () {
            monitor();
            Highcharts.setOptions({
                global: {useUTC: false}
            });
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'process',
                    type: 'spline',
                    marginRight: 10
                },
                title: {
                    text: 'Live process running'
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    min: 0,
                    title: {text: 'Value'},
                    plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                },
                tooltip: {
                    pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
                },
                legend: {
                    enabled: true
                },
                exporting: {
                    enabled: false
                },
                series: [
                    {
                        name: 'Process running',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                    time = (new Date()).getTime(),
                                    i;

                            for (i = -15; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1000,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    },
                    {
                        name: 'CPU Usage (%)',
                        color: '#FF0000',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                    time = (new Date()).getTime(),
                                    i;

                            for (i = -15; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1000,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    },
                    {
                        name: 'Memory Usage (%)',
                        color: '#FCB322',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                    time = (new Date()).getTime(),
                                    i;

                            for (i = -15; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1000,
                                    y: 0
                                });
                            }
                            return data;
                        }())
                    }
                ]
            });

            $('#rebootBOT').click(function () {
                bootbox.confirm('<center id="botToken"><input class="form form-control" type="text" style="width:500px;" placeholder="Vui lòng nhập token" /></center>', function (result) {
                    if (result) {
                        var token = $('#botToken').children('input').val();
                        $.ajax({
                            url: baseurl + '/backend/general/bot-monitor',
                            type: "POST",
                            dataType: "JSON",
                            async: true,
                            cache: false,
                            data: {token: token, action: 'reboot-bot'},
                            beforeSend: function () {
                                bootbox.dialog({
                                    message: '<center id="rebootProgress"><img src="http://static.amazon247.vn/f/v1/images/loading-bar.gif" /></center>',
                                    buttons: {success: {label: "Hoàn tất", className: "btn-primary btnProgress"}}
                                });
                                $('.bootbox-close-button').remove();
                                $('.btnProgress').attr('disabled', 'disabled');
                            },
                            success: function (data) {
                                if (data.st == -1) {
                                    return bootbox.alert('' + data.msg + '');
                                }
                                if (data.error === 1) {
                                    $('.btnProgress').removeAttr('disabled');
                                    return $('#rebootProgress').html('<div class="alert alert-danger" role="alert">Xảy ra lỗi trong quá trình xử lý, vui lòng kiểm tra lại.<p><b>message: ' + data.message + '</b></p></div>');
                                }
                                $('#rebootProgress').html('<img src="http://static.amazon247.vn/f/v1/images/loading-bar.gif" /><p><b>' + data.message + '</b></p>');
                                var rebootComplete = setInterval(function () {
                                    $.ajax({
                                        url: baseurl + '/backend/general/bot-monitor',
                                        type: "POST",
                                        dataType: "JSON",
                                        async: true,
                                        cache: false,
                                        data: {token: token, action: 'reboot-progressing'},
                                        success: function (data) {
                                            if (data.st == -1) {
                                                return bootbox.alert('' + data.msg + '');
                                            }
                                            if (data.success === 1) {
                                                clearInterval(rebootComplete);
                                                $('.btnProgress').removeAttr('disabled');
                                                return $('#rebootProgress').html('<div class="alert alert-success" role="alert"><b>Reboot Completed.</b></div>');
                                            }

                                        }
                                    });
                                }, 2000);

                            }
                        });
                    }
                });
            });
            setInterval(function () {
                monitor(chart);
            }, 3000);
        });
    }
};
function checkAliveProxy(proxy) {
    if (proxy && typeof proxy !== 'undefined') {
        bootbox.alert('<center id="proxyStatus"><img src="http://static.amazon247.vn/f/v1/images/loading-bar.gif" /></center>');
        $.ajax({
            url: baseurl + '/backend/general/bot-monitor',
            type: "POST",
            dataType: "JSON",
            async: true,
            cache: false,
            data: {proxy: proxy, action: 'check-alive-proxy'},
            success: function (data) {
                if (data.st == -1) {
                    return bootbox.alert('' + data.msg + '');
                }
                var style = data.message === 'PASSED' ? 'color:green;' : 'color:red;';
                $('#proxyStatus').html('<p>status: <b style="' + style + '">' + data.message + '</b> </p>');
                if (data.message === 'PASSED') {
                    $('#proxyStatus').append('<p>Response Time: <b>' + data.respondTime + 'ms</b> </p>');
                }
            }
        });
    }
}

function monitor(renderChart) {
    renderChart = typeof renderChart === 'undefined' ? false : true;
    $.ajax({
        url: bot + "/monitor.php",
        type: "GET",
        dataType: "jsonp",
        crossDomain: true,
        jsonp: "callback",
        async: true,
        cache: false,
        data: {'publicKey': publicKey},
        success: function (data) {
            if (data && typeof data !== 'undefined') {
                var html = '<tr><td colspan="2" style="text-align:center;">Hiện tại chưa có proxy nào</td></tr>';
                $('#proxyAddToCartLength').text('0');
                if (Object.keys(data.proxy_addToCart).length > 0) {
                    $('#proxyAddToCartLength').text(data.total_proxy_addToCart);
                    var html = '';
                    $.each(data.proxy_addToCart, function (k, v) {
                        var arrProxy = v.split(':');
                        html += '<tr>'
                                + '<td>' + v + '</td>'
                                + '<td>'
                                + '<a href="http://www.ip-tracker.org/locator/ip-lookup.php?ip=' + arrProxy[0] + '" target="_blank">IP Lookup</a> | '
                                + '<a class="checkAlive" style="cursor:pointer;" proxy="' + v + '">Check alive proxy</a>'
                                + '</td>'
                                + '</tr>';
                    });
                }
                $('#proxyAddToCartList').html(html);

                var html = '<tr><td colspan="2" style="text-align:center;">Hiện tại chưa có proxy nào</td></tr>';
                $('#proxyGetDetailLength').text('0');
                if (Object.keys(data.proxy_getDetail).length > 0) {
                    $('#proxyGetDetailLength').text(data.total_proxy_getDetail);
                    var html = '';
                    $.each(data.proxy_getDetail, function (k, v) {
                        var arrProxy = v.split(':');
                        html += '<tr>'
                                + '<td>' + v + '</td>'
                                + '<td>'
                                + '<a href="http://www.ip-tracker.org/locator/ip-lookup.php?ip=' + arrProxy[0] + '" target="_blank">IP Lookup</a> | '
                                + '<a class="checkAlive" style="cursor:pointer;" proxy="' + v + '">Check alive proxy</a>'
                                + '</td>'
                                + '</tr>';
                    });
                }
                $('#proxyGetDetailList').html(html);

                var html = '<tr><td>Lần cập nhật gần nhất</td><td><b>' + data.last_update_proxy + '</b></td></tr>'
                        + '<tr><td>Số proxy gần nhất lấy được</td><td><b>' + data.last_get_total_proxy + ' proxy</b></td></tr>'
                        + '<tr><td>Thời gian để lấy <b>' + data.last_get_total_proxy + '</b> proxy</td><td><b>' + data.last_total_time_for_get_proxy + ' giây</b></td></tr>'
                        + '<tr><td>Số proxy không trùng lặp</td><td><b>' + data.last_check_total_proxy + ' proxy</b></td></tr>'
                        + '<tr><td>Thời gian để check <b>' + data.last_check_total_proxy + '</b> proxy</td><td><b>' + data.last_total_time_for_check_proxy + ' giây</b></td></tr>';
                $('#info').html(html);


                $('.checkAlive').click(function () {
                    var proxy = $(this).attr('proxy');
                    checkAliveProxy(proxy);
                });

                if (renderChart) {
                    var x = (new Date()).getTime(), // current time
                            y1 = data.total_check_proxy_process_running,
                            y2 = data.cpuUsage,
                            y3 = data.freeMemUsage;
                    chart.series[0].addPoint([x, y1], true, true);
                    chart.series[1].addPoint([x, y2], true, true);
                    chart.series[2].addPoint([x, y3], true, true);
                }
            }
        }
    });
}

function initEditor(elem) {
    tinymce.init({
        selector: elem,
        height: 500,
        forced_root_block: false,
        valid_elements: '*[*]',
        extended_valid_elements: "*[*]",
        entity_encoding: "raw",
        fix_list_elements: true,
        plugins: [
            "autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
            "table contextmenu directionality emoticons template textcolor paste textcolor colorpicker textpattern"
        ],
        toolbar1: "newdocument | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
        toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media | insertdatetime preview | forecolor backcolor",
        toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft code",
        menubar: false,
        toolbar_items_size: 'small',
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
        style_formats: [
            {title: 'Bold text', inline: 'b'},
            {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
            {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
            {title: 'Table styles'},
            {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
        ],
        file_browser_callback: function (field_name, url, type, win) {
            if (type === 'image') {
                $('div#news_image_upload').html('<input type="file" name="newsImage" id="editorImages" class="imageUpload ignore" />');
                $("#editorImages").Nileupload({
                    action: baseurl + '/backend/news/upload',
                    size: '2MB',
                    extension: 'jpg,jpeg,png',
                    progress: $("#editorProgress"),
                    preview: $(".editorImageList"),
                    multi: false,
                    callback: function (returnData) {
                        $('.mce-btn.mce-open').parent().find('.mce-textbox').val(returnData.sourceImage);
                    }
                });
                $('#editorImages').click();
            }
        }
    });
}