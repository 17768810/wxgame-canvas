import QuestionPage from './questionScene'
import Background from '../runtime/background'
import DataStore from '../base/DataStore';
import Sprite from '../base/Sprite';
// import {getAuthSettings, createUserInfoButton} from '../utils/auth.js';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;

export default class HomeScene {
  constructor(ctx) {
      this.ctx = ctx;
      this.canvas = DataStore.getInstance().canvas;
      // this.canvas = wx.createCanvas();
      // this.canvas.width = screenWidth * ratio;
      // this.canvas.height = screenHeight * ratio;
      // this.mainCtx = ctx;
      // this.ctx = this.canvas.getContext('2d');
      // this.ctx.scale(2,2);
      // this.ctx.translate(0.5, 0.5);

      // this.background = new Background(ctx);
      // this.drawHomeEle();
      // this.drawButton();

      // ctx.drawImage(this.canvas, 0, 0);
      // this.loop();
      // this.bindEvent();
      this.loop();
  }
  drawHomeEle () {
      this.homeEle = Sprite.getImage('homepage');
      this.logoImg = Sprite.getImage('logo');
      this.homeImg = new Sprite(this.homeEle, 0, this.logoImg.height - 60, this.homeEle.width / 2, this.homeEle.height / 2);
      this.homeImg.draw(this.ctx);
  }
  drawButton () {
      this.btnImg = Sprite.getImage('start_btn');
      this.startSprite = new Sprite(this.btnImg, (screenWidth - this.btnImg.width / 2) / 2, this.homeImg.height + 60,
                                    this.btnImg.width / 2, this.btnImg.height / 2);
      this.startSprite.draw(this.ctx);

      this.rankImg = Sprite.getImage('rank_btn');
      this.rankSprite = new Sprite(this.rankImg, (screenWidth - this.rankImg.width / 2) / 2, this.startSprite.y + this.startSprite.height + 20,
          this.rankImg.width / 2, this.rankImg.height / 2);
      this.rankSprite.draw(this.ctx);

      this.bindEvent();
  }
  loop () {
        this.background = new Background(this.ctx);
        this.drawHomeEle();
        this.drawButton();
        // console.log(DataStore.getInstance().userInfo);
        // if (!DataStore.getInstance().userInfo) {
        //     createUserInfoButton();
        // }
        if (DataStore.getInstance().shareTicket && !this.showGroup){
            this.showGroup = true;
            this.messageSharecanvas('group', DataStore.getInstance().shareTicket);
        }
        if (this.ranking) {
            this.ctx.drawImage(DataStore.getInstance().sharedCanvas, 0, 0);
        }
        this.requestId = requestAnimationFrame(this.loop.bind(this));
    }
    messageSharecanvas (type, text) {
        // 排行榜也应该是实时的，所以需要sharedCanvas 绘制新的排行榜
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            type: type || 'friends',
            text: text,
        });
        this.ranking = true;
    }
  bindEvent () {
      let _this = this;
      wx.offTouchStart();
      if (this.ranking) {
        wx.onTouchStart((e) => {
          let x = e.touches[0].clientX,
            y = e.touches[0].clientY;
          if (x >= 40 && x <= 90 && y >= 560 && y <= 610) {// 返回按钮
              _this.ranking = false;
          }
        }); 
        return;
      }
      wx.onTouchStart((e) => {
          let x = e.touches[0].clientX,
              y = e.touches[0].clientY;
          if (x >= _this.startSprite.x
            && x <= _this.startSprite.x + _this.startSprite.width
            && y >= _this.startSprite.y
            && y <= _this.startSprite.y + _this.startSprite.height) {
                cancelAnimationFrame(_this.requestId);
                DataStore.getInstance().director.toQuestionScene(_this.ctx);   
          } else if (x >= _this.rankSprite.x
              && x <= _this.rankSprite.x + _this.rankSprite.width
              && y >= _this.rankSprite.y
              && y <= _this.rankSprite.y + _this.rankSprite.height) {
                // 排行榜也应该是实时的，所以需要sharedCanvas 绘制新的排行榜
              _this.messageSharecanvas();
              wx.offTouchStart(); // 在分享canvas还是会响应事件，所以先解除事件绑定
          }
      });
  }
}