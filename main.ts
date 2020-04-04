let CountM1 = 0
let CountM2 = 0

/*
basic.showLeds(`
    . . . . .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `);

input.onButtonPressed(Button.A, function () {
    basic.showLeds(`
    . . # . .
    . # # # .
    # . # . #
    . . # . .
    . . # . .
    `)
    CountM1 = 0
    CountM2 = 0
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 255)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, 255)
    basic.pause(2000)
    basic.showLeds(`
    . . # . .
    . . # . .
    # . # . #
    . # # # .
    . . # . .
    `)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, 255)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, 255)
    basic.pause(2000)

    basic.showIcon(IconNames.Skull)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 255)
    motor.MotorRun(motor.Motors.M2, motor.Dir.CW, 255)
    basic.pause(2000)
    motor.motorStopAll()
    basic.showIcon(IconNames.Asleep)
    basic.showString("M1=")
    basic.showNumber(CountM1)
    basic.pause(1000)
    basic.showString("M2=")
    basic.showNumber(CountM2)
})

input.onPinPressed(TouchPin.P0, function () {
    CountM1 += 1
})

input.onPinPressed(TouchPin.P1, function () {
    CountM2 += 1
})

*/
const CMD_FWD = "do_przod"
const CMD_LEFT = "w_lewo"
const CMD_RIGHT = "w_prawo"
const CMD_STOP = "stop"
const CMD_EMPTY = "empty"
const CMD_SETSPEED = "predkosc"
const CMD_SETSPEEDL = "p_prawy"
const CMD_SETSPEEDR = "p_lewy"
const CMD_CHGMTRSPEED = "zmienszy"
const CMD_CHGGROUP = "grupa"
const CMD_GETLCOUNT = "lcount"
const CMD_GETRCOUNT = "rcount"
const CMD_RESETCOUNT = "rescnt"
const CMD_SETOPT = "set_opt"
const CMD_GETDURATION = "dczas"

const CMD_DISPSTR = "#ST#"
const CMD_DSPLED = "#LD#"
const CMD_DSPICON = "w_iko"

const ON = true
const OFF = false

const MSG_COUNTERS = "counters"

const RET_LCOUNT = "rlcount"
const RET_RCOUNT = "rrcount"
const RET_DURATION = "pczas"
const RET_END_TIME = "kczas"


const INIT_GROUP = 3

namespace RobotImp {
    export function MotorLeft(SpeedVal: number) {
        if (SpeedVal >= 0) motor.MotorRun(motor.Motors.M1, motor.Dir.CW, SpeedVal)
        else motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, -SpeedVal)
    }

    export function MotorRight(SpeedVal: number) {
        if (SpeedVal >= 0) motor.MotorRun(motor.Motors.M2, motor.Dir.CW, SpeedVal)
        else motor.MotorRun(motor.Motors.M2, motor.Dir.CCW, -SpeedVal)
    }

    export function CounterStatus(): number {
        return CountM1 + CountM2 * 1000
    }

    export function Init() {
        basic.pause(1000)
    }

}




let SpeedLeft: number = 0
let SpeedRight: number = 0
let LastCmd: string = CMD_EMPTY
let LastCmdTime: number = input.runningTime()
let MotorOffTime: number = 0
let RGrpEndTime: number = 0
let DebugMode = false

let EnableMsgDist = false
let EnableMsgLine = false

let DspVal = ''

let RadioCh = INIT_GROUP
if (input.buttonIsPressed(Button.A)) RadioCh = INIT_GROUP + 10
else if (input.buttonIsPressed(Button.B)) RadioCh = INIT_GROUP + 20
radio.setGroup(RadioCh)
basic.showString("CH=" + RadioCh)

if (input.buttonIsPressed(Button.AB)) {
    // show demo
    let szybko = 100
    music.playTone(Note.C, 100)
    basic.showString("Demo")
    while (1) {
        CmdSetSpeed(100)
        /*CmdDspIcon(IconNames.Asleep)
        CmdForward(ON, 1000, -szybko, szybko)
        CmdDspIcon(IconNames.Giraffe)
        CmdForward(ON, 1000, szybko, -szybko)
        CmdDspIcon(IconNames.Ghost)
        CmdForward(ON, 1000, szybko, 0)
        CmdDspIcon(IconNames.EigthNote)
        CmdForward(ON, 1000, 0, -szybko)
        CmdDspIcon(0)*/
        //doPrzodRozp(255, 20)
    }
}

//doPrzodRozp(50, 255, 10)


function doPrzodRozp(SpeedS: number, SpeedE: number, jakDlugo: number) {
    basic.showArrow(ArrowNames.North)
    for (let index = SpeedS; index < SpeedE; index = index + 2) {
        CmdForward(ON, jakDlugo, index, -index)
        basic.pause(jakDlugo)
    }
    basic.showIcon(IconNames.Asleep)
}

