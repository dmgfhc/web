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
    console.log(this.currentIndex);
    // 根据显示对象的数据去绘制显示对象
    this.ctx.drawImage(this.img,
        littlePic[0], littlePic[1], littlePic[2], littlePic[3],
        this.x, this.y, 52, 45
    );
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
