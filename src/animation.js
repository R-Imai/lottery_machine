//var __ = require('node_modules');

class Circle {
  constructor(x, y, radius) {
    this.init(x, y, radius);
  }

  calc_omega(){
    this.omega = 6*this.v_x/(2*Math.PI*this.radius);
  }

  init(x, y, radius){
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.theta = 135*(Math.PI/180);

      this.v_r = 3; // この速度で膨張・縮小を繰り返す。
      this.v_x = -15;
      this.v_y = -60;
      this.g = 4.9;
      this.calc_omega();

      this.is_stop = 0;
      this.is_center = 0;

      this.render(context);
  }

  end_check(){
      if (Math.abs(this.v_x) < 0.01 && Math.abs(this.v_y) < 3) {
          this.is_stop = 1;
      }
  }

  goto_center(){
    var vx;
    var vy;
    var center_x;
    var center_y;

    center_x = WIDTH/2;
    center_y = HEIGHT/2;


    vx = center_x - this.x;
    vy = center_y - this.y;

    this.x += vx/10;
    this.y += vy/10;
    this.radius += this.v_r;

    if (Math.abs(center_x - this.x) < 2 && Math.abs(center_y - this.y < 2)){
        this.is_center = 1;
    }
  }

  update() {
    this.x += this.v_x;
    if(this.x > WIDTH-this.radius-10 || this.x < this.radius+10) {
      this.v_x = -this.v_x;
    }

    this.v_y += this.g;
    this.y += this.v_y;
    if(this.y > HEIGHT-this.radius-10) {
      this.v_y = -this.v_y*0.95;
      this.v_x = this.v_x*0.95;
      this.y = HEIGHT-this.radius - 10;
    }

    this.theta += this.omega;
    if(this.theta >= 2*Math.PI){
        this.theta -= 2*Math.PI;
    }
    else if(this.theta < 0){
        this.theta += 2*Math.PI;
    }

    this.calc_omega();

    // document.getElementById("history_box").innerHTML = "(" + String(this.v_x) + "," + String(this.v_y) + ")";
  }

  render(context) {
    context.beginPath();

    var grd = context.createRadialGradient(this.x - (0.85*this.radius*Math.cos(this.theta)),this.y - (0.85*this.radius*Math.sin(this.theta)),10,this.x - (0.85*this.radius*Math.cos(this.theta)),this.y - (0.85*this.radius*Math.sin(this.theta)),this.radius*2);

    grd.addColorStop(0,"#ff0091");
    grd.addColorStop(0.2,"#7000ff");
    grd.addColorStop(0.4,"#00defc");
    grd.addColorStop(0.6,"#2fff04");
    grd.addColorStop(0.8,"#f2ff00");
    grd.addColorStop(1,"#ffffff");


    context.fillStyle = grd;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillText("12", this.x, this.y, this.radius);
    context.fill();
  }
}

function to_center(timestamp){
    // 前の描画を消す。
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // 各オブジェクトの状態を更新する。
    ball.goto_center();

    // 各オブジェクトを描画する。
    ball.render(context);

    if (ball.is_center == 0) {
        window.requestAnimationFrame((ts) => to_center(ts));
    }
    else{
        pickup_num();
    }
}

// ループさせる関数。
function loop(timestamp) {
  // 前の描画を消す。
  context.clearRect(0, 0, WIDTH, HEIGHT);

  // 各オブジェクトの状態を更新する。
  ball.update();

  // 各オブジェクトを描画する。
  ball.render(context);

  ball.end_check();

  if (ball.is_stop == 0) {
      //document.getElementById("history_box").innerHTML = "OK";
      window.requestAnimationFrame((ts) => loop(ts));
  }
  else{
      window.requestAnimationFrame((ts) => to_center(ts));
  }

}


function pickup_num(){
    var key = Math.floor(Math.random()*lottery_list.length);
    var num = lottery_list[key];
    res_list.push(num);
    lottery_list.splice(key,1);
    document.getElementById("text_number").innerHTML = ("0"+String(num)).slice(-2);
    document.getElementById("history_box").innerHTML = String(res_list);

}

//
// メイン処理。
//



function animation_main(){
    //
    // メイン処理。
    //
    ball.init(WIDTH-60, HEIGHT-60, 50);
    document.getElementById("text_number").innerHTML = "";

    window.requestAnimationFrame((ts) => loop(ts, 0));


}



const WIDTH = 1000;
const HEIGHT = 500;

const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

// コンテキストを取得しておく。
const context = canvas.getContext('2d');

// body要素に追加する。
document.body.appendChild(canvas);

// 円と四角形を1個ずつ追加。
var ball = new Circle(WIDTH-60, HEIGHT-60, 50);
// objects.push(new Rectangle(350, 350, 50, 50));
var cnt = 0;
// var lottery_list = __.range(1,100);
var lottery_list = [];
var res_list = [];
for (var i = 0; i <= 100; i++) {
    lottery_list.push(i);
}
