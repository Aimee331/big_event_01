$(function () {
    //用户昵称表单验证
    const form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 1 || value.trim().length > 6) {
                return '昵称长度必须在1-6个字符之间!'
            }
        }
    })

    //用户个人资料信息获取并渲染(封装成函数)
    const layer = layui.layer
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                } else {
                    //将信息渲染到页面
                    form.val('formUserInfo', res.data)
                }
            }
        })
    }

    //重置用户信息
    $('.layui-form').on('reset', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    //修改用户信息
    $('form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) return layer.msg(res.message, { icon: 5 })
                layer.msg('恭喜您,用户信息修改成功', { icon: 6 })
                $('form')[0].reset()
                //这里的window指的是iframe标签里面user_info.html这个页面
                //window.parent()指的是父页面
                //调用父页面中的更新用户信息和头像方法
                window.parent.getUserInfo()
            }
        })
    })
})