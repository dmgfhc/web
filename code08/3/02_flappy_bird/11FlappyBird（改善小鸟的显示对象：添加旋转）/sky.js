function Sky(x, speed, img, ctx) {
    // 显示对象本身的数据
    this.x = x;
    this.speed = speed;
    this.img = img;
    this.ctx = ctx;
}

// 显示对象所需的绘制函数
Sky.prototype.draw = function () {
    // 根据显示对象的数据去绘制显示对象
    this.ctx.drawImage(this.img, this.x, 0);
};

// 显示对象的更新函数
Sky.prototype.update = function (dt) {
    // 根据时间的变化，来更新显示对象的数据
    // 根据时间和速度来更新位置
    this.x = this.x + this.speed * dt;

    if (this.x < -800) {
        //当天空彻底离开屏幕后，回到最右边
        this.x = this.x + 1600;
    }
};