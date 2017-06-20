/**
 * 管子的显示对象
 */
function Pipe(x, img1, img2, ctx, speed) {
    // 显示对象本身的数据
    // 上管子露出的长度：就知道所有管子的位置
    // 随机值:Math.random返回0到1之间的随机数，那么250*Math,random() -> 0到250之间的随机数
    // 100加上 0~250之间的随机数： 100~350之间的随机数
    this.upPipeLength = 100 + 250 * Math.random();
    // 横轴的坐标
    this.x = x;
    // 绘图所需要的图片和上下文
    this.pipeImg1 = img1; // 上方的管子
    this.pipeImg2 = img2; // 下方的管子
    this.ctx = ctx;
    // 速度
    this.speed = speed;
}

// 显示对象所需的绘制函数
Pipe.prototype.draw = function () {
    // 根据显示对象的数据去绘制显示对象
    this.ctx.drawImage(this.pipeImg1, this.x, this.upPipeLength - 420);
    this.ctx.drawImage(this.pipeImg2, this.x, this.upPipeLength + 150); // 150是两根管子之间的间距

};

// 显示对象的更新函数
Pipe.prototype.update = function (dt) {
    // 根据时间的变化，来更新显示对象的数据
    this.x = this.x + this.speed * dt;

    // 管子从左方离开屏幕后，让它回到最右边，并重新设置上管子露出的长度
    if(this.x < -52){
        this.x = this.x + Pipe.PIPE_COUNT * Pipe.PIPE_GAP;
        this.upPipeLength = 100 + 250 * Math.random();
    }
};