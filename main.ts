let CountM1 = 0
let CountM2 = 0


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
