/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { TurboModule } from '@rnoh/react-native-openharmony/ts'
import { TM } from '@rnoh/react-native-openharmony/generated/ts'
import window from '@ohos.window'
import display from '@ohos.display'
import { BusinessError } from '@kit.BasicServicesKit'
import  sensor  from '@ohos.sensor';

const ORIENTATION_UNKNOWN = -1;

export class RNOrientationLockerTurboModule extends TurboModule implements TM.OreitationLockerNativeModule.Spec {
  private lastDeviceOrientationValue:string = this.getOrientationString(display.getDefaultDisplaySync().orientation);
  private lastDeviceSensorOrientationValue:string = "";
  constructor(ctx) {
    super(ctx)
    display.on('change', () => {
      let deviceOrientationValue = this.lastDeviceOrientationValue;
      let displayValue = display.getDefaultDisplaySync();
      let displayValueString = this.getOrientationString(displayValue.orientation);
      deviceOrientationValue = displayValueString;
      if(this.lastDeviceOrientationValue != deviceOrientationValue){
        this.lastDeviceOrientationValue = deviceOrientationValue;
        ctx.rnInstance.emitDeviceEvent('orientationDidChange', { orientation: displayValueString })
      }
    })
  }

  openSensor() {
    sensor.on(sensor.SensorId.ACCELEROMETER, (data: sensor.AccelerometerResponse) => {
      const X = -data.x;
      const Y = -data.y;
      const Z = -data.z;
      const xyMagnitude = X * X + Y * Y;
      const zSquared = Z * Z;
      let orientation = ORIENTATION_UNKNOWN;
      if (xyMagnitude * 4 >= zSquared) {
        const angleRad = Math.atan2(-Y, X);
        let angleDeg = 90 - (angleRad * 180 / Math.PI);
        while (angleDeg >= 360) angleDeg -= 360;
        while (angleDeg < 0) angleDeg += 360;
        orientation = Math.round(angleDeg);
      }

      let deviceOrientationValue:string = this.lastDeviceSensorOrientationValue;
      if (orientation === ORIENTATION_UNKNOWN) {
        deviceOrientationValue = "UNKNOWN";
      } else if (orientation > 355 || orientation < 5) {
        deviceOrientationValue = "PORTRAIT";
      } else if (orientation > 85 && orientation < 95) {
        deviceOrientationValue = "LANDSCAPE-RIGHT";
      } else if (orientation > 175 && orientation < 185) {
        deviceOrientationValue = "PORTRAIT-UPSIDEDOWN";
      } else if (orientation > 265 && orientation < 275) {
        deviceOrientationValue = "LANDSCAPE-LEFT";
      }
      if (this.lastDeviceSensorOrientationValue !== deviceOrientationValue) {
        this.ctx.rnInstance.emitDeviceEvent('deviceOrientationDidChange', { deviceOrientation: deviceOrientationValue })
        this.lastDeviceSensorOrientationValue = deviceOrientationValue;
      }
    }, { interval: 100000000 });
  }

  closeSensor() {
    sensor.off(sensor.SensorId.ACCELEROMETER);
  }

  private windowClass: window.Window | undefined = undefined

  private async setWindowClass(): Promise<void> {
    let context = this.ctx.uiAbilityContext;
    let promise = await window.getLastWindow(context);
    this.windowClass = promise;
    return;
  }

  private getOrientationString(orientation: number): string {
    if (orientation === 0) {
      return 'PORTRAIT';
    } else if (orientation === 1) {
      return 'LANDSCAPE-RIGHT';
    } else if (orientation === 2) {
      return 'PORTRAIT-UPSIDEDOWN';
    } else if (orientation === 3) {
      return 'LANDSCAPE-LEFT';
    } else {
      return 'UNKNOWN';
    }
  }

  private  sendLockEvent(orientation: number) {
    let orientationString = this.getOrientationString(orientation)
    this.ctx.rnInstance.emitDeviceEvent('lockDidChange', { orientation: orientationString })
  }

  private lockToOrientation(orientation) {
    this.setWindowClass().then(() => {
      if (this.windowClass) {
        // let orientation: window.Orientation = window.Orientation.AUTO_ROTATION_PORTRAIT;
        this.windowClass.setPreferredOrientation(orientation, (err: BusinessError) => {
          if (err.code) {
            return;
          }
          // window.Orientation属性与displayValue.orientation对齐需要 orientation - 1
          this.sendLockEvent(orientation - 1)
        });
      }
    })
  }

  lockToPortrait(): void {
    let orientation: window.Orientation = window.Orientation.PORTRAIT;
    this.lockToOrientation(orientation)
  }

  lockToLandscape(): void {
    let orientation: window.Orientation = window.Orientation.AUTO_ROTATION_LANDSCAPE_RESTRICTED;
    this.lockToOrientation(orientation)
  }

  lockToLandscapeLeft(): void {
    let orientation: window.Orientation = window.Orientation.LANDSCAPE;
    this.lockToOrientation(orientation)
  }

  lockToAllOrientationsButUpsideDown(): void {
    let orientation: window.Orientation = window.Orientation.AUTO_ROTATION_PORTRAIT;
    this.lockToOrientation(orientation)
  }

  lockToLandscapeRight(): void {
    let orientation: window.Orientation = window.Orientation.LANDSCAPE_INVERTED;
    this.lockToOrientation(orientation)
  }

  lockToPortraitUpsideDown(): void {
    let orientation: window.Orientation = window.Orientation.PORTRAIT_INVERTED;
    this.lockToOrientation(orientation)
  }

  unlockAllOrientations(): void {
    let orientation: window.Orientation = window.Orientation.AUTO_ROTATION_RESTRICTED;
    this.lockToOrientation(orientation)
  }

  getOrientation(callback: (orientation: string) => void): void {
    let displayClass: display.Display | null = null;
    let err: string | null = null;
    try {
      displayClass = display.getDefaultDisplaySync();
      let AppOrientation = this.getOrientationString(displayClass.orientation);
      callback(AppOrientation);
    } catch (e) {
      callback(null);
    }
  }

  getInitialOrientation(): string {
    let displayClass: display.Display | null = null;
    try {
      displayClass = display.getDefaultDisplaySync();
      let AppOrientation = this.getOrientationString(displayClass.orientation);
      return AppOrientation
    } catch (e) {
      return 'UNKNOWN'
    }
  }

  getDeviceOrientation(callback: (orientation: string) => void): void {
    let displayClass: display.Display | null = null;
    let err: string | null = null;
    try {
      displayClass = display.getDefaultDisplaySync();
      let AppOrientation = this.getOrientationString(displayClass.orientation);
      callback(AppOrientation);
    } catch (e) {
      callback(err);
    }
  }

  getAutoRotateState(callback: (state: boolean) => void): void {
   callback(true)
  }

   __onDestroy__(): void {
      super.__onDestroy__()
      display.off('change')
      sensor.off(sensor.SensorId.ACCELEROMETER)
  }
}