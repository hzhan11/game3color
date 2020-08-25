// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        board:{
            default: null,
            type: cc.Node
        }
    },

    onTouchStart: function(){
        console.log("touch "+this.xx+","+this.yy);
    },

    onTouchEnd: function(){
        if(this.lcolor == 2)
            return;
        if(this.selected == false && this.board.onBlockSelected(this)){
            this.select();
        }
        else if(this.selected == true){
            this.board.onBlockUnSelected(this);
            this.unSelect();
        }
    },

    select: function(){
        console.log(this.xx + "," +this.yy+","+this.node.color);
        this.node.getChildByName("inner").getComponent(cc.Animation).play();
        this.selected = true;
    },

    unSelect: function(){
        this.node.getChildByName("inner").getComponent(cc.Animation).stop();
        this.node.getChildByName("inner").scale = 1;
        this.selected = false;
    },

    setColorAndUnSelect(namecolor, color){
        this.bcolor = namecolor;
        this.node.color = color;
        if(this.bcolor == "BLACK"){
            this.lcolor = 2;
            this.node.getComponent(cc.Animation).play();
        }
        else{
            this.lcolor +=1;
        }
        this.unSelect();
    },
    
    onTouchMove: function(){
        console.log("Move");
    },
    
    onTouchCancel: function(){
        console.log("Cancel");
    },

    copy(nodeMoveFrom){
        this.node.color = nodeMoveFrom.color;
        this.bcolor = nodeMoveFrom.getComponent("block").bcolor;
        this.lcolor = nodeMoveFrom.getComponent("block").lcolor;
        this.node.opacity = 200;
    },

    reset(){
        var rc = Math.floor(Math.random() * 3);
        if(rc==0){
            this.node.color = cc.Color.CYAN;
            this.bcolor = "CYAN";
        }
        else if(rc==1){
            this.node.color = cc.Color.YELLOW;
            this.bcolor = "YELLOW";
        }
        else{
            this.node.color = cc.Color.MAGENTA;
            this.bcolor = "MAGENTA";
        }
        this.lcolor = 0;
        this.selected = false;
        this.node.opacity = 200;
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.reset();
    },

    onDestroy () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    setXY: function(x,y){
        this.xx = x;
        this.yy = y;
    },

    start () {
        
    },

    // update (dt) {},
});
