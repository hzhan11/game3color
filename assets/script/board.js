// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },
        game: {
            default: null,
            type: cc.Node
        },
        XCOUNT: 7,
        YCOUNT: 7,
    },

    twoNodeAdjacent: function(node1,node2) {
        if(Math.abs(node1.xx-node2.xx)+Math.abs(node1.yy-node2.yy)==1)
            return true;
        else
            return false;
    },

    checkCanMix(){
        
    },

    checkBefore: function(node) {
        if(this.selectNodes.length==0){
            return true;
        }
        else if(this.selectNodes.length==1){
            if(this.selectNodes[0].lcolor!=node.lcolor)
                return false;
            if(this.selectNodes[0].bcolor==node.bcolor)
                return false;
            return this.twoNodeAdjacent(node, this.selectNodes[0]);
        }
        else if(this.selectNodes.length==2){
            var d1 = this.twoNodeAdjacent(node, this.selectNodes[0]);
            var d2 = this.twoNodeAdjacent(this.selectNodes[0], this.selectNodes[1]);
            var d3 = this.twoNodeAdjacent(node, this.selectNodes[1]);
            var count = 0;
            if(d1)
                count++;
            if(d2)
                count++;
            if(d3)
                count++;
            var c1 = node.bcolor;
            var c2 = this.selectNodes[0].bcolor;
            var c3 = this.selectNodes[1].bcolor;
            if(count==2 && c1!=c2 && c1!=c3 && c2!=c3)
                return true;
            else
                return false;
        }
        else
            return false;
    },

    mix2:function(c1,c2) {
        if(c1==c2)
            return c1;
        if((c1=="CYAN"&&c2=="YELLOW")||(c2=="CYAN"&&c1=="YELLOW")){
            return "GREEN";
        }
        else if((c1=="CYAN"&&c2=="MAGENTA")||(c2=="CYAN"&&c1=="MAGENTA")){
            return "BLUE";
        }
        else if((c1=="MAGENTA"&&c2=="YELLOW")||(c2=="MAGENTA"&&c1=="YELLOW")){
            return "RED";
        }
    },

    mix3:function(c1,c2,c3) {
        return "BLACK";
    },

    getColorByName(nameOfColor){
        if(nameOfColor == "GREEN")
            return cc.Color.GREEN;
        else if(nameOfColor == "BLUE")
            return cc.Color.BLUE;
        else if(nameOfColor == "RED")
            return cc.Color.RED;
        else if(nameOfColor == "CYAN")
            return cc.Color.CYAN;
        else if(nameOfColor == "YELLOW")
            return cc.Color.YELLOW;
        else if(nameOfColor == "MAGENTA")
            return cc.Color.MAGENTA;
        else if(nameOfColor == "BLACK")
            return cc.Color.BLACK;
        else
            return null;
    },

    getMixColor:function() {
        if(this.selectNodes.length == 1){
            var c1 = this.selectNodes[0].bcolor;
            return this.mix2(c1,c1);
        }
        else if(this.selectNodes.length == 2 && this.selectNodes[0].lcolor == 0 
                    && this.selectNodes[1].lcolor == 0 ){
            var c1 = this.selectNodes[0].bcolor;
            var c2 = this.selectNodes[1].bcolor;
            return this.mix2(c1,c2);
        }
        else if(this.selectNodes.length == 3 && ( ( this.selectNodes[0].lcolor == 0 
            && this.selectNodes[1].lcolor == 0 && this.selectNodes[2].lcolor == 0 ) 
            || (this.selectNodes[0].lcolor == 1 && this.selectNodes[1].lcolor == 1 && this.selectNodes[2].lcolor == 1) )){
            var c1 = this.selectNodes[0].bcolor;
            var c2 = this.selectNodes[1].bcolor;
            var c3 = this.selectNodes[2].bcolor;
            return this.mix3(c1,c2,c3);
        }
        else
            return null;
    },

    refresh(){
        var color = this.getMixColor();
        if(color==null)
            return;
        var mixButtonNode = cc.find("Canvas/buttonMix/Background");
        mixButtonNode.color = this.getColorByName(color);
    },

    onBlockSelected(node){
        var ok = this.checkBefore(node);
        if(ok){
            this.selectNodes.push(node);
            this.refresh();
            return true;
        }
        else
            return false;
    },

    onBlockUnSelected(node){
        var index = this.selectNodes.indexOf(node);
        this.selectNodes.splice(index, 1);
        this.refresh();
    },

    reorgMatrix(){
        var children = this.node.children;
        for(var i=0;i<children.length;i++){
            var node = children[i];
            if(node.getComponent("block").bcolor == "BLACK"){
                var xx = node.getComponent("block").xx;
                var yy = node.getComponent("block").yy;
                for(var newy=yy-1;newy>=0;newy--){
                    var nodeMoveFrom = children[newy*this.XCOUNT+xx];
                    var nodeMoveTo = children[(newy+1)*this.XCOUNT+xx];
                    nodeMoveTo.getComponent("block").copy(nodeMoveFrom);
                }
                var rnode = children[xx];
                rnode.getComponent("block").reset();
            }
        }
    },

    performMix(){
        if(this.selectNodes.length==1)
            return;
        var namecolor = this.getMixColor();
        if(namecolor == null)
            return;
        var color = this.getColorByName(namecolor);
        for(var i=0;i<this.selectNodes.length;i++){
            if(this.selectNodes[i].lcolor == 0)
                this.game.getComponent("game").addScore(1);
            else
                this.game.getComponent("game").addScore(2);
            this.selectNodes[i].getComponent("block").setColorAndUnSelect(namecolor,color);
        }
        this.selectNodes = [];
        this.scheduleOnce(function(){
            this.reorgMatrix();
        },1);
    },

    again(){
        this.node.removeAllChildren();
        this.onLoad();
        this.game.getComponent("game").reset();
    },

    onLoad () {
        for(var yy=0;yy<this.YCOUNT;yy++)
            for(var xx=0;xx<this.XCOUNT;xx++){
                var newBlock = cc.instantiate(this.blockPrefab);
                newBlock.getComponent("block").setXY(xx,yy);
                newBlock.getComponent("block").board = this;
                this.node.addChild(newBlock);
            }
        this.selectNodes = [];
    },

    start () {
        
    },

    // update (dt) {},
});