function doTyluRozp(SpeedS: number, SpeedE: number, jakDlugo: number) {
    basic.showArrow(ArrowNames.North)
    for (let index = SpeedS; index < SpeedE; index = index + 2) {
        CmdForward(ON, jakDlugo, -index, index)
        basic.pause(jakDlugo)
    }
    basic.showIcon(IconNames.Asleep)
}



input.onButtonPressed(Button.AB, function () {
    DebugMode = !DebugMode
    basic.showString(' D=' + DebugMode)
})

input.onButtonPressed(Button.A, function () {
    if (DebugMode) {
        basic.showString('C')
        RobotImp.Init()
        basic.clearScreen()
    }
})

input.onButtonPressed(Button.B, function () {
    if (DebugMode) {
        basic.showString('B')
        RobotImp.Init()
        basic.clearScreen()
    }
    basic.showArrow(ArrowNames.North)
    CmdFwd(ON, 1000, 100)
    basic.pause(2000)
    basic.showArrow(ArrowNames.South)
    CmdBck(ON, 1000, 100)
    basic.pause(2000)
    basic.showArrow(ArrowNames.North)
    CmdFwd(ON, 1000, 255)
    basic.pause(2000)
    basic.showArrow(ArrowNames.South)
    CmdBck(ON, 1000, 255)
    basic.pause(2000)
    basic.showIcon(IconNames.Asleep)
})



//speed must be >50
function CmdFwd(On: boolean, Duration: number, Speed: number) {
    let ls = 50
    let la = (Speed - 50) / 50
    if (On) {
        for (let index = 1; index < 50; index++) {
            RobotImp.MotorLeft(ls)
            RobotImp.MotorRight(-ls)
            ls += la
            basic.pause(10)
        }
        LastCmd = CMD_FWD
        LastCmdTime = input.runningTime()
        MotorOffTime = LastCmdTime + Duration - 500
        RobotImp.MotorLeft(Speed)
        RobotImp.MotorRight(-Speed)

    } else {
        for (let index = 1; index < 50; index++) {
            RobotImp.MotorLeft(ls)
            RobotImp.MotorRight(-ls)
            ls += la
            basic.pause(10)
        }
        RobotImp.MotorLeft(Speed)
        RobotImp.MotorRight(-Speed)
        MotorOffTime = 0
    }
}

//speed must be >50
function CmdBck(On: boolean, Duration: number, Speed: number) {
    let ls = 50
    let la = (Speed - 50) / 50
    if (On) {
        for (let index = 1; index < 50; index++) {
            RobotImp.MotorLeft(-ls)
            RobotImp.MotorRight(ls)
            ls += la
            basic.pause(10)
        }
        LastCmd = CMD_FWD
        LastCmdTime = input.runningTime()
        MotorOffTime = LastCmdTime + Duration - 500
        RobotImp.MotorLeft(-Speed)
        RobotImp.MotorRight(Speed)

    } else {
        for (let index = 1; index < 50; index++) {
            RobotImp.MotorLeft(-ls)
            RobotImp.MotorRight(ls)
            ls += la
            basic.pause(10)
        }
        RobotImp.MotorLeft(-Speed)
        RobotImp.MotorRight(Speed)
        MotorOffTime = 0
    }
}



function CmdForward(On: boolean, Duration: number, SpeedL: number, SpeedR: number) {
    if (On) {
        LastCmd = CMD_FWD
        LastCmdTime = input.runningTime()
        MotorOffTime = LastCmdTime + Duration
        RobotImp.MotorLeft(SpeedL)
        RobotImp.MotorRight(SpeedR)

    } else {
        RobotImp.MotorLeft(SpeedL)
        RobotImp.MotorRight(SpeedR)
        MotorOffTime = 0
    }
}

function CmdLeft(Duriation: number) {
    CmdForward(ON, Duriation, -SpeedLeft, SpeedRight)
    LastCmd = CMD_LEFT
}

function CmdRight(Duriation: number) {
    CmdForward(ON, Duriation, SpeedLeft, -SpeedRight)
    LastCmd = CMD_RIGHT
}

function CmdStop() {
    CmdForward(OFF, 0, 0, 0)
    LastCmd = CMD_STOP
}

function CmdSetSpeed(SpeedVal: number) {
    SpeedLeft = SpeedVal
    SpeedRight = SpeedVal
}

function CmdSetSpeedL(SpeedVal: number) {
    SpeedLeft = SpeedVal
}

function CmdSetSpeedR(SpeedVal: number) {
    SpeedRight = SpeedVal
}

function CmdChangeMotorSpeed(EncodedValue: number) {

    let TmpSpeedL = ((EncodedValue / 512) - ((EncodedValue / 512) % 1)) - 256
    let TmpSpeedR = EncodedValue % 512 - 256
    if (MotorOffTime != 0) {
        RobotImp.MotorLeft(TmpSpeedL)
        RobotImp.MotorRight(TmpSpeedR)
    }
    SpeedLeft = TmpSpeedL
    SpeedRight = TmpSpeedR
}

