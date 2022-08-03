const errorDefine = require('../../common/error_define');
const MsgEventDefine = require('../../define/msg_event_define');
import Orientation from 'Orientation';
import { PushTrackRecord, PointType } from '../../account/UserTrackRecord';
import { GIDTool } from '../../common/GIDTool';
// import PageBanner from '../../hall/component/PageBanner';
import { BundleManager } from '../../bundle/BundleManager';
import { Config, GetBundleNameByGid } from "../../bundle/BundleConfig";
import EventDefine from "../../common/EventDefine";
import hall_GameIcon from './pg/hall_GameIcon';
import EventListener from "../../common/EventListener";
import { AssetManagerCode } from "../../bundle/BundleUpdate";


const HallEnum = require('hall_Enum');
import {
    RoomModeTool,
    RoomMode,
    PszRoomMatchLimt,
    RmRoomMatchLimt,
    Rm2PRoomMatchLimt,
    Rm5PSingleRoomMatchLimt,
    RoyalTPRoomMatchLimt,
    TPSingleRoomMatchLimt,
    DZPKRoomMatchLimt,
    TLRoomMatchLimt,
    GameScene,
    Rm2PSingleRoomMatchLimt,
    RoyalTPSingleRoomMatchLimt,
    LudoRoomMatchLimt,
    BDRoomMatchLimt,
} from '../../common/room_mode_tool';
import PageBannerSingle from '../../hall/component/PageBannerSingle';
const i18n = require('LanguageData');

const RechargeInfos = {
    progressive_recharge_time: "progressive_recharge_time",         // 累充
    first_recharge_reward: "first_recharge_reward",     //  首充
    recharge_reward: "recharge_reward",     //  特充
    limit_recharge: "limit_recharge",        // 限时
    week_month_card: "week_month_card",      //yue card
    recharge_send_gold: "recharge_send_gold" // 充值活动任务
}

/*gameType 游戏分类 第一个位置放中间,从下往上 01234*/
const posData = [
    { "x": 150, "y": 0 },
    { "x": 105, "y": -120 },
    { "x": 5, "y": -155 },
    { "x": 5, "y": 155 },
    { "x": 105, "y": 120 },
]

const OtherRedDotTxt = {
    vip_cash_gift: "vip_cash_gift",     // vip
    sign_reward: "sign_reward",     // 签到
    notice: "notice",       // 未查看的公告
    unclaimed_task: "unclaimed_task",        // 任务
    spread_way: "spread_way",        // 分享
    clean_bet: "clean_bet",        // 洗码
    user_spread_way: "user_spread_way",        // 代理
    loss_waiver_red: "free_lose",//亏损红点
    recharge_send_activity: "recharge_send_activity" // 充值活动任务
}

const GameDownCount = 5;

