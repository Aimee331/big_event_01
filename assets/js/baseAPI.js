$(function () {
    $.ajaxPrefilter(function (options) {
        //jQuery封装的ajax方法,可以让$.get(),$.post(),$.ajax()
        //所有方法一调用就马上触发,还可以让后台一响应信息后就马上触发,然后再执行success里面的代码
        const baseURL = 'http://api-breakingnews-web.itheima.net'
        options.url = baseURL + options.url
    })
})