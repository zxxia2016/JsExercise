const GameEventType = require('game_event_type');

cc.Class({
    extends: cc.Component,

    properties: {
        prefabZjh:cc.Prefab,
        prefabRummy: cc.Prefab,
        prefabAllGame: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.systemEvent.on('e_open_Zjh_help', this.onBtnZjhhelp, this);
        cc.systemEvent.on('e_open_Rummy_help', this.onBtnRummyhelp, this);
        cc.systemEvent.on('e_open_All_help', this.onBtnAllGamehelp, this);
        cc.systemEvent.on('CloseAllWindows', this.CloseAllWindows, this);
    },
    onDestroy(){
        cc.systemEvent.off('e_open_Zjh_help', this.onBtnZjhhelp, this);
        cc.systemEvent.off('e_open_Rummy_help', this.onBtnRummyhelp, this);
        cc.systemEvent.off('e_open_All_help', this.onBtnAllGamehelp, this);
        cc.systemEvent.off('CloseAllWindows', this.CloseAllWindows, this);
    },

    onBtnZjhhelp (){
        cc.mg.util.playBoxOpenSound();
        if (this.zjh == null) {
            this.zjh = cc.instantiate(this.prefabZjh);
            cc.find("Canvas").addChild(this.zjh);
        }
        else{
            this.zjh.active = true;
        }
    },

    onBtnRummyhelp (){
        cc.mg.util.playBoxOpenSound();
        if (this.Rummy == null) {
            this.Rummy = cc.instantiate(this.prefabRummy);
            cc.find("Canvas").addChild(this.Rummy);
        }
        else{
            this.Rummy.active = true;
        }
    },

    onBtnAllGamehelp (){
        cc.mg.util.playBoxOpenSound();
        if (this.AllGame == null) {
            this.AllGame = cc.instantiate(this.prefabAllGame);
            cc.find("Canvas").addChild(this.AllGame);
        }
        else{
            this.AllGame.active = true;
        }
    },

    CloseAllWindows(){
    },
    
    // update (dt) {},
});
