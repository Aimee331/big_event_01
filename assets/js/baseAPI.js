$(function () {
    $.ajaxPrefilter(function (options) {
        //jQuery封装的ajax方法,可以让$.get(),$.post(),$.ajax()
        //所有方法一调用就马上触发,还可以让后台一响应信息后就马上触发,然后再执行success里面的代码
        // const baseURL = 'http://api-breakingnews-web.itheima.net'
        const baseURL = 'http://127.0.0.1:9000'
        options.url = baseURL + options.url

        if (options.url.indexOf('/my/') != -1) {
            options.headers = {
                Authorization: localStorage.getItem('token')
            }
            //登录拦截
            options.complete = function (res) {
                // console.log(res);
                const obj = res.responseJSON
                if (obj.status === 1 && obj.message === '身份认证失败！') {
                    //销毁token
                    localStorage.removeItem('token')
                    //页面跳转
                    location.href = '/login.html'
                    //提示
                    layer.msg('有表情地提示', { icon: 5 });
                }
            }
        }
    })

    //统一设置Authorization
    $.ajaxSetup({
        headers: {
            Authorization: localStorage.getItem('token'),
        }
    })
})

//统一处理401错误
$(document).ajaxError(function (event, request, settings) {
    if (request.status === 401) {
        // alert(request.responseJSON.msg)
        return (location.href = '../login.html')
    }
})