cc.Class({
    extends: cc.Component,

    properties: {
        /** 游戏列表滚动区域(含广告轮播) */
        scrollViewGames: {
            default: null,
            type: cc.Node,
        },
        scrollViewGames2: {
            default: null,
            type: cc.Node,
        },
        scrollViewRoom: {
            default: null,
            type: cc.ScrollView,
        },
        scrollViewBaodian: {
            default: null,
            type: cc.ScrollView,
        },
        /** 注册有礼按钮 */
        btnRegift: {
            default: null,
            type: cc.Node,
        },
        // 多功能按钮   
        btnGift: {
            default: null,
            type: cc.Node,
        },
        // 累充活动   
        btnCumulativeRecharge: {
            default: null,
            type: cc.Node,
        },
        // 累充活动   
        btnCumulativeRecharge1: {
            default: null,
            type: cc.Node,
        },
        // 首次充值返利按钮
        btnFirstRechargeActivety: {
            default: null,
            type: cc.Node,
        },
        // 首次充值返利按钮
        btnFirstRechargeActivety1: {
            default: null,
            type: cc.Node,
        },
        // 限时充值按钮
        btnLimit: {
            default: null,
            type: cc.Node,
        },
        // 限时充值按钮
        btnLimit1: {
            default: null,
            type: cc.Node,
        },
        // 特殊充值按钮
        btnDiscount: {
            default: null,
            type: cc.Node,
        },
        // 特殊充值按钮
        btnDiscount1: {
            default: null,
            type: cc.Node,
        },
        // card
        btnCard: {
            default: null,
            type: cc.Node,
        },
        // card
        btnCard1: {
            default: null,
            type: cc.Node,
        },
        // 注册
        btnSignUp: {
            default: null,
            type: cc.Node,
        },

        /** 保存游戏按钮 */
        // btnStoreGame: cc.Node,

        //webview
        prefabWebview: {
            default: null,
            type: cc.Prefab,
        },

        /** 顶部信息栏 */
        userInfo: {
            default: null,
            type: cc.Node
        },

        /** 获取金币成功动画 */
        effctGoldPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //需要隐藏显示的按钮
        visibleButtons: {
            default: [],
            type: [cc.Node],
        },
        /** vip icon */
        vip_sprite: {
            default: [],
            type: [cc.SpriteFrame],
        },
        labelPgLimit: {
            default: null,
            type: cc.Label,
        },

        leftBtns: {
            default: null,
            type: cc.Node,
        },

        _GamesListWgtL: 0,
        _pageViewWgtL: 0,
        _GameTypeWgtL: 0,
        _diffW: 0,
        _curIdx: 0,
        GameTypeData: null,
        isBtnPlay: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("hall_gold js onload");
        this.setVisibleNodeBtn();
        Orientation.setOrientation(this.node.getComponent(cc.Canvas), 'H');
        cc.log("winSize =>", cc.winSize);
        // cc.mg.audio.playBGM('common/sounds/bg_main');

        cc.mg.ui_helper.remove_loading();
        cc.mg.global.user.roomMode = 0;


        this.initView();
        this.initVisibleButton();
        this.initGameClassList()
        this.initDisplay();

        this.initPgGame();
        this.initGameButton();
        this.initGameNodeView();

        this.initMakeMoneyLabel();

        this.autoFlushGold();
        cc.mg.native_class.ShowORHideGoHomeBtn(false)
        // cc.mg.native_class.setFacebookButtonVisible(false);

        this.initGameEventHandle();
        this.registOpenGameEvent();

        // let RazorPamentData = cc.mg.util.RazorPayGetReplenishmentData();
        this.withdrawToAdjustEvent();
        this.RechargeToAdjustEvent();
        cc.find("Canvas/scrollview_games2/view/content").x = cc.mg.last_game_click_position;
        cc.find("Canvas/scrollview_activity/view/btn_activity/loss_waiver").active = false;
        this.onActivityHied();

    },
    onEnable() {
        // 红点更新
        this.updateRedDot();

        // 初始化房间配置
        this.reqRoomConfig();
        this.UpdateVisibleButton();
        this.scheduleOnce(this.onGetContentFromClipBoard, 2)
    },

    start() {

        cc.log('hall_gold js start');
        let dec = cc.mg.global.getLeaveRoomDec();
        if (dec && dec !== "") {
            this.scheduleOnce(() => {
                cc.mg.ui_helper.toast(dec);
                cc.mg.global.setLeaveRoomDec("");
            }, 0.5);
        }

        this.adapteGameList();

        this.otherGameDownCount = 0;
        this.schedule(this.otherGameDown, 3, GameDownCount, 1);
    },

    onActivityHied() {
        let view = cc.find("Canvas/scrollview_activity/view");
        view.x = 390;
        view.active = false;;
        let activity = cc.find("Canvas/scrollview_activity/view/btn_activity");
        let btn_activityList = activity.children
        for (const key in btn_activityList) {
            if (btn_activityList.hasOwnProperty(key)) {
                const element = btn_activityList[key];
                element.active = false;
            }
        }
    },

    onDestroy() {
        //delete handles
        this.unRegistGameEventHandle();
        this.unRegistOpenGameEvent();
    },

    adapteGameList() {
        // this.scheduleOnce(() => {
        let size = cc.winSize;
        let content = this.scrollViewGames.getComponent(cc.ScrollView).content;
        let sView = content.parent;
        sView.width = this.scrollViewGames.width;
        sView.x = 0;

        let children = content.children;
        let w = 0;
        let len = 0;
        for (let i = 0; i < children.length; i++) {
            const el = children[i];
            if (el.active) {
                ++len;
                w += el.width;
            }
        }
        w += (len - 1) * content.getComponent(cc.Layout).spacingX;
        content.width = w;

        if (size.width > content.width) {
            sView.width = content.width + 10;
            content.x = 0;
        }
        else {
            content.x = (content.width - sView.width) / 2;

            this.scrollViewGames.getComponent(cc.ScrollView).scrollToLeft();
        }
        // }, 0.02);
    },

    initView() {
        try {
            // let row = cc.mg.global.server.game_rows;
            // let tRow = row && row > 1;
            this.leftBtns.active = false;//tRow;

            this._GamesListWgtL = this.scrollViewGames2.getComponent(cc.Widget).left;
            this._pageViewWgtL = this.visibleButtons[39].getComponent(cc.Widget).left;
            this._GameTypeWgtL = this.visibleButtons[46].getComponent(cc.Widget).left;

            this._diffW = (this.scrollViewGames2.x - this.visibleButtons[39].x) * 2;

            this.btnFirstRechargeActivety.active = false;
            this.btnCumulativeRecharge.active = false;
            this.btnDiscount.active = false;
            this.showGiftRedPoint(false);

            this.visibleButtons[14].getChildByName("icon_red").active = false;
            this.visibleButtons[39].active = false;


            this.btnLimit.active = false;
            this.btnCard.active = false;

            let b = (cc.mg.global.user.tel != "" || cc.mg.global.user.account != "");
            this.btnSignUp.active = !b;

            cc.find("scrollview_games/view/content/btn_playnow", this.node).active = false;

        } catch (error) {
            cc.error("Hall_gold initView Error =>", error);
        }
    },

    adapteMultiGameList() {
        // this.adapteCount = this.adapteCount ? this.adapteCount + 1 : 1;
        // if (this.adapteCount < 2) {
        //     return;
        // }

        let row = cc.mg.global.server.game_rows;
        if (row && row > 1) {
            // let cls = this.leftBtns.children;
            let b = false;

            let gameTypeNode = this.visibleButtons[46];
            let b1 = gameTypeNode.active;
            let wgt1 = gameTypeNode.getComponent(cc.Widget);
            let diff1 = this._GameTypeWgtL - this.leftBtns.width;
            wgt1.left1 = b ? this._pageViewWgtL : diff1;

            let b2 = this.visibleButtons[39].active;
            let wgt = this.visibleButtons[39].getComponent(cc.Widget);
            let diff = this._pageViewWgtL - this.leftBtns.width;
            wgt.left = b1 ? (this._pageViewWgtL / 2 + gameTypeNode.width) : (b ? this._pageViewWgtL : diff);

            let node = this.scrollViewGames2;
            let wgt2 = node.getComponent(cc.Widget);
            let l = b ? this._GamesListWgtL : this._GamesListWgtL - this.leftBtns.width;
            l = b2 ? l : 0/* l - this._diffW */;
            wgt2.left = b1 ? (b2 ? this._GamesListWgtL + 212 : this._GamesListWgtL - 88) : l;
        }
    },

    initGameEventHandle: function () {
        //登录并且资源加载成功
        cc.systemEvent.on('loginFinish', this.loginFinish, this);
        //创建房间结果
        cc.systemEvent.on(MsgEventDefine.EVENT_CREATE_ROOM, this.respCreateRoom, this);
        //加入房间
        cc.systemEvent.on(cc.mg.net.rsp_key_map.RspJoinHall.key, this.goToHall, this);
        //更新基本用户信息，如昵称、头像、房卡、金币、ID，需刷新界面；todo: update_card_num去掉，直接用这个事件派发
        cc.systemEvent.on('update_userinfo', this.refreshUserInfo, this);
        //早前版本，刷新房卡
        cc.systemEvent.on('update_card_num', this.refreshUserInfo, this);
        //注册绑定成功
        cc.systemEvent.on('update_regbind', this.refreshRegbind, this);

        //领取成功
        cc.systemEvent.on('prepare_get_gold_succ', this.getGoldSucc, this);
        //打开内部浏览器
        cc.systemEvent.on('e_open_inside_webview', this.openInsideWebview, this);

        //活动阅读标志
        cc.systemEvent.on('e_activity_read_flag', this.onActivityRead, this);

        //IN PlayNow
        cc.systemEvent.on('e_enter_PlayNow', this.onPlayNow, this);

        // this.btnStoreGame.on('click', this.onBtnStoreGameClick, this);

        // 
        cc.systemEvent.on('scrollview_variation', this.onSetscrollViewVariation, this);
        cc.systemEvent.on('PlayGodGuideStepStartAnim', this.PlayGodGuideStepStartAnim, this);

        cc.systemEvent.on('open_FacebookLogin', this.onFacebookLoginFinish, this);

        let layout_Gift = cc.find("Canvas/layout_right/btn_gift/NewNode/node_click")
        if (layout_Gift) {
            layout_Gift.on('touchstart', this.closeToggleIsChecked, this);
        }

        cc.systemEvent.on('red_dot_change', this.onRedDotChange, this);
        cc.systemEvent.on('open_game_room', this.onOpenGameRoom, this);

        // 奖励领取成功
        cc.systemEvent.on('reward_succ', this.onRewardSucc, this);
        // 任务完成
        cc.systemEvent.on('finish_task', this.onFinishedTask, this);
        // 获取特殊充值
        cc.systemEvent.on('on_recharge', this.onRecharge, this);
        // 累充活动完成
        cc.systemEvent.on('recharge_activity_finished', this.reqRechargeRedDotAndShow, this);
        // 累充活动结束
        cc.systemEvent.on('recharge_activity_end', this.onRechargeActivityEnd, this);

        // 游戏房间配置修改
        cc.systemEvent.on('game_way_change', this.reqRoomConfig, this);
        cc.systemEvent.on('first_recharge', this.reqRechargeRedDotAndShow, this);
        cc.systemEvent.on('Update_Language', this.UpdateLanguage, this);

        cc.systemEvent.on('game_maintain_notice', this.UpdateGameMaintain, this);
        cc.systemEvent.on("onGetContentFromClipBoard", this.onGetContentFromClipBoard, this);

        cc.systemEvent.on('game_event_show', function () {
            cc.log("=====hall_gold======= EVENT_SHOW ============");
            this.onGetContentFromClipBoard();
            // cc.view.resizeWithBrowserSize(true);
        }.bind(this));
        cc.systemEvent.on('refresh_loss_waiver_data', this.reqOtherRedDot, this);//刷新亏损豁免的红点
        EventListener.Inst.addEventListener(EventDefine.HOTUPDATE_DOWNLOAD, this.onDownload, this);

    },

    unRegistGameEventHandle() {
        EventListener.Inst.removeEventListener(EventDefine.HOTUPDATE_DOWNLOAD, this.onDownload, this);
        cc.systemEvent.off('loginFinish', this.loginFinish, this);
        cc.systemEvent.off(MsgEventDefine.EVENT_CREATE_ROOM, this.respCreateRoom, this);
        cc.systemEvent.off(cc.mg.net.rsp_key_map.RspJoinHall.key, this.goToHall, this);
        cc.systemEvent.off('update_userinfo', this.refreshUserInfo, this);
        cc.systemEvent.off('update_card_num', this.refreshUserInfo, this);
        cc.systemEvent.off('update_regbind', this.refreshRegbind, this);

        cc.systemEvent.off('prepare_get_gold_succ', this.getGoldSucc, this);
        cc.systemEvent.off('e_activity_read_flag', this.onActivityRead, this);
        cc.systemEvent.off('e_open_inside_webview', this.openInsideWebview, this);

        cc.systemEvent.off('e_enter_PlayNow', this.onPlayNow, this);

        cc.systemEvent.off('scrollview_variation', this.onSetscrollViewVariation, this);
        cc.systemEvent.off('PlayGodGuideStepStartAnim', this.PlayGodGuideStepStartAnim, this);
        // this.btnStoreGame.off('click', this.onBtnStoreGameClick, this);
        cc.systemEvent.off('open_FacebookLogin', this.onFacebookLoginFinish, this);

        cc.systemEvent.off('red_dot_change', this.onRedDotChange, this);
        cc.systemEvent.off('open_game_room', this.onOpenGameRoom, this);

        // 奖励领取成功
        cc.systemEvent.off('reward_succ', this.onRewardSucc, this);
        // 任务完成
        cc.systemEvent.off('finish_task', this.onFinishedTask, this);
        // 获取特殊充值
        cc.systemEvent.off('on_recharge', this.onRecharge, this);
        // 累充活动完成
        cc.systemEvent.off('recharge_activity_finished', this.reqRechargeRedDotAndShow, this);
        // 累充活动结束
        cc.systemEvent.off('recharge_activity_end', this.onRechargeActivityEnd, this);

        // 游戏房间配置修改
        cc.systemEvent.off('game_way_change', this.reqRoomConfig, this);
        cc.systemEvent.off('first_recharge', this.reqRechargeRedDotAndShow, this);
        cc.systemEvent.off('Update_Language', this.UpdateLanguage, this);

        cc.systemEvent.off('game_maintain_notice', this.UpdateGameMaintain, this);
        cc.systemEvent.off("onGetContentFromClipBoard", this.onGetContentFromClipBoard, this);
        cc.systemEvent.off("game_event_show");

    },

    registOpenGameEvent() {
        cc.systemEvent.on('open_toubao_game', this.openTouBaoGame, this);
        cc.systemEvent.on('open_lunpan_game', this.openLunPanGame, this);

        cc.systemEvent.on('open_LuckyRoller_game', this.gotoLuckyRoller, this);
        cc.systemEvent.on('open_Slot_game', this.openSlotGame, this);
        cc.systemEvent.on('open_ShiJieBei', this.openShiJieBei, this);
        cc.systemEvent.on('open_baodian_game', this.openBaoDian, this);
        cc.systemEvent.on('open_Roulette_game', this.gotoRoulette, this);
        cc.systemEvent.on('open_ab_game', this.gotoABgame, this);
        cc.systemEvent.on('open_Bac_game', this.gotoBacgame, this);

        cc.systemEvent.on('open_longhu_game', this.gotoLongHu, this);
        cc.systemEvent.on('open_honghei_game', this.gotoHongHei, this);
        cc.systemEvent.on('open_bcbm_game', this.gotoCarGame, this);
        cc.systemEvent.on('open_shz_game', this.gotoShuiHuZhuan, this);

        cc.systemEvent.on('open_tp_panel', this.openPszRoom, this);
        cc.systemEvent.on('open_royal_tp_panel', this.openRoyalTPRoom, this);
        cc.systemEvent.on('open_rummy_panel', this.openRmRoom, this);
        cc.systemEvent.on('open_rummy_2p_panel', this.open2PRmRoom, this);
        cc.systemEvent.on('open_rummy_sing_panel', this.openRmSingleRoom, this);

        cc.systemEvent.on("open_tp_single_room", this.openTPSingleRoom, this);
        cc.systemEvent.on("open_dzpk_room", this.openDZPKRoom, this);
        cc.systemEvent.on("open_tien_len_room", this.openTienLenRoom, this);
        cc.systemEvent.on("open_rm2p_single_room", this.openRm2PSingleRoom, this);
        cc.systemEvent.on("open_royal_tpsingle_room", this.openRoyalTPSingleRoom, this);
        cc.systemEvent.on("open_13waterv_room", this.open13WaterVRoom, this);
        cc.systemEvent.on("open_ludo_room", this.openLudoRoom, this);

        cc.systemEvent.on('join_dg_game', this.gotoDgGame, this);
        cc.systemEvent.on('join_lh_game', this.gotoLhdj, this);
        cc.systemEvent.on('join_bti_game', this.gotoBtiGame, this);
        cc.systemEvent.on('join_evo_game', this.gotoEvoGame, this);
        cc.systemEvent.on('join_sbo_game', this.gotoSBOGame, this);
        cc.systemEvent.on('join_nydj_game', this.gotoNydjGame, this);
        cc.systemEvent.on('join_cq9_game', this.gotoCq9Game, this);
        cc.systemEvent.on('join_wingo_game', this.gotoWingoGame, this);
        cc.systemEvent.on('join_saba_game', this.gotoSaBaGame, this);
        cc.systemEvent.on('open_gidtoolpg_game', this.showPgSubGame, this);
        cc.systemEvent.on('open_cq9_sub_game', this.openCQ9SubGame, this);
        cc.systemEvent.on('open_cq9fish_sub_game', this.openCQ9FishSubGame, this);
        cc.systemEvent.on('open_EVOPlay_game', this.openEVOPlaySubGame, this);
        cc.systemEvent.on('join_pg_game', this.showPgSubGame, this);
        cc.systemEvent.on('join_aegame_game', this.gotoAEGame, this);
        cc.systemEvent.on(EventDefine.ENTER_GAME, this.OnEnterGame.bind(this), this);

    },
    unRegistOpenGameEvent() {
        cc.systemEvent.off('open_toubao_game', this.openTouBaoGame, this);
        cc.systemEvent.off('open_longhu_game', this.gotoLongHu, this);
        cc.systemEvent.off('open_honghei_game', this.gotoHongHei, this);
        cc.systemEvent.off('open_bcbm_game', this.gotoCarGame, this);
        cc.systemEvent.off('open_shz_game', this.gotoShuiHuZhuan, this);
        cc.systemEvent.off('open_LuckyRoller_game', this.gotoLuckyRoller, this);
        cc.systemEvent.off('open_Slot_game', this.openSlotGame, this);
        cc.systemEvent.off('open_ShiJieBei', this.openShiJieBei, this);
        cc.systemEvent.off('open_baodian_game', this.openBaoDian, this);
        cc.systemEvent.off('open_Roulette_game', this.gotoRoulette, this);
        cc.systemEvent.off('open_ab_game', this.gotoABgame, this);
        cc.systemEvent.off('open_Bac_game', this.gotoBacgame, this);

        cc.systemEvent.off('open_tp_panel', this.openPszRoom, this);
        cc.systemEvent.off('open_royal_tp_panel', this.openRoyalTPRoom, this);
        cc.systemEvent.off('open_rummy_panel', this.openRmRoom, this);
        cc.systemEvent.off('open_rummy_2p_panel', this.open2PRmRoom, this);
        cc.systemEvent.off('open_rummy_sing_panel', this.openRmSingleRoom, this);

        cc.systemEvent.off("open_tp_single_room", this.openTPSingleRoom, this);
        cc.systemEvent.off("open_dzpk_room", this.openDZPKRoom, this);
        cc.systemEvent.off("open_tien_len_room", this.openTienLenRoom, this);
        cc.systemEvent.off("open_rm2p_single_room", this.openRm2PSingleRoom, this);
        cc.systemEvent.off("open_royal_tpsingle_room", this.openRoyalTPSingleRoom, this);
        cc.systemEvent.off("open_13waterv_room", this.open13WaterVRoom, this);
        cc.systemEvent.off("open_ludo_room", this.openLudoRoom, this);

        // cc.systemEvent.off('join_pg_game', this., this);
        cc.systemEvent.off('join_dg_game', this.gotoDgGame, this);
        cc.systemEvent.off('join_lh_game', this.gotoLhdj, this);
        cc.systemEvent.off('join_bti_game', this.gotoBtiGame, this);
        cc.systemEvent.off('join_evo_game', this.gotoEvoGame, this);
        cc.systemEvent.off('join_sbo_game', this.gotoSBOGame, this);
        cc.systemEvent.off('join_nydj_game', this.gotoNydjGame, this);
        cc.systemEvent.off('join_cq9_game', this.gotoCq9Game, this);
        cc.systemEvent.off('join_wingo_game', this.gotoWingoGame, this);
        cc.systemEvent.off('join_saba_game', this.gotoSaBaGame, this);
        cc.systemEvent.off('open_gidtoolpg_game', this.showPgSubGame, this);
        cc.systemEvent.off('open_cq9_sub_game', this.openCQ9SubGame, this);
        cc.systemEvent.off('open_cq9fish_sub_game', this.openCQ9FishSubGame, this);
        cc.systemEvent.off('open_EVOPlay_game', this.openEVOPlaySubGame, this);
        cc.systemEvent.off('join_pg_game', this.showPgSubGame, this);
        cc.systemEvent.off(EventDefine.ENTER_GAME, this.OnEnterGame, this);
        cc.systemEvent.off('join_aegame_game', this.gotoAEGame, this);

    },

    reqRoomConfig() {

        // 获取游戏场次入场限制和底注
        cc.mg.webclient.request("/game/roomConfig", { token: cc.mg.global.user.token }, (ret) => {

            if (!cc.isValid(this, true)) {
                return;
            }

            if (ret.code == 0) {
                cc.mg.global.server.roomConfig = ret.data;

                this.updateRoomConfig(ret.data);
            }
        });
    },

    updateRoomConfig(roomConfig) {
        // 场次配置
        PszRoomMatchLimt.length = 0;
        RmRoomMatchLimt.length = 0;
        Rm2PRoomMatchLimt.length = 0;
        Rm5PSingleRoomMatchLimt.length = 0;
        RoyalTPRoomMatchLimt.length = 0;
        TPSingleRoomMatchLimt.length = 0;
        DZPKRoomMatchLimt.length = 0;
        TLRoomMatchLimt.length = 0;
        Rm2PSingleRoomMatchLimt.length = 0;
        RoyalTPSingleRoomMatchLimt.length = 0;
        BDRoomMatchLimt.length = 0;
        LudoRoomMatchLimt.length = 0;
        for (let i = 0; i < roomConfig.length; i++) {
            let data = roomConfig[i];
            let roomMatch = {
                roomMode: data.way_id,
                limit: data.min_gold,
                winMulti: Number(data.win_multi),
            };

            let id = Math.floor(data.way_id / 10);
            if (id === Math.floor(RoomMode.ROOM_MODE_TP_MATCH_5P_BAISC / 10)) {    // T P
                PszRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_RM_MATCH_5P_BAISC / 10)) {   // rummy
                RmRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_RM_MATCH_2P_BAISC / 10)) {   // rummy 2p
                Rm2PRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_RM_MATCH_5P_SINGLE_BAISC / 10)) {   // rummy 5p  single
                Rm5PSingleRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_ROYAL_TP_MATCH_5P_BAISC / 10)) {   // 皇室 TP
                RoyalTPRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_TP_MATCH_5P_SINGLE_BAISC / 10)) {   //  TP single 
                TPSingleRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_TEXAS_HOLDEM_MATCH_6P_BAISC / 10)) {   // DZPK
                DZPKRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_TL_MATCH_5P_BAISC / 10)) {   // tien len
                TLRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_RM_MATCH_2P_SINGLE_ZERO / 10)) {   // tien len
                Rm2PSingleRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_ROYAL_TP_MATCH_5P_SINGLE_BAISC / 10)) {   // tien len
                RoyalTPSingleRoomMatchLimt.push(roomMatch);
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_LUDO_MATCH_2P_BAISC / 10)) {
                LudoRoomMatchLimt.push(roomMatch)
            }
            else if (id === Math.floor(RoomMode.ROOM_MODE_BAO_DIAN / 10)
                || id === Math.floor(RoomMode.ROOM_MODE_EXP_BAO_DIAN / 10)) { //爆点
                BDRoomMatchLimt.push(roomMatch)
            }

        }
    },

    // ***************************** 红点模块 ***************************

    // 红点更新
    updateRedDot() {
        this.reqOtherRedDot();
        this.reqRechargeRedDotAndShow();

    },

    // 多功能按钮红点
    showGiftRedPoint(bShow) {
        //this.btnGift.children[0].getChildByName("icon_red").active = bShow;
    },

    reqOtherRedDot() {
        let token = cc.mg.global.user.token;
        cc.mg.webclient.request("/home/showRedDotReceived", { token: token }, (ret) => {
            if (!cc.isValid(this, true)) {
                return;
            }
            let _spread_way = false;
            let user_spread_way = false;

            if (ret.code == 0) {
                let ds = ret.data;
                for (const key in ds) {
                    if (Object.prototype.hasOwnProperty.call(ds, key)) {
                        const el = ds[key];
                        let bShow = !!el.is_show;
                        if (key == OtherRedDotTxt.vip_cash_gift) {
                            this.visibleButtons[28].getChildByName("icon_red").active = bShow;
                        }
                        else if (key == OtherRedDotTxt.sign_reward) {
                            this.visibleButtons[14].getChildByName("icon_red").active = bShow;
                        }
                        else if (key == OtherRedDotTxt.notice) {
                            this.visibleButtons[15].getChildByName("icon_red").active = bShow;
                        }
                        else if (key == OtherRedDotTxt.unclaimed_task) {
                            this.visibleButtons[30].getChildByName("icon_red").active = bShow;
                        }
                        else if (key == OtherRedDotTxt.spread_way) {
                            _spread_way = bShow;
                        }
                        else if (key == OtherRedDotTxt.clean_bet) {
                            this.visibleButtons[25].getChildByName("icon_red").active = bShow;
                        }
                        else if (key == OtherRedDotTxt.user_spread_way) {
                            user_spread_way = bShow;
                        }
                        else if (key == OtherRedDotTxt.loss_waiver_red) {
                            let losswaiver = cc.find("Canvas/scrollview_activity/view/btn_activity/loss_waiver");
                            if (losswaiver) {
                                losswaiver.getChildByName("icon_red").active = bShow;
                            }
                            // cc.log("服务端给的losswaiver红点", bShow);
                        } else if (key == OtherRedDotTxt.recharge_send_activity) {
                            let recharge = cc.find("Canvas/scrollview_activity/view/btn_activity/Limited_offer");
                            if (recharge) {
                                recharge.getChildByName("icon_red").active = bShow;
                            }
                        }
                        else {
                            cc.warn("reqOtherRedDot ==>", key);
                        }
                    }
                }
                if (!_spread_way && !user_spread_way) {
                    this.visibleButtons[10].getChildByName("icon_red").active = false;
                } else {
                    this.visibleButtons[10].getChildByName("icon_red").active = true;
                }
            }
            else {
                this.visibleButtons[10].getChildByName("icon_red").active = false;
                this.visibleButtons[28].getChildByName("icon_red").active = false;
                this.visibleButtons[14].getChildByName("icon_red").active = false;
                this.visibleButtons[15].getChildByName("icon_red").active = false;
                this.visibleButtons[30].getChildByName("icon_red").active = false;
                this.visibleButtons[31].getChildByName("icon_red").active = false;
                this.visibleButtons[25].getChildByName("icon_red").active = false;
                this.visibleButtons[44].getChildByName("icon_red").active = false;
            }
            this.refreshActivityBoxPos();
        });

    },

    reqRechargeRedDotAndShow() {
        this.unschedule(this.UpdateSeconds);

        let d = {
            aa: false,
            bb: false,
            cc: false,
        };
        let token = cc.mg.global.user.token;
        cc.mg.webclient.request("/user_recharge/getRechargeInfoV2", { token: token }, (ret) => {
            if (!cc.isValid(this, true)) {
                return;
            }

            if (ret.code == 0) {
                let ds = ret.data;
                for (const k in ds) {
                    if (Object.prototype.hasOwnProperty.call(ds, k)) {
                        const el = ds[k];
                        if (k == RechargeInfos.progressive_recharge_time) {
                            let status = el.status == 1;

                            let inTime = cc.mg.util.CheckDateEventTimeIn(el.start_time, el.end_time, el.cur_time);
                            // let startTime = new Date(el.start_time * 1000).getTime() / 1000;
                            // let endTime = new Date(el.end_time * 1000).getTime() / 1000;
                            // let nowDate = cc.mg.global.get_gs_time();
                            // if (nowDate < startTime || nowDate > endTime) { // 不在活动时间
                            if (status && inTime) {
                                this.btnCumulativeRecharge.active = true;

                                // 红点显示
                                let bShow = (el.is_unclaim == 1);
                                this.btnCumulativeRecharge.getChildByName("icon_red").active = bShow;
                                d.aa = bShow;
                            }
                            else {
                                this.btnCumulativeRecharge.active = false;
                            }
                        }
                        else if (k == RechargeInfos.first_recharge_reward) {
                            let status = el.status == 1;
                            this.btnFirstRechargeActivety.active = status;

                            // 红点显示
                            let bShow = (el.is_unclaim == 1);
                            this.btnFirstRechargeActivety.getChildByName("icon_red").active = bShow;
                            d.bb = bShow;
                        }
                        else if (k == RechargeInfos.recharge_reward) {
                            let bShow = (el.is_discount === 0);
                            this.btnDiscount.active = bShow;
                        }
                        else if (k == RechargeInfos.limit_recharge) {
                            let bShow = (Number(el.status) == 1);
                            let isLimited = el.is_limited !== 1;
                            let Intime = cc.mg.util.CheckDateEventTimeIn(el.start_time, el.end_time, el.cur_time)
                            if (bShow && Intime && isLimited) {
                                this.schedule(this.UpdateSeconds, 1)
                                this.btnLimit.active = true;
                                cc.find("label", this.btnLimit).active = false;
                                let p = el.percent ? el.percent : 0;
                                cc.find("lbl_awardText", this.btnLimit).getComponent(cc.Label).string = "+" + p + "%"
                            } else {
                                this.btnLimit.active = false;
                            }

                            this.LimitDateEndTime = el.end_time;
                            let tDiffTime = (el.cur_time - Math.round(Date.now() / 1000))
                            if (tDiffTime) {
                                this.LimitDiffTime = tDiffTime;
                            } else {
                                this.LimitDiffTime = 0;
                            }
                        }
                        else if (k == RechargeInfos.week_month_card) {
                            let bShow = (el.status == 1);
                            d.cc = bShow;
                            this.btnCard.getChildByName("icon_red").active = bShow;
                            this.btnCard.active = !!el.show;
                        } else if (k == RechargeInfos.recharge_send_gold) {
                            cc.find("Canvas/scrollview_activity/view/btn_activity/Limited_offer").active = !!el.show;
                            cc.find("Canvas/scrollview_activity/view/btn_activity/Limited_offer/icon_red").active = !!el.is_show;
                            cc.mg.global.rechargeBonuses = el;

                        }
                    }
                }

                this.visibleButtons[1] && (this.visibleButtons[1].getChildByName("icon_red").active = false/*  d.aa || d.bb || d.cc */);
                cc.mg.global.server.rechargeRedPoint = d;
                cc.systemEvent.emit('Recharge_RedPoint');
            }
            else {
                this.btnCumulativeRecharge.active = false;
                this.btnFirstRechargeActivety.active = false;
                this.btnDiscount.active = false;
                this.btnLimit.active = false;
                this.btnCard.active = false;
            }

            this.refreshActivityBoxPos();

        });
    },

    refreshActivityBoxPos() {
        let activity = cc.find("Canvas/scrollview_activity/view/btn_activity");

        let key = 0;
        activity.children.forEach((e) => {
            if (e.active) {
                key++;
            }
        })

        let timeout = setTimeout(() => {
            clearTimeout(timeout);
            let view = cc.find("Canvas/scrollview_activity/view");
            // if (view.x == 0) return;
            let posx = 390 - key * 120;
            let len = posx > 0 ? posx : 0;
            view.active = true;

            if (view.x == 0 || view.x == len) return;

            cc.tween(view)
                .to(0.2, { position: cc.v2(len, view.y) })
                .start()

        }, 50);
    },

    onRedDotChange(data) {
        if (!data) {
            return;
        }

        if (data.type == "recharge") {
            this.reqRechargeRedDotAndShow();
        }
        else if (data.type == "other") {
            this.reqOtherRedDot();
        }
        else {
            cc.error("onRedDotChange ERROR!", data);
        }
    },
    // ***************************** 红点模块 END ***************************

    // 累充活动结束
    onRechargeActivityEnd() {
        this.btnCumulativeRecharge.active = false;
    },

    onFacebookLoginFinish: function (data) {
        cc.mg.ui_helper.show_loading('Binding.....');
        // cc.mg.user_manager.facebookLogin(data);
        this.scheduleOnce(() => {
            cc.mg.ui_helper.remove_loading();
        }, 10);

        cc.mg.webclient.request('/account/bindFacebook', { token: cc.mg.global.user.token, third_token: data.third_token, headimg: data.headimg, nickname: data.nickname }, (ret) => {
            cc.mg.ui_helper.remove_loading();
            if (ret.code == 0) {
                cc.mg.global.user.third_token = data.third_token;
                cc.mg.global.user.nickname = data.nickname;
                cc.mg.global.user.third_headimg = "http://graph.facebook.com/" + data.third_token + "/picture?type=large"
                cc.mg.global.user.headimg = "http://graph.facebook.com/" + data.third_token + "/picture?type=large"
                cc.mg.ui_helper.toast('Bind successfully');
                cc.mg.user_manager.saveLoginUser(cc.mg.global.user);
                cc.systemEvent.emit("FacebookLoginChangeMes");
                cc.systemEvent.emit('update_userinfo');

                try {
                    if (ret.data.send_gold > 0) {
                        cc.systemEvent.emit("prepare_get_gold", { gold: ret.data.send_gold, local: true, source: i18n.t("UI_Reward")/* "Reward" */ });
                    }
                } catch (error) {
                    cc.error("/account/bindFacebook  prepare_get_gold Error")
                }
            } else {
                cc.mg.ui_helper.toast(ret.msg);
                //cc.mg.ui_helper.toast('Binding failed');
            }
        });

    },

    closeToggleIsChecked() {
        cc.find("Canvas/layout_right/btn_gift").getComponent(cc.Toggle).isChecked = false;
    },

    initGameButton: function () {
        var array = cc.mg.global.server.game_info;
        if (array == null) {
            cc.error('error cc.mg.global.server.game_info is null');
            return;
        }

        // cc.log('game list = ' + JSON.stringify(array));
        // cc.log('game type = ' + JSON.stringify(cc.mg.global.server.game_type));

        this.initTeenPattiGameButton(array);
    },

    initTeenPattiGameButton(array) {
        let nowGidArr = [];
        for (let n = 0; n < array.length; n++) {
            let gid = array[n].gid;
            GIDTool.isNowGame(gid) && nowGidArr.push(gid);
        }
        cc.mg.global.server.nowGidArr = nowGidArr;

        // let nowArr = [GIDTool.YDZJH, GIDTool.PG, GIDTool.RUMMY, GIDTool.RUMMY_2P, GIDTool.Royal_TP];
        // let content = this.scrollViewGames.getComponent(cc.ScrollView).content;
        // let children = content.children;
        // // 1 YDZJH 2 PG 3 RUMMY 4 P2 rummy 5 Royal TP
        // for (let i = 1; i < children.length; i++) {
        //     let bShow = nowGidArr.indexOf(nowArr[i - 1]) > -1;
        //     if (i != 3) {
        //     children[i].active = bShow;
        //     }
        //     else {  // rummy 特殊处理
        //         let nodeRummy = children[i];
        //         let grayColor = bShow ? cc.Color.WHITE : cc.color(133, 133, 133);
        //         nodeRummy.children[0] && (nodeRummy.children[0].color = grayColor);
        //         nodeRummy.children[1].children[0] && (nodeRummy.children[1].children[0].color = grayColor);
        //         nodeRummy.children[1].children[1] && (nodeRummy.children[1].children[1].active = bShow);
        //         nodeRummy.children[2] && (nodeRummy.children[2].color = grayColor);
        //         nodeRummy.children[2].children[0] && (nodeRummy.children[2].children[0].active = bShow);
        //         nodeRummy.children[3] && (nodeRummy.children[3].active = !bShow);
        //         nodeRummy.children[5] && (nodeRummy.children[5].active = bShow);

        //         nodeRummy.getComponent(cc.Button).interactable = bShow;
        //     }
        // }

        // let child = children[6];
        // child && (child.active = true);
        // child = children[7];
        // child && (child.active = true);
    },
    initGameDownLoadState(gid) {
        if (cc.sys.isNative && GIDTool.isUpdateGame(gid)) {

            let d = cc.sys.localStorage.getItem(GetBundleNameByGid(gid));
            let isExist = jsb.fileUtils.isDirectoryExist(`assets/${GetBundleNameByGid(gid)}`);
            d = isExist ? false : !d;
            let downNode = this.GameNodeList[gid];
            if (!downNode) return;
            cc.find("download", downNode).active = d;
            cc.find("download/progressBar", downNode).active = false;
            cc.find("download/icon_down", downNode).active = d;
        }

    },

    onDownload(info) {
        var self = this;
        this.UpdateGameGid = cc.mg.global.UpdateGameGid;
        if (!this.UpdateGameGid) return;
        if (!this.GameNodeList && !this.UpdateGameGid && !this.GameNodeList[this.UpdateGameGid]) return;
        let downNode = this.GameNodeList[this.UpdateGameGid];
        if (!downNode) return;
        let downProgeress = cc.find("download/progressBar", downNode).getComponent(cc.ProgressBar);
        let downprogeressLabel = cc.find("download/progressBar/label", downNode).getComponent(cc.Label);


        function setdownlabel(percent) {
            if (downprogeressLabel) {
                let temp = parseInt("" + percent * 100);
                let text = `${temp}%`;
                downprogeressLabel.string = text;
            }
        }

        function playDownAnim() {
            if (!self.DownAnimState) {
                self.DownAnimState = 1;
                downNode.getChildByName("download").getComponent(cc.Animation).play()
                downNode.getChildByName("download").getComponent(cc.Animation).once('stop', () => {
                    cc.find("download/icon_down", downNode).active = false;
                    cc.find("download/progressBar", downNode).active = true;
                }, self);
            }
        }

        if (CC_DEBUG) cc.log("  DownLoadInfo=>" + JSON.stringify(info));
        if (info.code == AssetManagerCode.UPDATE_PROGRESSION) {
            let percent = isNaN(info.percent) ? 0 : info.percent;
            if (CC_DEBUG) cc.log(" percent=>", percent);
            downNode.getChildByName("download").active = true;

            // cc.mg.ui_helper.toast(`UPDATE {${info.name}} (${parseInt("" + percent * 100)}%)`);
            playDownAnim()
            downProgeress.progress = percent;
            setdownlabel(percent);


        } else if (info.code == AssetManagerCode.ALREADY_UP_TO_DATE) {
            // cc.mg.ui_helper.toast(`UPDATE {${info.name}} (100%)`);
            let percent = isNaN(info.percent) ? 0 : info.percent;
            playDownAnim()

            downProgeress.progress = percent;
            setdownlabel(percent);
        } else if (info.code == AssetManagerCode.UPDATE_FINISHED) {
            cc.sys.localStorage.setItem(info.name, 1);
            let percent = isNaN(info.percent) ? 0 : info.percent;
            // cc.mg.ui_helper.toast(`UPDATE {${info.name}} (100%)`);
            cc.mg.ui_helper.toast("UPDATE_FINISHED");
            downProgeress.progress = percent;
            setdownlabel(percent);
            downNode.getChildByName("download").active = false;
            this.DownAnimState = 0;
        } else if (info.code == AssetManagerCode.UPDATE_FAILED ||
            info.code == AssetManagerCode.ERROR_NO_LOCAL_MANIFEST ||
            info.code == AssetManagerCode.ERROR_DOWNLOAD_MANIFEST ||
            info.code == AssetManagerCode.ERROR_PARSE_MANIFEST ||
            info.code == AssetManagerCode.ERROR_UPDATING ||
            info.code == AssetManagerCode.ERROR_DECOMPRESS) {
            cc.mg.ui_helper.toast(`UPDATE_FAILED`);

            downNode.getChildByName("download").active = false;
            this.DownAnimState = 0;
        }
    },

    initGameClassList() {

        let btn = this.visibleButtons[46]
        if (btn != null) {
            if (btn.active) {

                let gameType = cc.mg.global.server.game_type;
                let content = cc.find('view/content', btn);
                let item = cc.find('view/type_1', btn);

                this._curIdx = gameType[0].type_id;
                for (let index = 0; index < gameType.length; index++) {
                    let element = gameType[index];
                    let Node = cc.instantiate(item)   //content.children[index]
                    if (!Node || !posData[index]) break;
                    Node.name = element.type_id + "";
                    Node.active = true;
                    Node.scale = this._curIdx != element.type_id ? 0.7 : 1
                    Node.setPosition(posData[index].x, posData[index].y)
                    content.addChild(Node);

                    let type_off = cc.find("type_off", Node);
                    let type_on = cc.find("type_on", Node);

                    type_off.active = this._curIdx != element.type_id;
                    type_on.active = this._curIdx == element.type_id;

                    type_off.getChildByName("label").getComponent(cc.Label).string = element.type_name;
                    type_on.getChildByName("label").getComponent(cc.Label).string = element.type_name;

                    for (let key = 0; key < 3; key++) {
                        let SprNode = cc.find("icon", type_off)
                        if (key == 1) {
                            SprNode = cc.find("type_board", type_off)
                        } else if (key == 2) {
                            SprNode = cc.find("icon", type_on)
                        }

                        let SprUrl = "gold_hall/GameIconBG/type_" + element.type_id;

                        cc.loader.loadRes(SprUrl, cc.SpriteFrame, (err, s) => {
                            if (err) {
                                cc.error(err);
                                return;
                            }
                            SprNode.getComponent(cc.Sprite).spriteFrame = s;
                        });
                    }

                    let event_handler = new cc.Component.EventHandler();
                    event_handler.target = this.node;
                    event_handler.component = "hall_gold";
                    event_handler.handler = "ClassItemCallBack";
                    event_handler.customEventData = element.type_id;

                    Node.getComponent(cc.Button).clickEvents = [];
                    Node.getComponent(cc.Button).clickEvents.push(event_handler)

                }
            }

        }
    },

    initGameNodeView() {
        try {

            let row = cc.mg.global.server.game_rows;
            let b = row && row > 1;
            this.scrollViewGames.active = !b;
            this.scrollViewGames2.active = b;
            let parent = b ? cc.find("view/content", this.scrollViewGames2) : cc.find("view/content", this.scrollViewGames);
            this.GameNodeList = {};
            this.GameNodeList[HallEnum.GameGid.RUMMY] = cc.find("btn_rummy", parent);
            this.GameNodeList[HallEnum.GameGid.TeenPatti] = cc.find("btn_variation", parent);
            this.GameNodeList[HallEnum.GameGid.PGGame] = cc.find("btn_Slogame", parent);
            this.GameNodeList[HallEnum.GameGid.TwoRUMMY] = cc.find("btn_rummy_2g", parent);
            this.GameNodeList[HallEnum.GameGid.royallyTeenPatti] = cc.find("btn_royal", parent);
            this.GameNodeList[HallEnum.GameGid.DragonTiger] = cc.find("btn_lhd", parent);
            this.GameNodeList[GIDTool.TFGAMING] = cc.find("btn_E-Sports", parent);
            this.GameNodeList[GIDTool.DG] = cc.find("btn_DG", parent);
            this.GameNodeList[GIDTool.HH] = cc.find("btn_hhdz", parent);
            this.GameNodeList[GIDTool.BTI] = cc.find("btn_sports", parent);
            this.GameNodeList[GIDTool.EVO] = cc.find("btn_evo", parent);
            this.GameNodeList[GIDTool.WINGO] = cc.find("btn_WinGo", parent);
            this.GameNodeList[GIDTool.SHZ] = cc.find("btn_shz", parent);
            this.GameNodeList[GIDTool.SBO] = cc.find("btn_sbo", parent);
            this.GameNodeList[GIDTool.BCBM] = cc.find("btn_bcbm", parent);
            this.GameNodeList[GIDTool.NYDJ] = cc.find("btn_dj", parent);
            this.GameNodeList[GIDTool.TEXAS] = cc.find("btn_dzpk", parent);
            this.GameNodeList[GIDTool.CQ9] = cc.find("btn_cq9", parent);
            this.GameNodeList[GIDTool.CQ9_FISH] = cc.find("btn_cq9_fish", parent);
            this.GameNodeList[GIDTool.TIEN_LEN] = cc.find("btn_TienLen", parent);
            this.GameNodeList[GIDTool.RUMMY_SINGLE] = cc.find("btn_rummy_single", parent);
            this.GameNodeList[GIDTool.TP_SINGLE] = cc.find("btn_tp_single", parent);
            this.GameNodeList[GIDTool.RUMMY_2P_SINGLE] = cc.find("btn_rummy_2g_single", parent);
            this.GameNodeList[GIDTool.Royal_TP_SINGLE] = cc.find("btn_royal_single", parent);
            this.GameNodeList[GIDTool.EVOPlay] = cc.find("btn_EVOplay", parent);
            this.GameNodeList[GIDTool.LUDO] = cc.find("btn_Ludo", parent);
            this.GameNodeList[GIDTool.SABA] = cc.find("btn_Saba", parent);
            this.GameNodeList[GIDTool.TOUBAO] = cc.find("btn_SicBo", parent);
            this.GameNodeList[GIDTool.LUNPAN] = cc.find("btn_lunpan", parent);
            this.GameNodeList[GIDTool.SLOT777] = cc.find("btn_777slot", parent);
            this.GameNodeList[GIDTool.BAODIAN] = cc.find("btn_baodian", parent);
            this.GameNodeList[GIDTool.AEGAME] = cc.find("btn_AE", parent);
            this.GameNodeList[GIDTool.FOOTBALL] = cc.find("btn_football", parent);
            this.GameNodeList[GIDTool.SHIJIEBEI] = cc.find("btn_shijiebei", parent);
            this.GameNodeList[GIDTool.LROLLER] = cc.find("btn_LuckyRoller", parent);
            this.GameNodeList[GIDTool.Roulette] = cc.find("btn_Roulette", parent);
            this.GameNodeList[GIDTool.ABgame] = cc.find("btn_ABgame", parent);
            this.GameNodeList[GIDTool.Baccarat] = cc.find("btn_Baccarat", parent);
            this.GameNodeList[GIDTool.QPGame] = cc.find("btn_QP", parent);

            var array = cc.mg.global.server.show_arr;
            if (array != null) {
                var noteSwitch = array[46];
                if (noteSwitch === 1) { //需要分类显示
                    this.GameTypeData = cc.mg.global.server.game_type
                    let gameInfo = this.GetClassListData(this._curIdx)
                    if (gameInfo) {
                        this.initGameTypeView(gameInfo.game_list);
                    }
                } else {  //不分类显示
                    this.GameTypeData = cc.mg.global.server.GameSortIndex
                    this.initGameTypeView(this.GameTypeData);
                }
            }


        } catch (error) {
            cc.error("initGameNodeView error", error)
        }

    },

    initGameTypeView(data) {
        try {

            if (!data) return;

            this.HideAllScrollViewItem();

            function getLogoGid(n_gid) {
                let url = null;
                if (!cc.mg.global.server.GameLogoGid) return url;
                for (let index = 0; index < cc.mg.global.server.GameLogoGid.length; index++) {
                    if (cc.mg.global.server.GameLogoGid[index] && cc.mg.global.server.GameLogoGid[index].gid == n_gid) {
                        url = cc.mg.global.server.GameLogoGid[index].pic_url;
                        return url;
                    }
                }

                return url
            }

            for (let index = 0; index < data.length; index++) {
                let el = data[index];
                let isShow = cc.mg.global.server.nowGidArr.indexOf(el.gid) > -1;
                let node = this.GameNodeList[el.gid];
                let url = getLogoGid(el.gid);
                if (node) {
                    if (isShow) {
                        node.active = true;

                        let com = node.getComponent(hall_GameIcon) || node.addComponent(hall_GameIcon);
                        com.setItemData({ icon: url });
                        node.zIndex = index;
                        let b = el.tab && el.tab == 2;
                        let icon = cc.find("icon_hot", node);
                        icon && (icon.active = b);
                        b = el.tab && el.tab == 3;
                        icon = cc.find("icon_new", node);
                        icon && (icon.active = b);
                        let gameinfo = this.getOtherGameInfo(el.gid);
                        let WHNode = node.getChildByName("weihu")
                        if (gameinfo && WHNode) {
                            WHNode.active = true
                            let WH_label = WHNode.getChildByName("Label").getComponent(cc.Label)
                            WH_label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                            let com = WHNode.getComponent(cc.Button) || WHNode.addComponent(cc.Button);
                            if (gameinfo.mtc_status) {
                                let handle = new cc.Component.EventHandler();
                                handle.target = this.node;
                                handle.component = 'hall_gold';
                                handle.handler = 'WHClickCallBack';
                                WH_label.fontSize = 46;
                                WH_label.string = gameinfo.mtc_msg
                                handle.customEventData = gameinfo.mtc_msg;
                                com.getComponent(cc.Button).clickEvents = [];
                                com.getComponent(cc.Button).clickEvents.push(handle);
                            } else {
                                WHNode.active = false;
                            }
                        }
                        this.initGameDownLoadState(el.gid);
                    } else {
                        node.active = false;
                    }
                }
            }

        } catch (error) {
            cc.error('initGameTypeView error', error)
        }
        // this.GameNodeList[GIDTool.Baccarat].active = true; //测试开发的时候打开图标用
    },

    HideAllScrollViewItem() {
        for (let i in this.GameNodeList) {
            const e = this.GameNodeList[i];
            if (e.active) {
                e.active = false;
            }
        }
    },

    ClassItemCallBack(btn, CustomData) {

        cc.mg.util.playBtnClick();
        if (this._curIdx == CustomData || this.isBtnPlay == true) {
            return;
        }
        this._curIdx = CustomData;
        this.ClassBtnPlayAinm();
        let gameInfo = this.GetClassListData(CustomData)
        if (gameInfo)
            this.initGameTypeView(gameInfo.game_list);

    },
    /**
     * 
     * @returns  posData
     *   
    [{ "x": 150, "y": 0 },
    { "x": 105, "y": -120 },
    { "x": 5, "y": -155 },
    { "x": 5, "y": 155 },
    { "x": 105, "y": 120 },]
     */
    ClassBtnPlayAinm() { //移动动画
        var that = this
        let btn = this.visibleButtons[46]
        if (btn != null) {
            let content = cc.find('view/content', btn);
            let node_on = content.getChildByName(this._curIdx + "");
            if (!node_on) return;

            let oldIndexs = {}  //存储原先位置的index
            for (let index = 0; index < content.children.length; index++) {
                let node = content.children[index];
                node.stopAllActions();
                cc.log("content.children log", node.x, node.y)
                for (let index = 0; index < posData.length; index++) {
                    let element = posData[index];
                    if (element.y == Math.round(node.y) && element.x == Math.round(node.x)) {
                        oldIndexs[node.name] = index
                    }
                }

            }

            let nodekey = oldIndexs[this._curIdx];
            let isDown = node_on.y > 0;  //选中目标Y大于0 顺时针,小于0逆时针 
            if (!nodekey) return;//等于0说明在中心位置 不需要移动

            this.isBtnPlay = true;
            let key = !isDown ? nodekey - 0 : content.children.length - nodekey //1 移动1次 2 移动2次;
            let time = key == 1 ? 0.15 : 0.1;
            for (let index = 0; index < content.children.length; index++) {
                const element = content.children[index];

                cc.find("type_off", element).active = this._curIdx != Number(element.name);
                cc.find("type_on", element).active = this._curIdx == Number(element.name);

                let nodescale = this._curIdx == Number(element.name) ? 1 : 0.7;
                let scaleLAction = cc.scaleTo(time, nodescale);

                let num = !isDown ? oldIndexs[element.name] - 1 : oldIndexs[element.name] + 1;
                num = !isDown ? (num < 0 ? 4 : num) : (num > 4 ? 0 : num);

                let action1 = cc.moveTo(time, cc.v2(posData[num].x, posData[num].y));

                let seq = null;
                if (key == 1) {

                    seq = cc.sequence(cc.spawn(action1, scaleLAction), cc.delayTime(0.2), cc.callFunc(() => {
                        element.x = posData[num].x;
                        element.y = posData[num].y;
                        that.isBtnPlay = false;
                    }))
                } else {
                    let num1 = !isDown ? (num - 1 < 0 ? 4 : num - 1) : (num + 1 > 4 ? 0 : num + 1);
                    let action2 = cc.moveTo(time, cc.v2(posData[num1].x, posData[num1].y))
                    seq = cc.sequence(action1, cc.spawn(action2, scaleLAction), cc.delayTime(0.3), cc.callFunc(() => {
                        element.x = posData[num1].x;
                        element.y = posData[num1].y;
                        that.isBtnPlay = false;
                        element.stopAllActions();
                    }))
                }

                if (seq) {
                    element.runAction(seq);
                }
            }

        }
    },

    GetClassListData(n_index) {
        for (let index = 0; index < this.GameTypeData.length; index++) {
            const element = this.GameTypeData[index];
            if (n_index == element.type_id) {
                return element;
            }
        }
        return null;
    },

    initVisibleButton: function () {
        // return;
        if (this.visibleButtons.length == 0) {
            return;
        }
        var array = cc.mg.global.server.show_arr;
        if (array == null) {
            return;
        }
        let i = 0;
        for (; i < array.length; ++i) {
            let btn = this.visibleButtons[i];
            if (btn) {
                if (array[i] == 1) {
                    btn.active = true;
                }
                else {
                    cc.log('hide btn name = ' + btn.name);
                    btn.active = false;
                    // btn.destroy();
                }
            }
        }
        for (; i < this.visibleButtons.length; ++i) {
            let btn = this.visibleButtons[i];
            if (btn) {
                btn.active = false;
            }
        }
        //已经注册过了，不必受账服控制隐藏显示，直接隐藏
        var result = false;
        if (cc.mg.global.user.tel || cc.mg.global.user.account) {
            result = true;
        }
        // if (result) {
        //     this.btnRegift.active = false;
        // }

        let phoneBtn = this.visibleButtons[HallEnum.VisibleBtnTag.Btn_bindPhoneBtn]
        try {
            if (array[HallEnum.VisibleBtnTag.Btn_bindPhoneBtn] == 1 && cc.mg.global.user.tel == "") {
                phoneBtn.active = true
                if (cc.mg.global.user.tel_award) {
                    cc.find("award_bg/label", phoneBtn).getComponent(cc.Label).string = "+" + cc.mg.global.user.tel_award;
                }
            } else {
                phoneBtn.active = false
            }
        } catch (error) {

        }

        // 获取banner页
        if (array[39]) {
            this.reqBanner();
        }
        else {
            this.adapteMultiGameList();
        }

        let isdownload = (array[45] == 1 && !cc.sys.isNative)
        cc.find("Canvas/btn_download").active = isdownload;

        if (cc.mg.global.broweserUrldata) {
            if (cc.mg.global.broweserUrldata.ioswebclip) {
                cc.find("Canvas/btn_download").active = false;
            }
        }

        if (cc.mg.util.CheckH5AppPlatform()) {
            cc.find("Canvas/btn_download").active = false;
        }

        this.refreshRegbind();
    },

    onBtnStoreGameClick() {
        let game_url = cc.mg.global.server.game_url;
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                this.requestSpreadWay();
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                if (game_url) {
                    cc.sys.openURL(game_url);
                }
                else {
                    this.requestSpreadWay();
                }
            }
            else {
                cc.error('unknow platform.');
            }
        }
        else {
            if (game_url) {
                cc.systemEvent.emit('e_open_inside_webview', { url: game_url });
            }
        }
    },
    openInsideWebview(data) {
        var url = data.url;

        if (this.new_webview) {
            this.new_webview.removeFromParent();
            this.new_webview = null;
        }
        if (this.new_webview == null) {
            this.new_webview = cc.instantiate(this.prefabWebview);
            this.node.addChild(this.new_webview);
        }
        this.new_webview.active = true;
        this.new_webview.zIndex = 200;
        this.new_webview.getChildByName('webview').getComponent(cc.WebView).url = url;

    },
    requestSpreadWay: function () {
        cc.mg.webclient.request('/agent/spread_way', { token: cc.mg.global.user.token }, function (data) {
            if (data.code == 1) {
                var allData = data.data;
                let url = allData.share_qr_code;
                if (url) {
                    if (cc.mg.native_class.hasNoPicChoice()) {
                        cc.mg.image_loader.imageLoadTool2(url, function () {
                            cc.mg.ui_helper.toast("授权成功后，请点击保存游戏");
                        });
                        return;
                    }
                    if (cc.mg.native_class.hasPicPrivicy()) {
                        cc.mg.image_loader.imageLoadTool2(url, function () {
                            cc.mg.ui_helper.toast('图片已保存至相册');
                        });
                    }
                    else {
                        cc.mg.ui_helper.toast("请您设置允许该应用访问您的照片 设置>隐私>照片");
                    }
                }
                else {
                    cc.mg.ui_helper.toast("保存游戏失败,请重试");
                }
            }
            else {
                cc.mg.ui_helper.toast(data.msg);
            }
        });
    },

    initDisplay: function () {
        this.refreshUserInfo();
        this.refreshRegbind();
    },

    onReconnect: function () {
        this.refreshUserInfo();
    },

    refreshUserInfo: function () {
        var userData = cc.mg.global.user;
        if (userData != undefined) {
            let labelMoney = this.getLabelMoney();
            if (labelMoney) {
                labelMoney.string = cc.mg.util.toFixed(userData.gold);

                labelMoney.node.active = !cc.mg.global.user.other_close;
                labelMoney.node.parent.getChildByName("layout").active = !!cc.mg.global.user.other_close;
            }

            var playerBtn = this.userInfo.getChildByName('player_btn');
            if (playerBtn && playerBtn.active) {
                cc.mg.util.load_wxhead(playerBtn.getChildByName('mask').children[0], userData.headimg);
                playerBtn.getChildByName('nicheng').getComponent(cc.Label).string = userData.nickname.length > 10 ? userData.nickname.substr(0, 10) + '...' : userData.nickname;
                var myid = userData.uid;
                playerBtn.getChildByName('id').getComponent(cc.Label).string = 'ID:' + myid;

                let VipHeadNode = cc.find("information/player_btn/vip", this.node);

                var array = cc.mg.global.server.show_arr;
                if (array != null) {
                    var noteSwitch = array[28];
                    if (noteSwitch === 1) {
                        VipHeadNode.active = true;
                    } else if (noteSwitch === 0) {
                        VipHeadNode.active = false;
                    }
                }


                if (userData.vip_id && VipHeadNode) {
                    let lbl_VipSpr = VipHeadNode.getChildByName("label").getComponent(cc.Label)
                    lbl_VipSpr.string = "v" + Number(userData.vip_id);
                }
            }
            cc.log('refreshUserInfo = ' + JSON.stringify(userData));
            // cc.find("Canvas/information/button_fk/label").getComponent(cc.Label).string = cc.mg.util.toFixed(userData.gold);
            //cc.find("Canvas/information/button_bank/label").getComponent(cc.Label).string = cc.mg.util.toFixed(userData.bankgold)+'';//银行金币不参与运算，不用格式化
            let THallWnd = this.node.getComponent("hall_wnd")
            if (THallWnd) {
                this.node.getComponent("hall_wnd").ChackGuideCondition();
            }
        }
    },

    /**
     * 登录完成
     */
    loginFinish: function (e) {

    },

    /**
     * 刷新注册绑定
     */
    refreshRegbind: function (e) {
        var result = !(cc.mg.global.user.tel != "" || cc.mg.global.user.account != "");

        this.btnSignUp.active = result;
        if (result && cc.mg.global.server.show_arr[HallEnum.VisibleBtnTag.Btn_bindPhoneBtn]) {
            this.btnSignUp.active = true;
        } else {
            this.btnSignUp.active = false;
        }
        //this.btnRegift.active = false;
        var playerBtn = this.userInfo.getChildByName('player_btn');
        playerBtn.getChildByName('id').getComponent(cc.Label).string = 'ID:' + cc.mg.global.user.uid;
        // if (tel) {
        //     var playerBtn = this.userInfo.getChildByName('player_btn');
        //     playerBtn.getChildByName('id').getComponent(cc.Label).string = 'ID:' + tel;

        // }
    },

    //游戏公告读取消息回调
    onActivityRead(data) {
        let btnActivity = this.visibleButtons[15];
        if (btnActivity && cc.isValid(btnActivity)) {
            btnActivity.getChildByName("icon_red").active = data.isRead ? false : true;
        }
    },

    //-------------------------------------------------------------

    //百人牛牛
    gotoHundredCow: function (e) {

    },
    //-------------------------------------------------------------
    //-------------------------------------------------------------
    //赛车游戏
    gotoCarGame: function (e) {
        this.sendCarMsg();
    },
    /**
     * 向服务端发送请求进入游戏
     */
    sendCarMsg: function () {
        cc.mg.ui_helper.show_loading('Loading...');
        // let scene = RoomModeTool.getSceneName(RoomMode.ROOM_MODE_CAR_HALL);
        // scene && cc.director.preloadScene(scene);

        let mode = RoomMode.ROOM_MODE_CAR_HALL;
        BundleManager.Instance.enterBundle(mode);
        //打点 进入游戏
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.BCBM, wayid: 0, uid: cc.mg.global.user.uid });
    },
    //-------------------------------------------------------------
    //骰宝
    openTouBaoGame: function (e) {
        cc.mg.ui_helper.show_loading('Loading...');
        // let scene = RoomModeTool.getSceneName(RoomMode.ROOM_MODE_TOU_BAO);
        // scene && cc.director.preloadScene(scene);
        // // cc.mg.game_manager.enterScene(GameScene.TOUBAO);
        // cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: RoomMode.ROOM_MODE_TOU_BAO });

        let mode = RoomMode.ROOM_MODE_TOU_BAO;
        BundleManager.Instance.enterBundle(mode);
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.TOUBAO, wayid: 0, uid: cc.mg.global.user.uid });//打点 进入游戏
    },
    //-------------------------------------------------------------

    //轮盘
    openLunPanGame: function (e) {
        cc.mg.ui_helper.show_loading('Loading...');
        // let scene = RoomModeTool.getSceneName(RoomMode.ROOM_MODE_LUN_PAN);
        // scene && cc.director.preloadScene(scene);
        // cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: RoomMode.ROOM_MODE_LUN_PAN });

        let mode = RoomMode.ROOM_MODE_LUN_PAN;
        BundleManager.Instance.enterBundle(mode);

        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.LUNPAN, wayid: 0, uid: cc.mg.global.user.uid });//打点 进入游戏
    },
    //-------------------------------------------------------------

    //slot777 该游戏未使用websocket
    openSlotGame() {
        cc.mg.ui_helper.show_loading('Loading...');
        // let scene = RoomModeTool.getSceneName(RoomMode.ROOM_MODE_777_SLOT_0);
        // scene && cc.director.preloadScene(scene);
        // cc.director.loadScene(GameScene.ROOM_MODE_SELF_SLOT);
        let mode = RoomMode.ROOM_MODE_777_SLOT_0;
        BundleManager.Instance.enterBundle(mode);
        //未使用socket 这里需要注释
        // cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: RoomMode.ROOM_MODE_SELF_SLOT });
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.LUNPAN, wayid: 0, uid: cc.mg.global.user.uid });//打点 进入游戏
    },
    //-------------------------------------------------------------
    //幸运滚轮
    gotoLuckyRoller: function () {

        cc.mg.ui_helper.show_loading('Loading...');

        let mode = RoomMode.ROOM_MODE_LROLLER;
        BundleManager.Instance.enterBundle(mode);

        //打点 进入游戏 
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.LROLLER, wayid: 0, uid: cc.mg.global.user.uid });
    },
    //-------------------------------------------------------------
    //double游戏
    gotoRoulette: function () {

        cc.mg.ui_helper.show_loading('Loading...');

        let mode = RoomMode.ROOM_MODE_Roulette;
        BundleManager.Instance.enterBundle(mode);
        // let scene = RoomModeTool.getSceneName(RoomMode.ROOM_MODE_Roulette);
        // scene && cc.director.preloadScene(scene);
        // cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: RoomMode.ROOM_MODE_Roulette });
        //cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: mode })
        //打点 进入游戏 
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.Roulette, wayid: 0, uid: cc.mg.global.user.uid });
    },
    //爆点游戏
    openBaoDian() {
        //cc.mg.ui_helper.show_loading('Loading...');
        let mode = RoomMode.ROOM_MODE_BAO_DIAN;
        BundleManager.Instance.enterBundle(mode);
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.BAODIAN, wayid: 0, uid: cc.mg.global.user.uid });//打点
    },

    //-------------------------------------------------------------

    openShiJieBei() {
        cc.mg.ui_helper.show_loading('Loading...');
        BundleManager.Instance.enterBundle(RoomMode.ROOM_MODE_WOELD_CUP_SLOT_0);
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.WORLDCUP, wayid: 0, uid: cc.mg.global.user.uid });//打点
    },

    openFootballSlot() {
        cc.mg.ui_helper.show_loading('Loading...');
        BundleManager.Instance.enterBundle(RoomMode.ROOM_MODE_FOOTBALL_SLOT_0);
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.FOOTBALL, wayid: 0, uid: cc.mg.global.user.uid });//打点
    },

    //龙虎斗游戏
    gotoLongHu(e) {
        this.sendLongHuMsg();
    },
    /**
     * 向服务端发送请求进入游戏
     */
    sendLongHuMsg(e) {
        cc.mg.ui_helper.show_loading('Loading...');
        // let scene = RoomModeTool.getSceneName(RoomMode.ROOM_MODE_DRAGON_TIGER_HALL);
        // scene && cc.director.preloadScene(scene);
        // cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: RoomMode.ROOM_MODE_DRAGON_TIGER_HALL });

        let mode = RoomMode.ROOM_MODE_DRAGON_TIGER_HALL;
        BundleManager.Instance.enterBundle(mode);
        //打点 进入游戏
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.LH, wayid: 0, uid: cc.mg.global.user.uid });
    },
    //-------------------------------------------------------------
    //ab游戏
    gotoABgame(e) {
        /**
    * 向服务端发送请求进入游戏
    */
        cc.mg.ui_helper.show_loading('Loading...');
        let mode = RoomMode.ROOM_MODE_ABgame;
        BundleManager.Instance.enterBundle(mode);
        //打点 进入游戏
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.ABgame, wayid: 0, uid: cc.mg.global.user.uid });
    },

    //百家乐游戏
    gotoBacgame(e) {
        /**
    * 向服务端发送请求进入游戏
    */
        cc.mg.ui_helper.show_loading('Loading...');
        let mode = RoomMode.ROOM_MODE_BAI_BACCARAT;
        BundleManager.Instance.enterBundle(mode);
        //打点 进入游戏
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.Baccarat, wayid: 0, uid: cc.mg.global.user.uid });
    },

    //-------------------------------------------------------------
    //红黑大战
    gotoHongHei: function (e) {
        this.sendHongHei();
    },
    /**
     * 向服务端发送请求进入游戏
     */
    sendHongHei: function () {
        cc.mg.ui_helper.show_loading('Loading...');
        // let scene = RoomModeTool.getSceneName(RoomMode.ROOM_MODE_RED_BLACK_HALL);
        // scene && cc.director.preloadScene(scene);
        // cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: RoomMode.ROOM_MODE_RED_BLACK_HALL });

        let mode = RoomMode.ROOM_MODE_RED_BLACK_HALL;
        BundleManager.Instance.enterBundle(mode);
        //打点 进入游戏
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: GIDTool.HH, wayid: 0, uid: cc.mg.global.user.uid });
    },
    //-------------------------------------------------------------

    //水浒传
    gotoShuiHuZhuan: function () {
        cc.mg.ui_helper.show_loading('Loading...');
        cc.mg.util.playBtnClick();
        // cc.mg.game_manager.enterSceneByRoomMode(RoomMode.ROOM_MODE_SHZ);


        let mode = RoomMode.ROOM_MODE_SHZ;
        BundleManager.Instance.enterBundle(mode);
        //打点 进入游戏
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: RoomMode.ROOM_MODE_SHZ, wayid: 0, uid: cc.mg.global.user.uid });
    },
    //-------------------------------------------------------------

    respCreateRoom: function (data) {
        if (!this.node.active) {
            return;
        }
        if (data.Eno == 0 || data.Eno == 30103) {
            cc.mg.ui_helper.show_loading('Loading...');
            cc.mg.global.user.room_no = data.RoomID;
            cc.mg.global.user.roomMode = data.RoomMode;
            cc.mg.room_message_center.startMonitorEvent();
            if (cc.mg.global.user.room_no > 0 && cc.mg.global.user.roomMode < 10000) {
                cc.mg.net.send('req_roominfo');
            }
        }
        else {
            cc.mg.ui_helper.remove_loading();
            var str = errorDefine.get(data.Eno);
            cc.mg.ui_helper.toast(str());
            if (data.Eno == 30112) {
                cc.systemEvent.emit('RoomCardShopView');
            }
        }
    },

    goToHall: function (data) {
        let eno = data.Eno;
        if (eno == 0) {
            cc.mg.hall_message_center.startMonitorEvent();
            cc.mg.global.user.room_no = data.HallId;
            cc.mg.global.user.roomMode = data.RoomMode;
            cc.mg.net.send(cc.mg.net.req_key_map.req_hall_info.key, { hall_id: cc.mg.global.user.room_no });
        } else {
            cc.mg.ui_helper.remove_loading();
            if (eno == 30122) {
                cc.mg.ui_helper.confirm(i18n.t("UI.TP_0_Main_23"), function () {
                    //转向充值页面
                    cc.systemEvent.emit('open_xs_win');
                }, true, i18n.t("UI.Charge_0_main_3"));
            }
            else if (eno == 30103) {
                cc.error("goToHall error" + eno);
                cc.mg.ui_helper.toast("Can't join the room =>", eno);
            }
            else if (eno == 30900) {
                cc.error("goToHall error" + eno);
                cc.mg.ui_helper.toast(i18n.t("UI.System_7"));
            }
            else {
                cc.error("goToHall error" + eno);
                cc.mg.ui_helper.toast("Can't join the room", eno);

            }
        }
    },

    getGoldSucc: function () {
        //取消金币动画
        return;
        cc.mg.audio.playSFX("common/sounds/get_award");
        let node = cc.instantiate(this.effctGoldPrefab);
        this.node.addChild(node);
    },

    //****************************** 外部游戏  ******************************
    gotoLhdj(e) {
        let gameinfo = this.getOtherGameInfo(GIDTool.TFGAMING);
        if (!gameinfo) {
            cc.error("get lhdj config error");
            return;
        }
        this.openOtherGames(GIDTool.TFGAMING);
    },
    gotoBtiGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.BTI);
        if (!gameinfo) {
            cc.error("get bti config error");
            return;
        }
        this.openOtherGames(GIDTool.BTI);
    },
    gotoDgGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.DG);
        if (!gameinfo) {
            cc.error("get dggame config error");
            return;
        }
        this.openOtherGames(GIDTool.DG);
    },
    gotoEvoGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.EVO);
        if (!gameinfo) {
            cc.error("get evo config error");
            return;
        }
        this.openOtherGames(GIDTool.EVO);
    },
    gotoSBOGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.SBO);
        if (!gameinfo) {
            cc.error("get evo config error");
            return;
        }
        this.openOtherGames(GIDTool.SBO);
    },
    gotoNydjGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.NYDJ);
        if (!gameinfo) {
            cc.error("get nydj config error");
            return;
        }
        this.openOtherGames(GIDTool.NYDJ);
    },
    gotoCq9Game() {
        let gameinfo = this.getOtherGameInfo(GIDTool.CQ9);
        if (!gameinfo) {
            cc.error("get cq9 config error");
            return;
        }
        this.openOtherGames(GIDTool.CQ9);
    },
    gotoWingoGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.WINGO);
        if (!gameinfo) {
            cc.error("get wingo config error");
            return;
        }
        this.openOtherGames(GIDTool.WINGO);
    },
    gotoSaBaGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.SABA);
        if (!gameinfo) {
            cc.error("get saba config error");
            return;
        }
        this.openOtherGames(GIDTool.SABA);
    },

    gotoAEGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.AEGAME);
        if (!gameinfo) {
            cc.error("get AE config error");
            return;
        }
        this.openOtherGames(GIDTool.AEGAME);
    },

    gotoQPGame() {
        let gameinfo = this.getOtherGameInfo(GIDTool.QPGame);
        if (!gameinfo) {
            cc.error("get qp config error");
            return;
        }
        this.openOtherGames(GIDTool.QPGame);
    },

    openOtherGames(gid) {
        var that = this;
        let gameInfo = that.getOtherGameInfo(gid);
        if (!gameInfo) {
            return null;
        }
        if (gameInfo.show_rate_tips == 1) {
            cc.mg.ui_helper.confirm(gameInfo.rate_tips, () => {
                that.gotoExGame(gameInfo);
            }, true, i18n.t("General.General_1"), null, i18n.t('General.General_2'));
        } else {
            that.gotoExGame(gameInfo);
        }

    },
    getOtherGameInfo(gid) {
        let gameInfo = cc.mg.global.server.other_game;
        if (!gameInfo) {
            return null;
        }
        for (let index = 0; index < gameInfo.length; index++) {
            const element = gameInfo[index];
            if (element.gid == gid) {
                return element;
            }
        }
        return null;
    },
    //调用外部游戏
    gotoExGame(gameinfo) {
        if (gameinfo == null) {
            cc.error('gotoPgSubGame error 0');
            return;
        }

        if (gameinfo == null || gameinfo.least_gold == null) {
            cc.mg.ui_helper.toast('Load server config failed, please login again');
            return;
        }

        //打点 进入游戏,外部游戏的时候点击了,但是成功没成功进入不知道
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: gameinfo.gid, wayid: 0, uid: cc.mg.global.user.uid });
        var that = this;
        let token = cc.mg.global.user.token;
        cc.mg.ui_helper.show_loading('Loading...', 5000);
        cc.mg.webclient.request("/other_game/checkGameStatus", { token: token }, (ret) => {
            cc.mg.ui_helper.remove_loading();
            cc.log('checkGameStatus = ', ret);
            if (ret.code == 0 && ret.data) {
                let gid = ret.data.game_id;
                if (gid && gameinfo.gid != gid) {
                    cc.mg.ui_helper.toast(ret.data.msg);
                }
                else {

                    if (cc.mg.global.user.gold < parseFloat(gameinfo.least_gold)) {
                        that.onConfirm('SC_LessThanChips', gameinfo.least_gold)
                        return;
                    }
                    cc.mg.webclient.request('/account/getUserInfo',  { token: cc.mg.global.user.token }, function (ret) {
                    
                        if (ret.code == 0) {
                            cc.mg.global.user.total_recharge = ret.data.total_recharge;
                            let gold = cc.mg.global.gameRechargeLimit(gameinfo.gid)

                            if (parseFloat(cc.mg.global.user.total_recharge) < gold) {
                                that.onConfirm('SC_LessRecChips', gold + "");
                                return;
                            }
        
                            let languagetype = cc.mg.util.GetLanguageType();
                            let url = `${gameinfo.url}?token=${token}&language=${languagetype}`;
                            cc.mg.global.ex_game_url = url;
                            let s = gameinfo.game_show == 1 ? GameScene.PORTRAIT : GameScene.LANDSCAPE;
                            cc.director.loadScene(s);
                        } 
                    });
                   
                }
            }
            else {
                cc.mg.ui_helper.toast(ret.msg);
            }
        });
    },

    onConfirm(txt, gold) {
        cc.mg.ui_helper.confirm(i18n.t(txt).replace("{gold}", gold), function () {
            cc.mg.global.selectShop(() => {
                cc.systemEvent.emit('open_xs_win');
            }, () => {
                cc.systemEvent.emit('open_discount_win');
            });
        }, true, i18n.t("UI.Charge_0_main_3"));
    },
    //****************************** 外部游戏 END ******************************

    onBtnUpdateGold: function (e) {
        return;
        cc.mg.util.playBtnClick();
        let btn = e.target;
        btn.getComponent(cc.Button).interactable = false;
        let labelMoney = this.getLabelMoney();
        labelMoney.string = '刷新中';
        cc.log('onBtnUpdateGold');
        let that = this;
        cc.mg.webclient.request("/user/getUserWallet", { token: cc.mg.global.user.token }, function (ret) {
            cc.log('getUserWallet = ', ret);
            if (ret.code == 0) {
                var data = ret.data;
                cc.mg.global.user.gold = data.gold;
            }
            else {
                cc.mg.ui_helper.toast(ret.msg);
            }
            that.renderTimerOUt();
            that.unschedule(that.renderTimerOUt);
        });
        this.scheduleOnce(this.renderTimerOUt, 3);
    },
    renderTimerOUt() {
        let btn = cc.find("Canvas/information/button_fk/btn_add");
        btn.getComponent(cc.Button).interactable = true;
        let labelMoney = this.getLabelMoney();
        labelMoney.string = cc.mg.util.toFixed(cc.mg.global.user.gold);
    },
    getLabelMoney: function () {
        let node = cc.find("Canvas/information/btn_gold/label");
        return node == null ? null : node.getComponent(cc.Label);
    },
    autoFlushGold: function () {
        return;
        if (cc.mg.global.user.isFlush) {
            return;
        }
        cc.mg.global.user.isFlush = true;
        let self = this;
        cc.log('autoFlushGold ===========>>');
        cc.mg.webclient.request("/user/getUserWallet", { token: cc.mg.global.user.token }, function (ret) {
            if (ret.code == 0) {
                var data = ret.data;
                cc.mg.global.user.gold = data.gold;
                let labelMoney = self.getLabelMoney();
                if (labelMoney) {
                    labelMoney.string = cc.mg.util.toFixed(data.gold);
                }
            }
            else {
                cc.error(ret.msg);
            }
        });
    },

    onPlayNow() {
        if (!cc.mg.click_interceptor.isClickAllow()) return;

        cc.mg.ui_helper.show_loading('Loading...', 5000);

        let roomMode = RoomModeTool.getFitRoomMode(cc.mg.global.user.gold);
        if (roomMode < 0) {
            cc.warn("not roomMode !! ===============================>>");
            return;
        }

        cc.mg.net.send(cc.mg.net.req_key_map.req_match_room.key, { RoomMode: roomMode, Rematch: 1 });
    },

    onSetscrollViewVariation(data) {


        if (data == 1) {
            this.node.getChildByName("scrollview_variation").getComponent(cc.ScrollView).scrollToRight(0)

        }
        this.node.getChildByName("scrollview_variation").getComponent(cc.ScrollView).horizontal = false;
    },
    PlayGodGuideStepStartAnim() {
        return;
        let GodguideStartani = this.node.getChildByName("guidance").getChildByName("step0")
        var userData = cc.mg.global.user;
        let RoomOpenNum = []
        RoomOpenNum[1] = { "room": 0.5, "gold": 50 }
        RoomOpenNum[2] = { "room": 1, "gold": 100 }
        RoomOpenNum[3] = { "room": 5, "gold": 500 }
        RoomOpenNum[4] = { "room": 10, "gold": 1000 }
        RoomOpenNum[5] = { "room": 20, "gold": 2000 }
        RoomOpenNum[6] = { "room": 50, "gold": 5000 }

        this.closePszRoom();
        if (GodguideStartani) {
            GodguideStartani.active = true;
            let StrNum = RoomOpenNum[userData.is_guide]
            if (StrNum) {
                GodguideStartani.getChildByName("layout").getChildByName("label_num").getComponent(cc.Label).string = "" + StrNum.gold
                GodguideStartani.getChildByName("label_tips").getComponent(cc.Label).string = "(Room " + StrNum.room + " is available)"
            }

        }
    },

    onOpenGameRoom(data) {
        if (data === "psz") {
            this.openPszRoom();
        }
    },

    onRewardSucc() {
        cc.mg.audio.playSFX("common/sounds/get_award");
        let node = cc.instantiate(this.effctGoldPrefab);
        this.node.addChild(node);
    },

    //****************** 任务 **************

    onFinishedTask(data) {
        this.reqOtherRedDot();
    },
    //****************** 任务 end**************

    // *************** 充值 *******************
    // 点击充值监听事件
    onRecharge() {
        this.reqRechargeRedDotAndShow();
    },

    //每秒时钟回调
    UpdateSeconds() {
        if (this.btnLimit.active && this.LimitDateEndTime) {

            let tCurrentTime = Math.round(Date.now() / 1000) + this.LimitDiffTime;

            let tEndTime = this.LimitDateEndTime;

            let MilliSeconds = (tEndTime - tCurrentTime);
            let TimeSecond = Math.floor(MilliSeconds % 60);
            if (TimeSecond < 10) {
                TimeSecond = "0" + TimeSecond
            }

            let TimeMin = Math.floor(MilliSeconds / 60 % 60);
            if (TimeMin < 10) {
                TimeMin = "0" + TimeMin;
            }

            let TimeHour = Math.floor(MilliSeconds / 3600);
            if (TimeHour < 10) {
                TimeHour = "0" + TimeHour
            }
            let tstring = TimeHour + ":" + TimeMin + ":" + TimeSecond;
            cc.find("label", this.btnLimit).getComponent(cc.Label).string = tstring
            cc.find("label", this.btnLimit).active = true;
            if (MilliSeconds <= 1) {

                this.btnLimit.active = false;
            }

        }

    },

    // *************** 充值 end *******************
    initPgGame() {
        let gameInfo = this.getOtherGameInfo(GIDTool.PG);
        if (gameInfo) {
            if (gameInfo != null && gameInfo.least_gold != null && this.labelPgLimit) {
                this.labelPgLimit.string = i18n.t("UI.TP_0_Main_1") + ":" + gameInfo.least_gold;
            }
        }
    },

    initMakeMoneyLabel() {
        let node = cc.find("btn_money/qp", this.node);
        if (node) {
            let v = cc.mg.global.server.par_recruit_status == 1;
            let labelNode = cc.find("label", node);
            node.active = v;
            let string = cc.mg.global.server.par_recruit_config.toast;
            labelNode.getComponent(cc.Label).string = string;
        }
    },

    UpdateLanguage() {
        this.initPgGame();
    },

    withdrawToAdjustEvent() {
        cc.mg.webclient.request("/user/getWithdrawGold", { token: cc.mg.global.user.token }, (ret) => {
            if (ret.code == 0) {

                ret.data.forEach(element => {
                    if (element.amount) {
                        cc.mg.native_class.AdjustlogEvent("withdraw", element.amount);
                        cc.mg.native_class.FacebooklogEvent("withdraw", element.amount);
                    }

                });
            }
        });
    },

    RechargeToAdjustEvent() {
        cc.mg.webclient.request("/user/getRechargeGold", { token: cc.mg.global.user.token }, (ret) => {
            if (ret.code == 0) {
                ret.data.forEach(element => {
                    if (element.amount) {
                        cc.mg.native_class.AdjustlogEvent("recharge", element.amount);
                        cc.mg.native_class.FacebooklogEvent("recharge", element.amount);
                    }

                });

            }
        });
    },

    setVisibleNodeBtn() {
        try {
            this.visibleButtons[38] = cc.find("scrollview_games/view/content/btn_playnow", this.node);

        } catch (error) {
            cc.error('setVisibleNodeBtn hall_gold Error')
        }

    },

    UpdateVisibleButton() {
        var _this = this;

        let login_user_list = cc.mg.user_manager.getLoginUserList();
        let user = login_user_list.length > 0 ? login_user_list[0] : null;

        var sendData = {
            mainVer: cc.mg.global.mainVer,
            subVer: cc.mg.global.subVer,
            pkgName: cc.mg.global.package_name,
            platform: cc.sys.os,
            token: '',
            Type: cc.sys.platform,
        };
        if (user) {
            sendData.token = user.token;
        }

        cc.mg.webclient.request("/config/showconfig", sendData, (ret) => {
            if (!cc.isValid(this.node, true)) {
                return;
            }

            if (ret.code == 0) {
                cc.mg.global.server.show_arr = ret.data.show_arr;
                cc.mg.global.server.game_info = ret.data.game_info;
                this.initVisibleButton();
                this.initGameButton();
                this.initGameNodeView()
            } else {
                cc.mg.ui_helper.toast(ret.msg);
            }
        });
    },

    // 外部游戏下分
    otherGameDown() {
        this.otherGameDownCount++;

        if (this.otherGameDownCount > GameDownCount) {
            cc.mg.global.user.other_close = false;
            this.refreshUserInfo();
            return;
        }

        let token = cc.mg.global.user.token;
        cc.mg.webclient.request("/other_game/gameDown", { token: token }, (ret) => {
            cc.log("other_game gameDown", ret);
            if (ret.code == 0 && ret.data && ret.data.result) {
                this.unschedule(this.otherGameDown);
            }
        });
    },

    // 获取banner页
    reqBanner() {
        if (this.bReqBanner) {
            return;
        }

        this.bReqBanner = true;
        cc.mg.webclient.request("/notice/get_desk_notices", { token: cc.mg.global.user.token }, (ret) => {
            this.bReqBanner = false;
            if (!cc.isValid(this.node, true)) {
                return;
            }

            // cc.log(ret);
            if (ret.code == 0 && ret.data && !!ret.data.length) {
                this.visibleButtons[39].active = true;

                let datas = ret.data;
                let com = this.visibleButtons[39].getComponent(PageBannerSingle)
                    || this.visibleButtons[39].addComponent(PageBannerSingle);
                com.initItem(datas);
            }
            else {
                this.visibleButtons[39].active = false;

                cc.error('reqBanner error = ' + ret.msg);
            }

            this.adapteMultiGameList();
        });
    },

    openPszRoom(e) {
        //this.updateGameRoom(PszRoomMatchLimt, (e ? e.target : null), GIDTool.YDZJH);
        let mode = RoomMode.ROOM_MODE_TP_MATCH_5P_ZERO;
        BundleManager.Instance.enterBundle(mode);
    },
    openRmRoom(e) {
        // this.updateGameRoom(RmRoomMatchLimt, (e ? e.target : null), GIDTool.RUMMY);
        let mode = RoomMode.ROOM_MODE_RM_MATCH_5P_ZERO;
        BundleManager.Instance.enterBundle(mode);
    },
    open2PRmRoom(e) {
        // this.updateGameRoom(Rm2PRoomMatchLimt, (e ? e.target : null), GIDTool.RUMMY_2P);

        let mode = RoomMode.ROOM_MODE_RM_MATCH_2P_ZERO;
        BundleManager.Instance.enterBundle(mode);
    },
    openRmSingleRoom(e) {
        // this.updateGameRoom(Rm5PSingleRoomMatchLimt, (e ? e.target : null), GIDTool.RUMMY_SINGLE);

        let mode = RoomMode.ROOM_MODE_RM_MATCH_5P_SINGLE_ZERO;
        BundleManager.Instance.enterBundle(mode);

    },
    openRoyalTPRoom(e) {
        // this.updateGameRoom(RoyalTPRoomMatchLimt, (e ? e.target : null), GIDTool.Royal_TP);
        let mode = RoomMode.ROOM_MODE_ROYAL_TP_MATCH_5P_ZERO;
        BundleManager.Instance.enterBundle(mode);

    },
    openTPSingleRoom(e) {
        // this.updateGameRoom(TPSingleRoomMatchLimt, (e ? e.target : null), GIDTool.TP_SINGLE);
        let mode = RoomMode.ROOM_MODE_TP_MATCH_5P_SINGLE_ZERO;
        BundleManager.Instance.enterBundle(mode);


    },
    openDZPKRoom(e) {

        let mode = RoomMode.ROOM_MODE_TEXAS_HOLDEM_MATCH_6P_BAISC;
        BundleManager.Instance.enterBundle(mode);
        //this.updateGameRoom(DZPKRoomMatchLimt, (e ? e.target : null), GIDTool.TEXAS);

    },
    openTienLenRoom(e) {
        let mode = RoomMode.ROOM_MODE_TL_MATCH_5P_BAISC;
        BundleManager.Instance.enterBundle(mode);

        //this.updateGameRoom(TLRoomMatchLimt, (e ? e.target : null), GIDTool.TIEN_LEN);

    },
    openRm2PSingleRoom(e) {
        // this.updateGameRoom(Rm2PSingleRoomMatchLimt, (e ? e.target : null), GIDTool.RUMMY_2P);
        let mode = RoomMode.ROOM_MODE_RM_MATCH_2P_SINGLE_ZERO;
        BundleManager.Instance.enterBundle(mode);

    },
    openRoyalTPSingleRoom(e) {
        // this.updateGameRoom(RoyalTPSingleRoomMatchLimt, (e ? e.target : null), GIDTool.Royal_TP_SINGLE);
        let mode = RoomMode.ROOM_MODE_ROYAL_TP_MATCH_5P_SINGLE_BAISC;
        BundleManager.Instance.enterBundle(mode);

    },
    open13WaterVRoom(e) {
        this.updateGameRoom(SssWaterVMatchLimt, (e ? e.target : null), GIDTool.SSS);

    },

    openLudoRoom(e) {
        // this.updateGameRoom(LudoRoomMatchLimt, (e ? e.target : null), GIDTool.LUDO);
        let mode = RoomMode.ROOM_MODE_LUDO_MATCH_2P_BAISC;
        BundleManager.Instance.enterBundle(mode);

    },
    enterGameEvent(roomMode, gid) {
        cc.mg.ui_helper.show_loading('Loading...', 5000);
        let mode = roomMode;
        cc.mg.res_manager.loadBundle(mode, () => {
            cc.mg.net.send(cc.mg.net.req_key_map.req_match_room.key, { RoomMode: mode, Rematch: 1 });
        });

        //打点 选择场次
        PushTrackRecord({ type: PointType.WAY_SELECT, gid: gid, wayid: roomMode, uid: cc.mg.global.user.uid });
    },

    enterBDGameEvent(roomMode, gid) {
        cc.mg.ui_helper.show_loading('Loading...');
        let mode = roomMode;
        //打点 进入游戏,有房间选择的游戏
        cc.mg.res_manager.loadBundle(mode, () => {
            cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: mode });
        });
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: gid, wayid: 0, uid: cc.mg.global.user.uid });
    },

    updateBDGameRoom(datas, node, gid) {
        let self = this
        if (this.bOpening) {
            return;
        }
        this.bOpening = true;

        let anim = node.getComponent(cc.Animation);
        anim.play("baodian");
        anim.once("finished", this.gameRoomFinished, this);

        datas = datas ? datas : [];
        let parent = this.scrollViewBaodian.content;
        let len = parent.children.length - 1;
        for (let i = datas.length - 1; i >= 0; i--) {
            let item = parent.children[len - i];
            let data = datas[i];
            item.name = "" + i;
            if (i == 0) {
                item.children[1].getComponent(cc.Label).string = "" + data.winMulti;
                item.children[2].active = data.limit > 0;
                item.children[2].getComponent(cc.Label).string = i18n.t("UI.TP_0_Main_1") + ":" + data.limit;

            }
            this.addClickEvent(item, () => {
                cc.mg.util.playBtnClick();
                if (!cc.mg.click_interceptor.isClickAllow()) return;

                if (data.roomMode == RoomMode.ROOM_MODE_EXP_BAO_DIAN) {
                    cc.mg.webclient.request("/user/userExperienceGameTime", { token: cc.mg.global.user.token, way_id: data.roomMode }, (ret) => {
                        if (ret.code == 0) {
                            self.enterBDGameEvent(data.roomMode, gid)
                        } else {
                            cc.mg.ui_helper.toast(ret.msg);
                        }
                    });
                } else {
                    if (cc.mg.global.user.gold < parseFloat(data.limit)) {
                        cc.mg.ui_helper.confirm(i18n.t("SC_LessThanChips").replace("{gold}", data.limit), function () {
                            cc.mg.global.selectShop(() => {
                                cc.systemEvent.emit('open_xs_win');
                            }, () => {
                                cc.systemEvent.emit('open_discount_win');
                            });
                        }, true, i18n.t("UI.Charge_0_main_3"));
                        return;
                    }

                    self.enterBDGameEvent(data.roomMode, gid);
                }

            });
        }
        this.scrollViewBaodian.scrollToLeft();
    },

    updateGameRoom(datas, node, gid) {
        if (this.bOpening) {
            return;
        }
        this.bOpening = true;

        let anim = node.getComponent(cc.Animation);
        anim.play("new_changci");
        anim.once("finished", this.gameRoomFinished, this);

        let bgSf;
        bgSf = "btn_wg"

        let IconBgList = [];
        IconBgList[GIDTool.YDZJH] = "btn_variation"
        IconBgList[GIDTool.RUMMY] = "btn_rummy"
        IconBgList[GIDTool.RUMMY_2P] = "btn_rummy2"
        IconBgList[GIDTool.Royal_TP] = "btn_variation_royal"
        IconBgList[GIDTool.TEXAS] = "btn_dzpk"
        IconBgList[GIDTool.RUMMY_SINGLE] = "btn_variation_royal"
        IconBgList[GIDTool.TIEN_LEN] = "btn_rummy"
        IconBgList[GIDTool.TP_SINGLE] = "btn_wg"
        IconBgList[GIDTool.Royal_TP_SINGLE] = "btn_rummy2"
        IconBgList[GIDTool.LUDO] = "btn_lhdj"


        if (IconBgList[gid]) {
            bgSf = IconBgList[gid];
        }

        //打点 进入游戏,有房间选择的游戏
        PushTrackRecord({ type: PointType.ENTER_GAME, gid: gid, wayid: 0, uid: cc.mg.global.user.uid });

        datas = datas ? datas : [];
        let parent = this.scrollViewRoom.content;
        let children = parent.children;
        for (let i = 0; i < datas.length; i++) {
            let item = children[i];
            let data = datas[i];
            if (!item) {
                item = cc.instantiate(children[0]);
                parent.addChild(item);
            }
            item.active = true;
            item.children[1].getComponent(cc.Label).string = "" + data.winMulti;
            item.children[2].getComponent(cc.Label).string = i18n.t("UI.TP_0_Main_1") + ":" + data.limit;
            this.addClickEvent(item, () => {
                cc.mg.util.playBtnClick();
                if (!cc.mg.click_interceptor.isClickAllow()) return;
                if (cc.mg.global.user.gold < parseFloat(data.limit)) {
                    cc.mg.ui_helper.confirm(i18n.t("SC_LessThanChips").replace("{gold}", data.limit), function () {
                        cc.mg.global.selectShop(() => {
                            cc.systemEvent.emit('open_xs_win');
                        }, () => {
                            cc.systemEvent.emit('open_discount_win');
                        });
                    }, true, i18n.t("UI.Charge_0_main_3"));
                    return;
                }
                this.enterGameEvent(data.roomMode, gid);
            });

            if (bgSf) {
                cc.loader.loadRes("gold_hall/GameIconBG/" + bgSf, cc.SpriteFrame, (err, s) => {
                    if (err) {
                        cc.error('load fail', err);
                        return;
                    }
                    if (!item) return;

                    if (!cc.isValid(item, true)) {
                        return;
                    }

                    item.getComponent(cc.Sprite).spriteFrame = s;
                });
            }
        }

        for (let m = datas.length; m < children.length; m++) {
            children[m].active = false;
        }

        this.scrollViewRoom.scrollToLeft();
    },

    closeGameRoom() {
        if (this.bOpening) {
            return;
        }
        this.bOpening = true;

        let anim = this.node.getComponent(cc.Animation);
        let animname = !this.scrollViewBaodian.node.active ? "new_changci_quit" : "baodian_quit";
        anim.play(animname);
        anim.once("finished", this.gameRoomFinished, this);

    },

    gameRoomFinished() {
        this.bOpening = false;
    },

    addClickEvent(node, cb) {
        if (node) {
            if (node.getComponent(cc.Button)) {
                node.removeComponent(cc.Button);
            }
            let btn = node.addComponent(cc.Button);
            btn.transition = cc.Button.Transition.SCALE;
            btn.duration = 0.1;
            btn.zoomScale = 1.05;

            if (node.hasEventListener("click")) {
                node.off("click");
            }
            node.on("click", cb, this);
        }
    },

    openGamesNew(gid) {
        var that = this;
        let gameInfo = that.getOtherGameInfo(gid);
        if (!gameInfo) {
            return null;
        }

        function fu(n_gid) {
            PushTrackRecord({ type: PointType.ENTER_GAME, gid: n_gid, wayid: 0, uid: cc.mg.global.user.uid });
            that.getComponent(cc.Animation).playAdditive('pg_place');
        }
        if (gameInfo.show_rate_tips == 1) {
            cc.mg.ui_helper.confirm(gameInfo.rate_tips, () => {
                fu(gid)
            }, true, i18n.t("General.General_1"), null, i18n.t('General.General_2'));
        } else {
            fu(gid)
        }

    },

    showPgSubGame() {
        cc.mg.global.currGameType = GIDTool.PG;
        this.openGamesNew(GIDTool.PG);

    },
    openCQ9SubGame() {
        cc.mg.global.currGameType = GIDTool.CQ9;
        this.openGamesNew(GIDTool.CQ9);
    },
    openCQ9FishSubGame() {
        cc.mg.global.currGameType = GIDTool.CQ9_FISH;
        this.openGamesNew(GIDTool.CQ9_FISH);
    },
    openEVOPlaySubGame() {
        cc.mg.global.currGameType = GIDTool.EVOPlay;
        this.openGamesNew(GIDTool.EVOPlay);
    },

    WHClickCallBack(btn, custom) {
        cc.mg.ui_helper.toast(custom);
    },

    UpdateGameMaintain(data) {
        try {
            let gameWHData = cc.mg.global.server.other_game;
            let updatedata = data.data
            if (gameWHData) {
                for (let index = 0; index < updatedata.length; index++) {
                    const element = updatedata[index];

                    for (let index2 = 0; index2 < gameWHData.length; index2++) {
                        const _AllGameData = gameWHData[index2];
                        if (element.gid == _AllGameData.gid) {
                            let LanguageText = cc.mg.util.GetMainTenanceLanguageText(element);
                            if (LanguageText) {
                                _AllGameData.mtc_msg = LanguageText;
                            }
                            _AllGameData.mtc_status = Number(element.mtc_status);
                        }
                    }

                }

                //cc.mg.global.server.other_game = gameWHData;
            }
        } catch (error) {
            cc.error("UpdateGameMaintain Error")
        }

        this.initGameNodeView()

    },

    checkJoinRoom() {
        cc.mg.native_class.getContentFromClipBoard()
        let num = cc.mg.global.getRoomNoFromNative();
        if (num > 0) {
            cc.mg.ui_helper.show_loading('');
            cc.mg.net.send(cc.mg.net.req_key_map.req_join_room.key, { room_no: Number(num), RoomType: 1 });
        }
    },

    onGetContentFromClipBoard() {
        this.checkJoinRoom();
    },

    //所有进入游戏按钮入口
    OnEnterGame(bundleConfig) {
        cc.log(bundleConfig)

        let mode = bundleConfig.roomMode;

        if (mode == RoomMode.ROOM_MODE_RM) {
            cc.mg.ui_helper.show_loading('Loading...');
            cc.mg.res_manager.loadBundle(mode, () => {
                var hallSceneName = RoomModeTool.getSceneName(mode);
                cc.director.loadScene(hallSceneName);
            });
            return
        }

        if (mode < 10000) {
            //this.ParentNode.getComponent("hall_wnd").onGameRoomLlist(bundleConfig.customData);
            cc.mg.global.IsUpdateSuccess = true;
            if (RoomModeTool.isTPGame(mode)) {
                this.updateGameRoom(PszRoomMatchLimt, this.node, GIDTool.YDZJH);
            } else if (RoomModeTool.isTPSingleGame(mode)) {
                this.updateGameRoom(TPSingleRoomMatchLimt, this.node, GIDTool.TP_SINGLE);
            } else if (RoomModeTool.isRoyalTPGame(mode)) {
                this.updateGameRoom(RoyalTPRoomMatchLimt, this.node, GIDTool.Royal_TP);
            } else if (RoomModeTool.isRoyalTPSingleGame(mode)) {
                this.updateGameRoom(RoyalTPSingleRoomMatchLimt, this.node, GIDTool.Royal_TP_SINGLE);
            } else if (RoomModeTool.isRmGame(mode)) {
                this.updateGameRoom(RmRoomMatchLimt, this.node, GIDTool.RUMMY);
            } else if (RoomModeTool.isRm2pGame(mode)) {
                this.updateGameRoom(Rm2PRoomMatchLimt, this.node, GIDTool.RUMMY_2P);
            } else if (RoomModeTool.isRmSINGLEGame(mode)) {
                this.updateGameRoom(Rm5PSingleRoomMatchLimt, this.node, GIDTool.RUMMY_SINGLE)
            } else if (RoomModeTool.isRm2pSINGLEGame(mode)) {
                this.updateGameRoom(Rm2PSingleRoomMatchLimt, this.node, GIDTool.RUMMY_2P_SINGLE)
            } else if (RoomModeTool.isLUDOGame(mode)) {
                this.updateGameRoom(LudoRoomMatchLimt, this.node, GIDTool.LUDO);
            } else if (RoomModeTool.isTEXASGame(mode)) {
                this.updateGameRoom(DZPKRoomMatchLimt, this.node, GIDTool.TEXAS);
            } else if (RoomModeTool.isTIENLENGame(mode)) {
                this.updateGameRoom(TLRoomMatchLimt, this.node, GIDTool.TIEN_LEN);
            } else if (RoomModeTool.isSLOTGame(mode)) {
                cc.mg.global.user.roomMode = mode;
                cc.mg.res_manager.loadBundle(mode, () => {
                    cc.mg.game_manager.enterScene(GameScene.SLOT777)
                });
            } else if (RoomModeTool.isShiJieBei(mode) || RoomModeTool.isFootball(mode)) {
                cc.mg.global.user.roomMode = mode;
                cc.mg.res_manager.loadBundle(mode, () => {
                    cc.mg.game_manager.enterScene(GameScene.SHIJIEBEI)
                });
            } else if (RoomModeTool.isLuckyRoller(mode)) {
                cc.mg.global.user.roomMode = mode;
                cc.mg.res_manager.loadBundle(mode, () => {
                    cc.mg.game_manager.enterScene(GameScene.LROLLER)
                });
            }

        }
        else {
            cc.mg.global.IsUpdateSuccess = true;
            if (RoomModeTool.isBaoDian(mode) && BDRoomMatchLimt.length > 1) {
                this.updateBDGameRoom(BDRoomMatchLimt, this.node, GIDTool.BAODIAN);
                return;
            }

            cc.mg.ui_helper.show_loading('Loading...');
            if (mode == RoomMode.ROOM_MODE_SHZ) {
                cc.mg.res_manager.loadBundle(mode, () => {
                    cc.mg.game_manager.enterSceneByRoomMode(RoomMode.ROOM_MODE_SHZ);
                });
            }
            else {
                cc.mg.res_manager.loadBundle(mode, () => {
                    cc.mg.net.send(cc.mg.net.req_key_map.req_join_hall.key, { hall_id: mode });
                });
            }
        }
    },




    update(dt) {
        cc.mg.last_game_click_position = cc.find("Canvas/scrollview_games2/view/content").x;
    },
});