function CmdChangeRadioGroup(On: boolean, NewRadioGroup: number) {
    if (On) {
        RGrpEndTime = input.runningTime() + 60000
        radio.setGroup(NewRadioGroup)
    } else {
        RGrpEndTime = 0
        radio.setGroup(INIT_GROUP)
    }
}

function CmdGetLeftCount(Value: number) {
    radio.sendValue(RET_LCOUNT, CountM1)
}

function CmdGetRightCount(Value: number) {
    radio.sendValue(RET_RCOUNT, CountM2)
}

function CmdResetCounters(Value: number) {
    CountM1 = 0
    CountM2 = 0
}

function CmdGetDuration() {
    radio.sendValue(RET_DURATION, MotorOffTime - input.runningTime())
}

function CmdEndMotorTime() {
    radio.sendValue(RET_END_TIME, input.runningTime())
}

function CmdSetOpt(Value: number) {
    EnableMsgDist = (Value % 10) != 0
    EnableMsgLine = (Math.idiv(Value, 10) % 10) != 0
}

function ShowEncodedImg(EImg: string) {
    let len = EImg.length
    let pos = 0
    while (pos < len) {
        let digits = EImg.substr(pos, 2)
        let val = parseInt(digits)
        for (let i = 0; i < 5; i++) {
            if ((val % 2) == 1) led.plot(4 - i, Math.idiv(pos, 2))
            else led.unplot(4 - i, Math.idiv(pos, 2))
            val = Math.idiv(val, 2)
        }
        pos = pos + 2
    }
}
function CmdDisplay(receivedString: string) {

    let len = receivedString.length
    if (len > 4) {
        let Cmd = receivedString.substr(0, 4)
        let DspVal = receivedString.substr(4, len - 4)
        if (DebugMode) {
            basic.showString(Cmd + ">>" + DspVal)
        }
        if (Cmd == CMD_DISPSTR) {
            control.inBackground(function () {
                basic.showString(DspVal)
            })
        }
        if (Cmd == CMD_DSPLED) {
            ShowEncodedImg(DspVal)
        }
    }
}

function CmdDspIcon(Icon: IconNames) {
    basic.showIcon(Icon)
}



radio.onReceivedValue(function (Cmd: string, CmdValue: number) {
    if (DebugMode) {
        basic.showString(Cmd)
        basic.showNumber(CmdValue)
    }
    if (Cmd.charAt(0) == '#') CmdDisplay(Cmd)
    if (Cmd == CMD_SETSPEED) CmdSetSpeed(CmdValue)
    if (Cmd == CMD_SETSPEEDL) CmdSetSpeedL(CmdValue)
    if (Cmd == CMD_SETSPEEDR) CmdSetSpeedR(CmdValue)
    if (Cmd == CMD_FWD) CmdForward(ON, CmdValue, SpeedLeft, SpeedRight)
    if (Cmd == CMD_LEFT) CmdLeft(CmdValue)
    if (Cmd == CMD_RIGHT) CmdRight(CmdValue)
    if (Cmd == CMD_CHGMTRSPEED) CmdChangeMotorSpeed(CmdValue)
    if (Cmd == CMD_STOP) CmdStop()
    if (Cmd == CMD_CHGGROUP) CmdChangeRadioGroup(ON, CmdValue)
    if (Cmd == CMD_GETLCOUNT) CmdGetLeftCount(CmdValue)
    if (Cmd == CMD_GETRCOUNT) CmdGetRightCount(CmdValue)
    if (Cmd == CMD_RESETCOUNT) CmdResetCounters(CmdValue)
    if (Cmd == CMD_SETOPT) CmdSetOpt(CmdValue)
    if (Cmd == CMD_GETDURATION) CmdGetDuration()
    if (Cmd == CMD_DSPICON) CmdDspIcon(CmdValue)
})

input.onPinPressed(TouchPin.P0, function () {
    CountM1 += 1
    if (CountM1 > 1000) CountM1 = 0 //counter overrun
})

input.onPinPressed(TouchPin.P1, function () {
    CountM2 += 1
    if (CountM2 > 1000) CountM2 = 0 // counter overrun
})

basic.forever(function () {
    if (MotorOffTime != 0) {
        if ((MotorOffTime <= input.runningTime())) {
            CmdForward(OFF, 0, 0, 0)
            CmdEndMotorTime()
        }
    }
    if (RGrpEndTime != 0) {
        if (RGrpEndTime <= input.runningTime()) {
            CmdChangeRadioGroup(OFF, INIT_GROUP)
        }
    }

    if (EnableMsgLine) radio.sendValue(MSG_COUNTERS, RobotImp.CounterStatus())
    basic.pause(2)
})