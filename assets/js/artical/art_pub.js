$(function () {
    //1.0渲染文章分类
    let form = layui.form
    let layer = layui.layer
    initCate()
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                let htmlStr = template('tpl-cate', { data: res.data })
                $('[name="categoryId"]').html(htmlStr)
                form.render()
            }
        })
    }

    // 2.0初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    //4选择要上传的图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //5选择图片,并且渲染到图片预览区
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        // console.log(file);
        if (!file) {
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', "/assets/images/sample2.jpg")  // 重新设置图片路径
                .cropper(options)         // 重新初始化裁剪区域
            return layui.layer.msg('您可以选择一张图片作为封面背景!')
        }
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //6参数状态设置
    let state = "已发布"
    // $('#btnSave1').on('click', function () {
    //     state = '已发布'
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    //7文章发布(文件操作,要用到FormData)
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        let fd = new FormData(this)
        fd.append('state', state)
        console.log(...fd);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //生成文件是异步,需要在回调函数里面执行
                fd.append('cover', blob)
                //发表文章封装成函数
                console.log(...fd);
                publishArtical(fd)
            });
    })

    //发表文章封装成函数
    function publishArtical(fd) {
        let date = new Date()
        fd.append('date', date)
        $.ajax({
            type: 'post',
            url: '/admin/article/publish',
            data: fd,
            //两个false,设cp
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 成功,提示,页面跳转
                $('#form-pub')[0].reset()
                layui.layer.msg('恭喜您,发布文章成功!')
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 1000)
            }
        })
    }


})