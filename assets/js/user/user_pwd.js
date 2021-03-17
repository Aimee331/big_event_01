$(function () {
    const form = layui.form
    //密码表单校验
    form.verify({
        //pwd
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //newPwd规则
        newPwd: function (value) {
            if ($('[name="oldPwd"]').val() === value) {
                return '新密码和旧密码不能相同'
            }
        },
        //重置密码rePwd规则
        rePwd: function (value) {
            if ($('[name="newPwd"]').val() !== value) {
                // console.log($('[name="newpwd"]').val());
                return '两次新密码输入不一致!'
            }
        }
    })

    //修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message,{icon:5})
                }
                layui.layer.msg(res.message, { icon: 6 })
                $(this)[0].reset()
                window.parent.getUserInfo()
            }
        })
    })
})