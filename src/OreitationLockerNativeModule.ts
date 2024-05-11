import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {

   //获取应用程序方向
   getInitialOrientation(): string;

   //锁定应用程序方向为纵向（竖屏）
   lockToPortrait(): void;

   //锁定应用程序方向为横向（横屏）
   lockToLandscape(): void;

   //锁定应用程序的方向为横向，并且是向左旋转的方向。
   lockToLandscapeLeft(): void;

   // 锁定除了上下之外的方向
   lockToAllOrientationsButUpsideDown(): void;

   //锁定应用程序方向为横向，并且是向右旋转的方向
   lockToLandscapeRight(): void;

   //锁定上下的方向
   lockToPortraitUpsideDown(): void;

   //解锁所有方向
   unlockAllOrientations(): void;

   //获取应用程序方向
   getOrientation(callback: (orientation: string) => void): void;

   //获取设备方向
   getDeviceOrientation(callback: (orientation: string) => void): void;

   // 获取自动旋转状态
   getAutoRotateState(callback: (state: boolean) => void): void;

}
export default TurboModuleRegistry.get<Spec>('OreitationLockerNativeModule') as Spec | null;


