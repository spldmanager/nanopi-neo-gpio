/**
 * @Desc
 * @author Lenovo
 * @date 2018/12/20
 * @version
 */
var cmd = require('node-cmd')
const events = require('events')
let intervalEvent = []
module.exports = {
    setOn:(pin)=>{
        cmd.get(`gpio mode ${pin} out && gpio write ${pin} 1`,(error,stdout,stderr)=>{
            if(error) console.error(`set gpio ${pin} error`)
            else console.info(`gpio ${pin} set to 1`)
        })
    },
    setOff:(pin)=>{
        cmd.get(`gpio mode ${pin} out && gpio write ${pin} 0`,(error,stdout,stderr)=>{
            if(error) console.error(`set gpio ${pin} error`)
            else console.info(`gpio ${pin} set to 0`)
        })
    },
    getStatus:(pin,cb)=>{
        cmd.get(`gpio mode ${pin} out && gpio read ${pin}`,(error,stdout,stderr)=>{
            if(error) console.error(`read gpio ${pin} error`)
            else if(cb) cb(parseInt(stdout.trim()))
        })
    },
    addPinEventListener:(pin,mode)=>{
        let value
        let _e = {pin:pin,mode:mode};
        //判断当前pin和mode是否已经在例行监听中
        for(var i of intervalEvent){
            if(i.pin == _e.pin && i.mode == _e.mode){
                _e = i
                console.debug(`pin ${pin} and mode ${mode} is already in listening`)
            }
            break;
        }
        //如果在监听中，则返回该时间对象
        if(_e.hasOwnProperty('event')) return _e.event
        //如果不再监听中，则创建事件对象
        var emitter = new events.EventEmitter();
        let interval = setInterval(()=>{
            cmd.get(`gpio mode ${pin} ${mode} && gpio read ${pin}`,(error,stdout,stderr)=>{
                if(error) console.error(`interval read ${pin} error`)
                else if(value != parseInt(stdout.trim())){
                    emitter.emit(`change`,`${parseInt(stdout.trim())}`)
                    console.log(`old value is ${value}, new value is ${parseInt(stdout.trim())}`)
                }
                value = parseInt(stdout.trim())
            })
        },100)
        intervalEvent.push({pin:pin,mode:mode,event:emitter,interval:interval})
        return emitter
    },
    removePinEventListener:(event)=>{
        for(var i=0;i<intervalEvent.length;i++){
            if(intervalEvent[i].event == event) {
                clearInterval(intervalEvent[i].interval)
                intervalEvent.splice(i, 1)
                break;
            }
        }

    }
}
