import { _decorator, Component, Vec2, sys, v2, misc, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class PlayerMovement extends Component {
    @property(Node)
    target: Node = null;

    @property(Node)
    joystick: Node = null;

    onLoad() {
        // Initialization logic
    }

    start() {
        // Start logic
    }

    update(dt: number) {
        const keyboardSimulator = this.target.getComponent("KeyboardSimulator");
        const speed = 2;
        let degrees: number | undefined;
        let velocity: Vec2 | undefined;

        if (keyboardSimulator && !sys.isNative) {
            let moveDirection = 0;
            let rotationDelta = 0;
            const velocityScale = v2(1, 1);
            const targetRotation = this.target.angle;

            // if (keyboardSimulator.allKeys[38] || keyboardSimulator.allKeys[87]) {
            //     moveDirection = 1;
            // } else if (keyboardSimulator.allKeys[40] || keyboardSimulator.allKeys[83]) {
            //     moveDirection = -1;
            // }

            // if (keyboardSimulator.allKeys[37] || keyboardSimulator.allKeys[65]) {
            //     rotationDelta = -2;
            // } else if (keyboardSimulator.allKeys[39] || keyboardSimulator.allKeys[68]) {
            //     rotationDelta = 2;
            // }

            // if (rotationDelta !== 0) {
            //     this.target.angle = targetRotation - rotationDelta;
            // }

            // if (moveDirection !== 0) {
            //     const desiredPosition = v2(0, 0);
            //     const velocityUnit = v2(Math.cos(misc.degreesToRadians(this.target.angle)), Math.sin(misc.degreesToRadians(this.target.angle)));
            //     velocity = velocityUnit.mul(speed);
            //     velocity.x *= Math.abs(velocityScale.x);
            //     velocity.y *= Math.abs(velocityScale.y);

            //     if (moveDirection === 1) {
            //         desiredPosition.set(velocity.x, velocity.y);
            //     } else if (moveDirection === -1) {
            //         desiredPosition.set(velocity.x, velocity.y).mulSelf(-1);
            //     }

            //     this.target.setPosition(desiredPosition.add(this.target.getPosition()));
        }
        // } else {
        //     degrees = this.joystick.getComponent("SneakyJoystickCore").getDegrees();
        //     velocity = this.joystick.getComponent("SneakyJoystickCore").getVelocity();
        //     this.target.angle = degrees;

        //     const velocityUnit = v2(Math.cos(misc.degreesToRadians(degrees)), Math.sin(misc.degreesToRadians(degrees)));
        //     const fullVelocity = velocityUnit.mul(speed);
        //     fullVelocity.x *= Math.abs(velocity.x);
        //     fullVelocity.y *= Math.abs(velocity.y);

        //     this.target.setPosition(this.target.getPosition().add(fullVelocity));
        // }
    }
}
