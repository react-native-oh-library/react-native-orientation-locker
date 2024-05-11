//
//  react-native-orientation-locker
//
//
//  Created by Wonday on 17/5/12.
//  Copyright (c) wonday.org All rights reserved.
//

"use strict";

// import Orientation from './src/orientation';
import OrientationAndroid from './src/orientation.android';
import OrientationIOS from './src/orientation.ios';
import OrientationHarmony from './src/orientation.harmony';
import {Platform} from 'react-native'


export * from './src/hooks';
export * from './src/OrientationLocker';

export const OrientationType = {
  PORTRAIT: 'PORTRAIT',
  'PORTRAIT-UPSIDEDOWN': 'PORTRAIT-UPSIDEDOWN',
  'LANDSCAPE-LEFT': 'LANDSCAPE-LEFT',
  'LANDSCAPE-RIGHT': 'LANDSCAPE-RIGHT',
  'FACE-UP': 'FACE-UP',
  'FACE-DOWN': 'FACE-DOWN',
  UNKNOWN: 'UNKNOWN',
};


let Orientation
if (Platform.OS === 'harmony') {
  Orientation = OrientationHarmony
} else if (Platform.OS === 'android') {
  Orientation = OrientationAndroid
} else if (Platform.OS === 'ios') {
  Orientation = OrientationIOS
}
export default Orientation;
