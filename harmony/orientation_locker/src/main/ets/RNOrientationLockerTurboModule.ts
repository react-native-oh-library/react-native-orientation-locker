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

export class RNOrientationLockerTurboModule extends TurboModule implements TM.OreitationLockerNativeModule.Spec {
  constructor(ctx) {
    super(ctx)
    display.on('change', () => {
      let displayValue = display.getDefaultDisplaySync();
      let displayValueString = this.getOrientationString(displayValue.orientation);
      ctx.rnInstance.emitDeviceEvent('orientationDidChange', { orientation: displayValueString })
      ctx.rnInstance.emitDeviceEvent('deviceOrientationDidChange', { deviceOrientation: displayValueString })
    })
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
          this.sendLockEvent(orientation)
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
    let orientation: window.Orientation = window.Orientation.AUTO_ROTATION;
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
  }
}