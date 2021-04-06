$(function () {
    //直接向模板引擎中导入一个变量或者函数,这样可以让每一个模板引擎都可以使用
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        //自动补零
        function padZero(num) {
            num = num < 10 ? "0" + num : num
            return num
        }
        //显示想要的日期格式
        // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
        return `${y}-${m}-${d}`
    }

    //定义一个对象来放参数
    let q = {
        page: 3,   //页码值
        perpage: 3,    //每页显示多少数据
        type: "",     //文章分类的 Id
        state: ""        //文章的状态，可选值有：已发布、草稿
    }
    //获取文章列表数据(封装成函数)
    initTable()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/admin/article/query',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                const htmlStr = template('tpl-table', { list: res.data })
                $('tbody').html(htmlStr)
                //当数据一渲染到页面就要实现分页功能
                renderPage(res.totalCount)
            }
        })
    }

    //渲染文章分类
    let form = layui.form
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
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }


    //文章列表筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name="cate_id"]').val()
        let state = $('[name="state"]').val()
        q.type = cate_id
        q.state = state
        initTable()
    })

    //分页功能函数
    function renderPage(total) {
        let laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.perpage,
            curr: q.page,
            limits: [2, 3, 4, 5],
            //自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj);
                // console.log(first);
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //首次不执行
                if (!first) {
                    //do something
                    q.page = obj.curr
                    q.perpage = obj.limit
                    initTable()
                }
            }
        });
    }

    //删除文章功能
    //绑定点击事件,事件委托
    $('tbody').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // console.log(Id);
            $.ajax({
                method: 'post',
                url: '/admin/article/delete',
                data: { id: Id },
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg(res.msg)
                    }
                    layui.layer.msg('删除数据成功')
                    layer.close(index);
                    //如果当前页面只有一个元素,且当前页码大于一,删除之后要自动跳到上一页
                    if ($('.btn-delete').length === 1 && q.page > 1) {
                        q.page--;
                    }
                    initTable()
                }
            })

        });
    })

})