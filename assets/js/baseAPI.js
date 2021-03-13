$(function () {
    $.ajaxPrefilter(function (options) {
        const baseURL = 'http://api-breakingnews-web.itheima.net'
        options.url = baseURL + options.url
    })
})