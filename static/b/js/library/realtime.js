$(document).ready(function () {
    if (!navigator.cookieEnabled) {
        return false;
    }
    //detect url change
    window.onhashchange = function () {
        var userID = document.location.hash;
        userID = userID.replace('#', '');
        var pathname = window.location.pathname;
        if (userID && (pathname === '/backend/support/' || pathname === '/backend/support')) {
            $('#' + userID).trigger('click');
            document.location.hash = '';
        } else {
            window.location.href = 'http://' + window.location.host + '/backend/support/#' + userID;
        }
    };
    var data = {
        email: email,
        fullname: fullname,
        role: role
    };
    $.get(supportURL);
    socket = io.connect(supportURL, {
        'connect timeout': 500,
        'reconnect': true,
        'reconnection delay': 500,
        'reopen delay': 500,
        'max reconnection attempts': 10
    });
    socket.on('connect', function () {
        socket.emit('get', {url: '/connection'});
        socket.emit('get', {url: '/support'});
        socket.emit('get', {url: '/support/login'});
        socket.emit('get', {url: '/support/logout'});
        socket.emit('get', {url: '/support/message'});
        socket.emit('get', {url: '/order'});
        setTimeout(function () {
            socket.emit('login', data);
            socket.emit('get-total-unread-message');
            socket.emit('get-order-notification-list');
        }, 200);
    });
    socket.on('notify-order', function (data) {
        socket.emit('get-order-notification-list');
//        var alertURL = staticurl + '/audio/order-notify.mp3';
//        var aSound = document.createElement('audio');
//        aSound.setAttribute('src', alertURL);

        var quotationID = null;
        var orderID = null;

        data.orderID ? orderID = data.orderID : quotationID = data.quotationID;
        var strURL = orderID ? baseurl + '/backend/order/view/id/' + orderID + '/' : baseurl + '/backend/quotation/view/id/' + quotationID + '/';

        new PNotify({
            title: '<b>' + data.email + '</b>',
            text: data.message,
            type: 'info',
            icon: 'fa fa-book',
            delay: 14500,
            mouse_reset: false,
            remove: true,
            animate_speed: 'fast',
            buttons: {},
            confirm: {
                confirm: true,
                buttons: [{
                        text: 'Xem',
                        addClass: 'btn-success',
                        click: function (notice) {
                            window.location = strURL;
//                            aSound.pause();
//                            aSound.currentTime = 0;
                        }
                    },
                    {
                        text: 'Đóng',
                        addClass: 'btn-danger',
                        click: function (notice) {
                            notice.remove();
                            notice.get().trigger("pnotify.cancel", notice);
//                            aSound.pause();
//                            aSound.currentTime = 0;
                        }
                    }
                ]
            }
        });
//        aSound.play();
    });

    //get list tất cả những tin nhắn chưa đọc để append vào notification box trên header
    socket.on('get-unread-list', function (data) {
        var html = '<div class="notify-arrow notify-arrow-red"></div><li><p class="red"><b>Bạn có ' + data.length + ' cuộc hội thoại chưa đọc</b></p></li>';
        if (data.length > 0) {
            $('#unreadByEmail').text(data.length).show();
            moment.lang('vi');
            $.each(data, function (k, v) {
                var message = v.lastMessage;

                //nếu message nhiều hơn 100 ký tự thì cắt ra cho hiển thị 100 ký tự
                var index = v.lastMessage.indexOf(' ', 100);
                if (index >= 100) {
                    var message = v.lastMessage.substring(0, index);
                    message = message + '...';
                }

                var dateString = moment.unix(v.timestamp).fromNow();

                html += '<li><a href="' + baseurl + '/backend/support/#' + v.userID + '">'
                        + '<span class="subject">'
                        + '<span class="from">' + v.email + '</span>'
                        + '<span class="time">' + dateString + '</span>'
                        + '</span>'
                        + '<span class="message">' + message + '</span>'
                        + '</a></li>';
            });
            html += '<li><a href="' + baseurl + '/backend/support">Xem tất cả các cuộc hội thoại</a></li>';
        } else {
            $('#unreadByEmail').hide();
            html += '<li><a href="#">Hiện tại không có cuộc hội thoại nào chưa đọc.</a></li>';
        }
        $('#chatNotify').html(html);
    });

    //get list order notification để append trên header
    socket.on('get-order-notification-list', function (data) {
        var total = data.total ? data.total : 0,
                displayBtnDelAllNotify = total > 0 ? '' : 'display:none;',
                arrNotifyList = data.notificationList,
                html = '<div class="notify-arrow notify-arrow-yellow"></div><li><p class="yellow"><b>Bạn có ' + total + ' đơn hàng mới.</b>'
                + '<span id="delAllNotify" class="label label-danger" style="float:right;cursor:pointer;' + displayBtnDelAllNotify + '">Xóa tất cả thông báo</span>'
                + '</p></li>';
        moment.lang('vi');

        if (total > 0) {
            $('#totalOrderNotify').text(total).show();
            $.each(arrNotifyList, function (k, v) {
                var quotationID = null;
                var orderID = null;

                v.orderID ? orderID = v.orderID : quotationID = v.quotationID;
                var strURL = orderID ? baseurl + '/backend/order/view/id/' + orderID + '/' : baseurl + '/backend/quotation/view/id/' + quotationID + '/';

                var message = v.message;
                var dateString = moment.unix(v.time).fromNow();
                html += '<li><a href="' + strURL + '" style="padding-top:5px!important;">'
                        + '<span style="font-size:15px;font-weight:bold;">' + v.email + '</span>'
                        + '<span class="small italic" style="position:absolute;right:5px;">' + dateString + '</span><br />'
                        + '<span class="message">' + message + '</span>'
                        + '</a></li>';
            });
        } else {
            $('#totalOrderNotify').hide();
            html += '<li><a>Hiện tại không có đơn hàng hoặc yêu cầu báo giá mới nào.</a></li>';
        }
        $('#orderNotifyList').html(html);


        $('#delAllNotify').on('click', function () {
            return bootbox.confirm('<b>Bạn có muốn xóa tất cả thông báo đơn hàng không ?</b>', function (result) {
                if (result) {
                    orderNotify.removeNotify({
                        orderID: '',
                        delAll: 1
                    });
                }
            });
        });

    });

    socket.on('check-selected-user', function (data) {
        var userID = data.userID;
        var selectedUser = $('#' + userID).parent('li').hasClass('active');

        data.selectedUser = selectedUser;

        if (selectedUser === false) {
            new PNotify({
                title: '<b>' + data.email + '</b>',
                text: data.message,
                type: 'warning',
                icon: 'fa fa-comments-o',
                delay: 5000,
                mouse_reset: false,
                remove: true,
                animate_speed: 'fast',
                buttons: {},
                confirm: {
                    confirm: true,
                    buttons: [{
                            text: 'Xem tin nhắn',
                            addClass: 'btn-success',
                            click: function (notice) {
                                document.location.hash = userID;
                                notice.remove();
                                notice.get().trigger("pnotify.cancel", notice);
                            }
                        },
                        {
                            text: 'Đóng',
                            addClass: 'btn-danger',
                            click: function (notice) {
                                notice.remove();
                                notice.get().trigger("pnotify.cancel", notice);
                            }
                        }
                    ]
                }
            });
        }
        socket.emit('check-selected-user', data);
    });

    socket.on('set-unread-message', function (data) {
        var userID = data.userID;
        $('li.user #' + userID).children('span.unreadMessage').remove();
        $('li.user #' + userID).children(':first').after('<span class="label label-danger pull-right unreadMessage">' + data.unread + '</span> ');

        $('#totalUnreadMessage').text(data.total);

        var alertURL = staticurl + '/audio/alert.mp3';
        var aSound = document.createElement('audio');
        aSound.setAttribute('src', alertURL);
        aSound.play();
    });
    socket.on('set-total-unread-message', function (total) {
        $('#totalUnreadMessage').text(total);
    });
    socket.on('del-unread-message', function (userID) {
        if (userID) {
            $('#' + userID).children('span.unreadMessage').remove();
        }
    });

    socket.on('response-message', function (data) {
        if ($.isEmptyObject(data)) {
            return false;
        }
        var userID = data.userID;
        var userElem = $('#' + userID).parent('li').clone();

        $('#' + userID).remove();
        $('#userList li:nth-child(1)').after(userElem);

        moment.lang('vi');
        var dateString = moment.unix(data.timestamp).fromNow();

        var username = data.support ? 'Amazon247' : data.email;
        var html = '<div class="alert alert-info" style="max-width:70%;width:70%;">'
                + '<strong style="font-size:16px;">' + username + '</strong> <i style="font-size:12px;float:right;">' + dateString + '</i><br />'
                + '<p style="padding-top:10px;">' + data.message + '</p>'
                + '</div>';
        if ($('#' + userID).parent('li').hasClass('active')) {
            $('#chatHistory').children('div').append(html);
            $('#chatHistory').scrollTo('100%');
        }
        selectUser();
    });
});
var Support = {
    chat: function () {
        page = 1;
        $(document).ready(function () {
            Support.initEditor();
            if (!fullname || !email || !role) {
                return false;
            }
            socket.on('logout', function (userID) {
                $('#' + userID).parent('li').remove();
                var totalUser = $('#userList').children('li').length;
                if (totalUser < 2) {
                    $('#userList').html('<li><h4>Người dùng đang trực tuyến</h4> </li>').append('<li id="emptyUserOnline" style="text-align:center;"><h5>Hiện tại chưa có người dùng nào Online.</h5> </li>');
                }
            });
            socket.on('add-user-list', function (data) {
                $('#emptyUserOnline').remove();
                if ($('#' + data.userID).length < 1) {
                    var html = '<li class="user"> <a id="' + data.userID + '" style="cursor:pointer;"> <i class=" fa fa-circle text-success"></i> ' + data.email + '<p style="font-size:13px;font-weight:bold;">&nbsp;</p></a></li>';
                    $('#userList li:nth-child(2)') < 1 || !data.message ? $('#userList').append(html) : $('#userList li:nth-child(1)').after(html);

                    if (data.unread) {
                        $('li.user #' + data.userID).children(':first').after('<span class="label label-danger pull-right unreadMessage">' + data.unread + '</span> ');
                        var html = $('li.user #' + data.userID).parent('li').clone();
                        $('li.user #' + data.userID).remove();
                        $('#userList li:nth-child(1)').after(html);
                    }
                }

                if ($('#' + data.userID).parent('li').hasClass('offline')) {
                    $('#' + data.userID).children('i').removeClass('text-muted').addClass('text-success');
                }
                selectUser();
            });

            socket.on('set-offline', function (userID) {
                $('#' + userID).parent('li').addClass('offline');
                $('#' + userID).children('i').removeClass('text-success').addClass('text-muted');
            });

            socket.on('get-user-list', function (data) {
                var html = '',
                        totalUnread = 0,
                        userList = data[0],
                        unreadList = data[1];
                if ($.isEmptyObject(userList) && $.isEmptyObject(unreadList)) {
                    return $('#userList').html('<li><h4>Người dùng đang trực tuyến</h4> </li>').append('<li id="emptyUserOnline" style="text-align:center;"><h5>Hiện tại chưa có người dùng nào Online.</h5> </li>');
                }

                $.each(userList, function (k, v) {
                    html += '<li class="user"> <a id="' + k + '" email="' + v.email + '" style="cursor:pointer;"><i class=" fa fa-circle text-success"></i> ' + v.email + '<p style="font-size:13px;font-weight:bold;">&nbsp;</p></a></li>';
                });
                $('#userList').html('<li><h4>Người dùng đang trực tuyến</h4></li>').append(html);

                var notOnline = '';
                $.each(unreadList, function (k, v) {

                    var userID = v.userID,
                            unread = parseInt(v.unread),
                            isOnline = $('#' + userID).length;

                    totalUnread += unread;

                    if (isOnline > 0) {
                        $('#' + userID).prepend('<span class="label label-danger pull-right unreadMessage">' + unread + '</span>');
                        var online = $('#' + userID).parent('li').clone();
                        $('#' + userID).parent('li').remove();
                        $('#userList').children('li:nth-child(1)').after(online);
                    } else {
                        notOnline += '<li class="user offline"> <a id="' + v.userID + '" email="' + v.email + '" style="cursor:pointer;"> <i class=" fa fa-circle text-muted"></i> ' + v.email
                                + '<span class="label label-danger pull-right unreadMessage">' + unread + '</span> '
                                + '<p style="font-size:13px;font-weight:bold;">&nbsp;</p></a></li>';
                    }
                });

                $('#userList').children('li:nth-child(1)').after(notOnline);
                $('#totalUnreadMessage').text(totalUnread);
                selectUser();

                // khi supporter ko ở cửa sổ chat thì redirect tới cửa sổ chat và select user cần chat khi nhấn "xem tin nhắn" ở popup notify thông báo message mới
                var hashID = window.location.hash;
                hashID = hashID.replace('#', '');
                if (hashID) {
                    setTimeout(function () {
                        if ($('#' + hashID).is(':visible')) {
                            $('#' + hashID).trigger('click');
                            document.location.hash = '';
                        }
                    }, 300);
                }
            });

            socket.on('send-user-message', function (data) {
                var userElem = $('#' + data.userID);
                var selectedUser = userElem.parent('li').hasClass('active');
                if (selectedUser === true) {
                    moment.lang('vi');
                    var dateString = moment.unix(data.timestamp).fromNow();
                    var html = '<div class="alert alert-success" style="width:70%;margin-left:30%;">'
                            + '<strong style="font-size:16px;">Amazon247</strong> <i style="font-size:12px;float:right;">' + dateString + '</i><br />'
                            + '<p style="padding-top:10px;">' + data.message + '</p>'
                            + '</div>';
                    $('#chatHistory').children('div').append(html);
                    $('#chatHistory').scrollTo('100%');
                }
                var newUserElem = userElem.parent('li.active').clone();
                userElem.parent('li.active').remove();
                $('#userList li:nth-child(1)').after(newUserElem);
                selectUser();
            });

            socket.on('get-message', function (data) {

                if (!data) {
                    return $('#chatHistory').children('div').html('');
                }

                var html = data.total > 20 ? '<div id="seeMore" style="padding-bottom:10px;"><button type="button" class="btn btn-default" style="width:100%;">Xem thêm</button></div>' : '';
                $.each(data.messageList, function (k, v) {
                    if (v) {
                        var isSupport = v.support ? 'alert-success' : 'alert-info';
                        var isFloatRight = v.support ? 'margin-left:30%;' : '';
                        var username = v.support ? 'Amazon247' : v.email;
                        moment.lang('vi');
                        var dateString = moment.unix(v.timestamp).fromNow();
                        html += '<div class="chatMessage alert ' + isSupport + '" style="max-width:70%;width:70%;' + isFloatRight + '">'
                                + '<strong style="font-size:16px;">' + username + '</strong> <i style="font-size:12px;float:right;">' + dateString + '</i><br />'
                                + '<p style="padding-top:10px;">' + v.message + '</p>'
                                + '</div>';
                    }
                });
                if (page === 1) {
                    $('#chatHistory').children('div').html(html);
                    $('#chatHistory').scrollTo('100%');
                } else {
                    var firstMessage = $('#chatHistory').children('div').children('.chatMessage:first');
                    $('#seeMore').remove();
                    $('#chatHistory').children('div').prepend(html);
                    $('#chatHistory').scrollTop(firstMessage.offset().top - 180);
                }

                $('#seeMore').on('click', function () {
                    var userID = $('li.user.active').children('a').attr('id');
                    page += 1;
                    socket.emit('get-message', {
                        email: email,
                        userID: userID,
                        support: true,
                        page: page
                    });
                });
            });

            socket.on('typing', function (data) {
                var userID = $('#userList li.active').children('a').attr('id');
                data.userID == userID ? $('#typing').html(data.message ? data.email + data.message : '') : '';
                $('#' + data.userID).children('p').html(data.message ? data.message : '&nbsp;');
            });
        });
    },
    history: function () {
        $(document).ready(function () {
            $('#calendar').fullCalendar({
                defaultDate: moment().format('YYYY-MM-DD'),
                editable: true,
                firstDay: 1,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                events: getHistoryURL
            });
        });
    },
    viewHistory: function () {
        $(document).ready(function () {
            page = 1;
            $('#userList li.user').unbind().bind('click', function (event) {
                page = 1;
                $('#userList li.user').removeClass('active');
                $(this).addClass('active');

                var userID = $(this).children('a').attr('id'),
                        historyKey = $(this).attr('history'),
                        data = {
                            email: email,
                            userID: userID,
                            support: true,
                            historyKey: historyKey,
                            page: page
                        };
                socket.emit('get-message', data);
            });

            socket.on('get-message', function (data) {
                if (!data) {
                    return $('#chatHistory').children('div').html('');
                }
                var html = data.total > 10 ? '<div id="seeMore" style="padding-bottom:10px;"><button type="button" class="btn btn-default" style="width:100%;">Xem thêm</button></div>' : '';
                $.each(data.messageList, function (k, v) {
                    if (v) {
                        var isSupport = v.support ? 'alert-success' : 'alert-info';
                        var isFloatRight = v.support ? 'margin-left:30%;' : '';
                        var username = v.support ? 'Amazon247' : v.email;
                        moment.lang('vi');
                        var dateString = moment.unix(v.timestamp).fromNow();
                        html += '<div class="chatMessage alert ' + isSupport + '" style="max-width:70%;width:70%;' + isFloatRight + '">'
                                + '<strong style="font-size:16px;">' + username + '</strong> <i style="font-size:12px;float:right;">' + dateString + '</i><br />'
                                + '<p style="padding-top:10px;">' + v.message + '</p>'
                                + '</div>';
                    }
                });
                if (page === 1) {
                    $('#chatHistory').children('div').html(html);
                    $('#chatHistory').scrollTo('100%');
                } else {
                    var firstMessage = $('#chatHistory').children('div').children('.chatMessage:first');
                    $('#seeMore').remove();
                    $('#chatHistory').children('div').prepend(html);
                    $('#chatHistory').scrollTop(firstMessage.offset().top - 180);
                }

                $('#seeMore').on('click', function () {
                    var userID = $('li.user.active').children('a').attr('id');
                    page += 1;
                    socket.emit('get-message', {
                        email: email,
                        userID: userID,
                        support: true,
                        page: page
                    });
                });
            });
        });
    },
    initEditor: function () {
        tinymce.init({
            selector: 'textarea#txtMessage',
            height: 135,
            forced_root_block: false,
            valid_elements: '*[*]',
            extended_valid_elements: "*[*]",
            entity_encoding: "raw",
            fix_list_elements: true,
            plugins: ["autolink link textcolor"],
            toolbar1: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | link unlink | forecolor backcolor",
            menubar: false,
            statusbar: false,
            toolbar_items_size: 'small',
            fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 18pt 24pt 36pt",
            setup: function (editor) {
                editor.on('keydown', function (event) {
                    if (event.keyCode == 13 && event.ctrlKey === false) {
                        event.preventDefault();
                        event.stopPropagation();
                        var userID = $('#userList li.active').children('a').attr('id'),
                                email = $.trim($('#userList li.active').children('a').attr('email'));
                        if (!userID) {
                            return bootbox.alert('<b>Vui lòng chọn người dùng cần gửi tin nhắn</b>');
                        }
                        var txtMsg = tinymce.activeEditor.getContent();
                        if (txtMsg.length < 1) {
                            return bootbox.alert('<b>Xin vui lòng nhập nội dung tin nhắn.</b>');
                        }
                        tinymce.activeEditor.setContent('');
                        var timestamp = Math.round(new Date().getTime() / 1000),
                                timestamp = timestamp - 20;
                        socket.emit('send-user-message', {
                            userID: userID,
                            message: txtMsg,
                            email: email,
                            support: true,
                            timestamp: timestamp
                        });
                    }
                });
            }
        });
    }
};


