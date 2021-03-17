$(function () {
    //获取用户信息将信息渲染到页面,这个功能之后其他页面还会用到
    //所有封装成函数并且定义成全局变量
    getUserInfo()

    //退出登录功能
    const layer = layui.layer
    $('#btnLogout').on('click', function () {
        //eg1
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1清空token值
            localStorage.removeItem('token')
            //2页面跳转
            location.href = '/login.html'
            //3关闭弹出框
            layer.close(index);
        });
    })
})

//获取用户信息将信息渲染到页面,这个功能之后其他页面还会用到
//所有封装成函数并且定义成全局变量
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // data: {},
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                // location.href = '/login.html'
                return layui.layer.msg(res.message);
            }
            //渲染个人头像,封装成函数
            renderAvatar(res.data)
        }
    })
}
//渲染个人头像函数
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //显示头像
    if (user.user_pic) {
        $('.userinfo img').attr('src', user.user_pic)
        $('.text-avatar').hide()
        // $('.layui-layout-right .userinfo').html(`
        // <img src="${user.user_pic}" class="layui-nav-img">
        // 个人中心
        // `)
        // $('.layui-side-scroll .userinfo').html(`
        // <img src="${user.user_pic}" class="layui-nav-img">
        // <span id="welcome">${'欢迎&nbsp;&nbsp;' + name}</span>
        // `)
    } else {
        //文字头像
        $('.text-avatar').show().html(name[0].toUpperCase())
        $('.userinfo img').hide()
        // $('.layui-layout-right .userinfo').html(`
        // <div class="text-avatar">${name[0].toUpperCase()}</div>
        // 个人中心
        // `)
        // $('.layui-side-scroll .userinfo').html(`
        //  <div class="text-avatar">${name[0].toUpperCase()}</div>
        // <span id="welcome">${'欢迎&nbsp;&nbsp;' + name}</span>
        //  `)
    }
}


