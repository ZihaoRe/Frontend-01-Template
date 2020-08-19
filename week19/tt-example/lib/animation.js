export class Timeline {
    constructor(){
        this.animations = new Set()
        this.finishedAnimations = new Set();
        this.AddTimes = new Map()
        this.requestId = null;
        this.state = "inited"
        // //剪头函数，保护this
        // this.tick = ()=>{
        // }
    }
    //写在外面，this的值是不固定的
    tick(){
        let t = Date.now() - this.startTime 
        // let animations = this.animations.filter(animation =>!animation.finished)
        // console.log(animations)
        for(let animation of this.animations){
            // 
            let addTime = this.AddTimes.get(animation)
            let {object,property,start,end,template,duration, delay,timingFunction} = animation

            if(t < delay +addTime){
                continue
            }
            
            let progression = timingFunction((t - delay-addTime)/duration) //0-1之间的数，百分比

            if(t>duration +delay +addTime){
                progression = 1
                this.animations.delete(animation)
                this.finishedAnimations.add(animation)
                // animation.finished = true
                // continue
            } 

            

            // let val = start + progression * (end -start) //value就是根据progression来计算
            let val = animation.valueFromProgression(progression) //value就是根据progression来计算
            // console.log(val)
            object[property]  = template(val)
        }
        if(this.animations.size){
            this.requestId = requestAnimationFrame(()=>this.tick())
        } else {
            this.requestId = null
        }
        
    }
    pause(){
        if(this.state !="playing"){
            return
        }
        this.state = "paused"
        this.pauseTime = Date.now()
        //取消下一个tick
        if(this.requestId != null){
            cancelAnimationFrame(this.requestId)
            this.requestId = null;
        }   
    }
    resume(){
        if(this.state !="paused"){
            return
        }
        this.state = "playing"
        //没有做状态管理，多次点击就出错了。
        //把暂停的时间扣掉
        this.startTime += Date.now() - this.pauseTime
        this.tick()
    }

    start(){
        if(this.state !="inited"){
            return
        }
        this.state = "playing"
        this.startTime = Date.now()
        this.tick()
    }

    add(animation,addTime){
        animation.finished = false
        this.animations.add(animation)
        if(this.state == "playing" &&  this.requestId == null){
            this.tick()
        }
        if(this.state == "playing"){
            this.AddTimes.set(animation,addTime != void 0?addTime:Date.now() - this.startTime)
            // animation.addTime = addTime != void 0?addTime:Date.now() - this.startTime
        } else {
            this.AddTimes.set(animation,addTime != void 0?addTime: 0)
            // animation.addTime = addTime != void 0?addTime: 0
        }
        
    }
    restart(){
        if(this.state == "playing"){
            this.pause()
        }
        for(let animation of this.finishedAnimations){
            this.animations.add(animation)
        }
       
        this.finishedAnimations = new Set()
        this.requestId = null;
        this.state = "playing"

        this.startTime = Date.now()
        this.pauseTime = null
        this.tick()
    }
    
    reset(){
        if(this.state == "playing"){
            this.pause()
        }

        this.animations = new Set()
        this.AddTimes = new Map()
        this.finishedAnimations = new Set()
        // this.animations.forEach(animation=>{
        //     animation.finished  = false
        // })
        this.requestId = null;
        

        this.startTime = Date.now()
        this.pauseTime = null
        this.state = "inited"
    }
}

export class Animation {
    constructor(object,property,start,end,duration, delay,timingFunction,template){
        this.object = object
        this.template = template
        this.property = property
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay 
        this.timingFunction = timingFunction 
    }
    valueFromProgression(progression){
        return this.start + progression * (this.end-this.start)
    }

}
export class ColorAnimation {
    constructor(object,property,start,end,duration, delay,timingFunction,template){
        this.object = object
        this.template = template || ((v) =>`rgba(${v.r},${v.g},${v.b},${v.a})`)
        this.property = property
        this.start = start
        this.end = end
        this.duration = duration
        this.delay = delay 
        this.timingFunction = timingFunction 
    }
    valueFromProgression(progression){
        return {
            r:this.start.r + progression * (this.end.r-this.start.r),
            g:this.start.g + progression * (this.end.g-this.start.g),
            b:this.start.b + progression * (this.end.b-this.start.b),
            a:this.start.a + progression * (this.end.a-this.start.a),
        }
    }

}


// let animation = new Animation(objexct,property,start,end,duration, delay,timingFunction)

// let animation2 = new Animation(objexct,property,start,end,duration, delay,timingFunction)


// let timeline = new Timeline;
// timeline.add(animation)
// timeline.add(animation2)
// timeline.start()
// timeline.start()

// timeline.pause()
// timeline.resume()

// timeline.stop()

// setTimeout()
// setInterval(() => {
    
// }, interval);

// requestAnimationFrame


// timingFunction 相当于ease linear easein 
// js每帧去修改动画性能会不会有问题，要看js改的那部分会不会触发重排，只改transform不会触发重排就没问题。如果强制要用GPU去渲染，可以设置transform3D