var orderNotify = {
    removeNotify: function (data) {
        $(document).ready(function () {
            setTimeout(function () {
                socket.emit('remove-order-notification', data);
            }, 1000);
        });
    }
};

function selectUser(data) {
    $('#userList li.user').unbind();
    $('#userList li.user').bind('click', function (event) {
        $('#userList li.user').removeClass('active');
        $(this).addClass('active');
        $('#typing').html('');
        page = 1;
        var userID = $(this).children('a').attr('id'),
                unreadMessage = parseInt($.trim($(this).children('a').children('span.unreadMessage').text()))
        var data = $.isEmptyObject(data) ? {
            email: email,
            userID: userID,
            support: true,
            page: page
        } : data;
        socket.emit('get-message', data);
        if (!isNaN(unreadMessage)) {
            socket.emit('del-unread-message', data);
        }
    });
}

var typing = false;
var typingTimeout = undefined;

function timeoutTyping() {
    var userID = $('#userList li.active').children('a').attr('id');
    typing = false;
    socket.emit('typing', {
        message: '',
        userID: userID,
        typer: 'support'
    });
}

function checkTyping(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        return timeoutTyping();
    }
    var userID = $('#userList li.active').children('a').attr('id');
    if (typing === false) {
        typing = true;
        socket.emit('typing', {
            message: 'Amazon247 đang trả lời...',
            userID: userID,
            typer: 'support'
        });
        typingTimeout = setTimeout(timeoutTyping, 2000);
    } else {
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(timeoutTyping, 2000);
    }
}