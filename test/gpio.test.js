/**
 * @Desc
 * @author Lenovo
 * @date 2018/12/20
 * @version
 */
var expect  = require('chai').expect
var gpio = require('../lib/gpio')
describe('gpio',function () {
    let event;
    describe('.setOn',function () {
        it('should set pin to high',function () {
            gpio.setOn(7)
            gpio.getStatus(7,(value)=>{
                expect(value).to.be.equal(1)
            })
        })
    });
    describe('.setOff',function () {
        it('should set pin to low',function () {
            gpio.setOff(7)
            gpio.getStatus(7,(value)=>{
                expect(value).to.be.equal(0)
            })
        })
    });
    describe('.addPinEventListener',function (done) {
        it('should get event',function () {
            event = gpio.addPinEventListener(7,'out')
            expect(event).not.to.be.equal(undefined)
        })
        it('should not get same event',function () {
            let event2 = gpio.addPinEventListener(7,'out')
            expect(event2).to.be.equal(event)
        })
        it('should get change event',function () {
            let result = 0
            event.on('change',(value)=>{
                console.log(`change`)
                result++
            })
            setTimeout(()=>{   gpio.setOn(7)       },100)
            setTimeout(()=>{   gpio.setOff(7)      },200)
            setTimeout(()=>{   gpio.setOn(7)       },300)
            setTimeout(()=>{
                console.log(result)
                expect(result).to.be.equal(undefined)
                done()
            },2000)
        })
    })
})
