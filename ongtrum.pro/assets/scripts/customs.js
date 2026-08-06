lt = localStorage;
/* ul_now = $(location).attr('href');
ul_menu = $('.vertical-nav-menu>li>');
for (var i = 0; i < ul_menu.length; i++) {
    if (ul_menu[i].href == ul_now) ul_menu[i].classList.add("mm-active");
}
ul_menu = $('.vertical-nav-menu>li>ul>li>a');
for (var i = 0; i < ul_menu.length; i++) {
    if (ul_menu[i].href == ul_now) ul_menu[i].classList.add("mm-active");
} */
/* ul_menu = $('.vertical-nav-menu>li');
for (var i = 0; i < ul_menu.length; i++) {
    if (ul_menu[i].querySelectorAll("a[class*='active']")[0]) {
        ul_menu[i].classList.add("mm-active");
        var v = ul_menu[i];
        setTimeout(function () { v.scrollIntoView(1); }, 2000);
    }
} */
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function toquery(obj) {
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function count_number(id, max, delay) {
    new countUp.CountUp(id.slice(1), max, { duration: 1 }).start();
    //$(id).html(max);
}

$.ajaxSetup({
    headers: {
        'X-Csrf-Token': $('meta[name="csrf-token"]').attr('content')
    },
    beforeSend: function (xhr, settings) {
        if (settings.type == 'POST' || settings.type == 'post') {
            if (!settings.data.match(/api_token=/)) {
                settings.data += '&api_token=' + localStorage.api_token;
            } else {
                var replacedata = settings.data.replace(/api_token=[\w\d]+/, 'api_token=' + localStorage.api_token);
                settings.data = replacedata;
            }
        }
    }
});
moment.locale('vi');
//moment().format('H:mm:ss, DD/MM/YYYY');
$(document).ready(function () {
    // Thay đổi thuộc tính data-* thành data-coreui-*
    const updateDataAttributes = (attribute) => {
        document.querySelectorAll(`[data-${attribute}]`).forEach(element => {
            const value = element.getAttribute(`data-${attribute}`);
            if (value) {
                element.setAttribute(`data-coreui-${attribute}`, value);
                element.removeAttribute(`data-${attribute}`);
            }
        });
    };

    updateDataAttributes('toggle');
    updateDataAttributes('target');
    updateDataAttributes('dismiss');
    if (document.getElementById("buy")) {
        /* document.getElementById("buy").addEventListener("click", function(event) {
            event.preventDefault();
        });
        document.getElementById("view").addEventListener("click", function(event) {
            event.preventDefault();
        });
        document.querySelectorAll('[data-toggle="tab"]').forEach(function(pill) {
            pill.addEventListener('click', function() {
                return true;
            });
        });
        document.querySelectorAll('[data-toggle]').forEach(function(element) {
            var toggleValue = element.getAttribute('data-toggle');
            if (toggleValue) {
                element.setAttribute('data-coreui-toggle', toggleValue);
                element.removeAttribute('data-toggle');
            }
        });
        document.querySelectorAll('[data-target]').forEach(function(element) {
            var toggleValue = element.getAttribute('data-target');
            if (toggleValue) {
                element.setAttribute('data-coreui-target', toggleValue);
                element.removeAttribute('data-target');
            }
        });
        document.querySelectorAll('[data-dismiss]').forEach(function(element) {
            var toggleValue = element.getAttribute('data-dismiss');
            if (toggleValue) {
                element.setAttribute('data-coreui-dismiss', toggleValue);
                element.removeAttribute('data-dismiss');
            }
        }); */
        // Ngăn chặn hành động mặc định của các nút
        ['buy', 'view'].forEach(id => {
            document.getElementById(id).addEventListener("click", function (event) {
                event.preventDefault();
            });
        });

        // Xử lý sự kiện click cho các phần tử có data-toggle="tab"
        document.querySelectorAll('[data-toggle="tab"]').forEach(pill => {
            pill.addEventListener('click', () => true);
        });

        var view = $("#view");
        var buy = $("#buy");
        var tabBuy = $("#tab-buy");
        var tabView = $("#tab-view");
        buy.on("click", function () {
            tabBuy.addClass('active');
            tabView.removeClass('active');
            view.removeClass('active');
            buy.addClass('active');
        });
        view.on("click", function () {
            tabBuy.removeClass('active');
            tabView.addClass('active');
            view.addClass('active');
            buy.removeClass('active');
        });
    }
    window.formdata = function (id) {
        const data = $(id).serializeObject();
        data.api_token = lt.api_token;
        return data;
    }
    window.formview = function (api, limit = 1000) {
        tbb = new DataTable('#table');
        const data = {};
        data.limit = limit;
        data.type_api = api;
        data.type_method = 'view';
        //data.api_token = lt.api_token;
        return data;
    }
    window.formstatus = function (api, limit = 1000) {
        const data = {};
        data.limit = limit;
        data.type_api = api;
        data.type_method = 'status';
        data.api_token = lt.api_token;
        return data;
    }
    /* let countc = 0;
    var ulElement = document.querySelector('ul.vertical-nav-menu');
    var allLinks = ulElement.querySelectorAll('li a');
    if (window.innerWidth <= 768) {
        allLinks.forEach(function (link) {
            link.addEventListener("mouseover", function () {
                if (countc < 1) {
                    link.click();
                    countc++;
                }
            });
        });
    } */
});
var s;
$('#view').click(function () {
    if (!s) {
        setTimeout((function () {
            $('#table_filter').on("change", function () {
                var id = $('.dataTables_filter input').val();
                if (id) {
                    var form = formdata("#form");
                    form.id = id;
                    form.type_method = 'search';
                    $.post("/api/v2/server.aspx", form, function (e) {
                        if (e.code == 200) {
                            show_data(e);
                        }
                    }, 'json');
                }
            });
            s = 1;
        }), 1000);
    }
});
async function bcao(id, action = null) {
    if (action) {
        var form = formdata("#former");
        form.auto = 1;
        await $.post("/support/", form, function (e) {
            if (e.code == 200) {
                $('#content_bc').val('');
                notice('Thông báo', e.message);
            } else {
                notice('Thông báo', e.message);
            }
        });
    } else {
        $('.modeler').click();
        $('#title').val($('#type_api').val());
        $('#ider').val(data_row[0]);
    }
}
const checkToastr = setInterval(function () {
    if (typeof window.toastr !== 'undefined') {
        clearInterval(checkToastr);
        const originalToastr = window.toastr;
        if (originalToastr !== null) {
            // Định nghĩa hàm toastr mới và gán vào window
            window.toastr = function (text = '...', style = 'info', map = 'toast-top-right', delay = 5000) {
                if (style === 'error') delay = 10000;
                originalToastr.options = {
                    closeButton: 1,
                    debug: !1,
                    newestOnTop: !0,
                    progressBar: 1,
                    positionClass: map,
                    preventDuplicates: !1,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    timeOut: delay,
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "show",
                    hideMethod: "hide"
                };
                originalToastr[style](text);
            };
        }
    }
}, 100);

function notice(title, message) {
    Swal.fire({
        title: title,
        text: message
    });
}

window.addEventListener("load", function () {
    if (document.getElementById("table")) {
        tbb = new DataTable('#table');
    }
    var originalPost = $.post;
    $.post = function (url, data, success, dataType) {
        var request = originalPost(url, data, success, dataType);
        request.done(function (r) {
            try {
                if (r.code == 500 && data.channel) {
                    localStorage['log_' + data.type_api] = JSON.stringify({ message: r.message, channel: data.channel + '|' + data.max, url: data.url, img: null, date: new Date().getDate() });
                    /* html2canvas(document.body).then((e) => {
                        localStorage['log_' + data.type_api] = JSON.stringify({ message: r.message, channel: data.channel + '|' + data.max, url: data.url, img: null, date: new Date().getDate() });
                    }); */
                }
            } catch (e) { }
        });
        return request;
    };
});
$('.flag_link').click(function () {
    var lang = $(this).data('lang');
    var languageSelect = document.querySelector("select.goog-te-combo");
    languageSelect.value = lang;
    languageSelect.dispatchEvent(new Event("change"));
    $('.flag_link').removeClass('active');
    $(this).addClass('active');
});
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'vi'
    }, 'google_translate_element');
}
