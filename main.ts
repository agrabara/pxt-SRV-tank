let CountM1 = 0
let CountM3 = 0


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
    CountM3 = 0
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 255)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CCW, 255)
    basic.pause(2000)
    basic.showLeds(`
    . . # . .
    . . # . .
    # . # . #
    . # # # .
    . . # . .
    `)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CCW, 255)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, 255)
    basic.pause(2000)
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 255)
    motor.MotorRun(motor.Motors.M3, motor.Dir.CW, 255)
    basic.pause(2000)
    motor.motorStopAll()
    basic.showIcon(IconNames.Asleep)
    basic.showString("M1=")
    basic.showNumber(CountM1)
    basic.pause(1000)
    basic.showString("M3=")
    basic.showNumber(CountM3)
})

input.onPinPressed(TouchPin.P0, function () {
    CountM1 += 1
})

input.onPinPressed(TouchPin.P1, function () {
    CountM3 += 1
})
