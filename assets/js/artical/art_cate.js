$(function () {
    //获取文章分类列表封装成函数
    const layer = layui.layer
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                //定义模板字符串
                const htmlStr = template("t1-art-list", { list: res.data })
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd = null
    //添加文章分类结构搭建
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            //用模板引擎创建form表单,再通过DOM元素获取
            content: $('#dialog-add').html()
        });
    })

    //添加文章分类功能实现,动态生成,事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //添加成功分三步
                //清空form表单
                $(this)[0].reset()
                //重构分类列表页面
                initArtCateList()
                //提示
                layui.layer.msg('恭喜您!添加文章分类成功', { icon: 6 })
                //关闭弹框
                layer.close(indexAdd)
            }
        })
    })


    //编辑文章分类功能实现,动态生成,事件委托
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            //用模板引擎创建form表单,再通过DOM元素获取
            content: $('#dialog-edit').html()
        });
        //显示对应的编辑内容(自定义属性)
        let Id = $(this).attr('data-id')
        let form = layui.form
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + Id,
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //layui封装的表单赋值方法,form.val()
                form.val('form-edit', res.data)
            }
        })
    })

    //修改文章分类功能,动态生成,事件委托
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //添加成功分三步
                //清空form表单
                $(this)[0].reset()
                //重构分类列表页面
                initArtCateList()
                //提示
                layui.layer.msg('恭喜您!添加文章分类成功', { icon: 6 })
                //关闭弹框
                layer.close(indexEdit)
            }
        })
    })

    //删除文章,动态生成,事件委托
    $('tbody').on('click', '.btn-delete', function () {
        //获取id值要放在confirm函数外面,因为用到了this
        let Id = $(this).attr('data-id')
        //删除的弹出框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //点击确定之后要做的事情
            //显示对应的内容(自定义属性)
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + Id,
                success: (res) => {
                    console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    //重构分类列表页面
                    initArtCateList()
                    //提示
                    layui.layer.msg('恭喜您!删除文章分类成功', { icon: 6 })
                    //关闭弹框
                    layer.close(index);
                }
            })
            // layer.close(index);
        });

    })


})