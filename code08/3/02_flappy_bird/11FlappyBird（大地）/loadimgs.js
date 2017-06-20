
/* 把图片加载封装成一个函数：
 * 参数：
 *      一个对象，存储了图片的路径
 *      一个函数，所有图片加载完成之后，执行的回调函数
 */
function loadImgs(imgUrls, callback) {
    // 存储了图片名和图片标签
    var imgElems = {};
    var count = 0; // 我们用count变量来存储“正在加载中”的图片的个数
    // for循环遍历imgUrls对象，创建Img标签
    for (var imgName in imgUrls) {
        var url = imgUrls[imgName];
        // 创建img标签
        var img = new Image();
        img.src = url;
        // 给img标签设置src之后，图片标签就开始加载图片
        count++;
        // 把img标签放到imgElems对象里面去
        imgElems[imgName] = img;
        // 给img标签绑定加载完成事件的监听。（加载完成事件的触发时间，肯定在for循环执行完成之后）
        img.addEventListener('load', function () {
            // 每触发一次这个加载完成时间，就意味着有一个图片加载完成了，所以
            count--;
            // *********如果count为0，则：所有图片都加载完成了********
            if (count == 0) {
                callback(imgElems);
            }
        })
    }

    // 如果直接return imgElems，图片这个时候，还没有加载完成
    //return imgElems;
}

