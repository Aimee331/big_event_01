$(function () {
    //需求1:实现登录和注册页面的切换
    $('#link_reg').on('click', function () {
        console.log(1);
        $('.reg-box').show()
        $('.login-box').hide()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    //需求2:自定义表单验证规则
    //只要引入layui文件就有layui对象,里面有form属性,需要调用f
    //form属性的varify方法来自定义表单验证规则
    const form = layui.form
    form.verify({
        //属性名是校验规则的名称
        //属性值是校验规则,为函数或者数组
        pwd: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'],
        repwd: function (value, item) {
            // console.log(value);
            // console.log($(item));
            // console.log($('.reg-box input[name="password"]').val());
            //value对应需要校验的输入框的值,item是需要校验的输入框(DOM元素)
            if (value !== $('.reg-box input[name="password"]').val()) {
                return '两次密码不一致,请重新输入!'
            }
        }
    })
    const layer = layui.layer
    //注册功能
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                //不要用serialize方法,因为会将repassword输入框的值获取,但是这里不需要repassword输入框的值
                username: $('.reg-box input[name="username"]').val(),
                password: $('.reg-box input[name="password"]').val()
            },
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    // return alert('res.message')
                    layer.msg('res.message', { icon: 5 });
                } else {
                    //用户名:chenanqi12,chenanqi2,chenanqi3
                    //密码:chenanqi123
                    // alert('恭喜您,注册成功!')
                    layer.msg('恭喜您,注册成功!', { icon: 6 });
                    //跳回登录页面
                    $('#link_login').click()
                    //重置表单让表单内容清空
                    //reset方法是DOM对象的方法
                    // $('#form_reg').get(0).reset()
                    $('#form_reg')[0].reset()
                }
            }
        })
    })

    //登录功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg(res.message, { icon: 5 });
                } else {
                    location.href = '/index.html'
                    localStorage.setItem('token', res.token)
                }
            }
        })
    })
})