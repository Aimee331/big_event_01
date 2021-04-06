//有图片元素,最好用window.onload事件
$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    let options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //选择要上传的图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    //修改裁剪图片
    $('#file').on('change', function (e) {
        //如果事件为冒泡执行,e.target为目标阶段的元素
        let file = e.target.files[0]
        if (!file) {
            return layui.layer.msg('请先上传图片再生成头像!')
        }
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //实现上传图片功能
    $('#btnUpLoad').on('click', function () {
        // return $('#file').change()
        let fd = new FormData()
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            // .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            .toBlob(function (blob) {        //将Canvas画布上的内容,转化为文件对象
                fd.append('file_data', blob)
                $.ajax({
                    type: 'post',
                    url: '/my/uploadPic',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: (res) => {
                        console.log(res);
                        if (res.status != 0) {
                            return layui.layer.msg(res.message, { icon: 5 })
                        }
                        layui.layer.msg('恭喜您,上传头像成功!', { icon: 6 })
                        window.parent.getUserInfo()
                    }
                })
            })
        // console.log(dataURL);
    })

})