// 创建鸟的精灵对象
function Bird(x, y, img, ctx, animationArray, accelerate, speed) {
    // 显示对象本身的数据

    // 精灵的位置信息
    this.x = x;
    this.y = y;
    this.w = 52;
    this.h = 45;

    // 精灵的当前帧
    this.currentIndex = 0;
    // 小鸟的精灵在当前帧等待的时间
    this.waitTime = 0;

    // 精灵的图片，上下文
    this.img = img;
    this.ctx = ctx;

    // 小图的位置数组:[[0,0,52,45],[52,0,52,45],[104,0,52,45]]
    this.animationArray = animationArray;

    // 小鸟的运动信息
    this.a = accelerate; // 小鸟的加速度
    this.speed = speed; // 小鸟的速度

}

// 显示对象所需的绘制函数
Bird.prototype.draw = function () {
    // 根据当前帧，获取当前帧应该用的小图（存储在一个数组中，依次是：x,y,w,h）
    var littlePic = this.animationArray[this.currentIndex];

    // 想要小鸟转起来，首先是要？ save 和 restore ，保证绘制小鸟时旋转坐标系，不干扰后面的绘制

    this.ctx.save();
    this.ctx.translate(this.x, this.y);

    // 用于指导如何旋转的一个缓存的speed的数值：我们可以修改它让它有个最大值的限定
    var tempSpeed = this.speed;

    // 有可能转过头
    if (tempSpeed > 0.3) {
        tempSpeed = 0.3;
    }


    // 获得旋转角度：平滑的变换角度
    // 当速度为0.3的时候，对应是30度的角度
    // 当速度为0.1的时候，对应的10度的角度
    var angle = (tempSpeed / 0.3 ) * ( Math.PI / 6);


    this.ctx.rotate(angle);

    // 根据显示对象的数据去绘制显示对象
    this.ctx.drawImage(this.img,
        littlePic[0], littlePic[1], littlePic[2], littlePic[3],
        -26, -22.5, 52, 45
    );
    this.ctx.restore();
};

// 显示对象的更新函数
Bird.prototype.update = function (dt) {
    // 根据时间的变化，来更新显示对象的数据

    // 遇到问题：小鸟不能一次update就扇一次翅膀，太快了。
    // 我们希望限制为：它每100毫秒扇一次翅膀；
    this.waitTime += dt;

    // 根据时间的变化来让小煽动翅膀:小鸟必须等100毫秒才能煽动一次翅膀
    if (this.waitTime > 100) {
        this.waitTime -= 100;
        this.currentIndex = this.currentIndex > 1
            ? 0
            : this.currentIndex + 1;
    }

    // ---------------做坠落动画-----------------
    this.speed = this.speed + this.a * dt; // 新速度= 原速度 + 加速度*时间
    this.y = this.y + this.speed * dt; // 新的位置= 原位置 + 速度 * 时间


};
