// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        scoreOfGameLabel: {
            default: null,
            type: cc.Label
        },
        scoreOfMax: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    padding:function(num, length) {
        return (Array(length).join("0") + num).slice(-length);
    },

    onLoad () {
        this.score = 0;
        this.max = 0;
        this.scoreOfGameLabel.string = "本局:" + this.padding(this.score,3);
        this.scoreOfMax.string = "最高:" + this.padding(this.max,3);
    },

    reset: function(score){
        if(this.max < this.score)
            this.max = this.score;
        this.scoreOfMax.string = "最高:" + this.padding(this.max,3);
        this.score = 0;
        this.scoreOfGameLabel.string = "本局:" + this.padding(this.score,3);
    },

    addScore: function(score){
        this.score+=score;
        this.scoreOfGameLabel.string = "本局:" + this.padding(this.score,3);
    },

    start () {

    },

    // update (dt) {},
});
