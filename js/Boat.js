class Boat {
    constructor(x, y, w, h,boatPos,bAnimation) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.heigth = h;
        this.boatPos=boatPos;
        this.animation=bAnimation;
        this.speed=0.05;

        var op = {
            restitution: 0.8,
            friction: 1.0,
            dencity: 1.0
        }

        this.body = Bodies.rectangle(x, y, w, h, op);
        this.image = loadImage("./assets/boat.png");
        World.add(world, this.body);
    }

    animate(){
        this.speed+=0.05%1.1;
    }

    display() {
        //var angle= this.body
        var index= floor(this.speed%this.animation.length);
        var pos = this.body.position;
        push();
        translate(pos.x,pos.y);
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPos, this.width, this.height);
        pop();
    }
    destroy(index){
        this.animation=brokenBAnimation;
        this.speed=0.05;
        this.width=400;
        this.heigth=450;
        this.isBroken=true;
        setTimeout(()=>{
            Matter.World.remove(world,boats[index].body);
            boats.splice(index,1)
        },2000);//Que cosa y cuando
    }
}