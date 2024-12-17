/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { RNOHContext, RNPackage, TurboModulesFactory } from '@rnoh/react-native-openharmony/ts'
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts'
import { TM } from '@rnoh/react-native-openharmony/generated/ts'
import { RNOrientationLockerTurboModule } from './RNOrientationLockerTurboModule'


class RNOreitationLockerTurboModuleFactory extends  TurboModulesFactory {

  createTurboModule(name: string): TurboModule | null {
    if (this.hasTurboModule(name)) {
      return new RNOrientationLockerTurboModule(this.ctx)
    }
    return null
  }

  hasTurboModule(name: string): boolean {
    return name === TM.OreitationLockerNativeModule.NAME
  }
}

export class RNOrientationLockerPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new RNOreitationLockerTurboModuleFactory(ctx)
  }
}