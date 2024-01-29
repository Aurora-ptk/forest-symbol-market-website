import { GlobalModuleType } from './index';

export type Header = {
  key: GlobalModuleType.Header;
  type: HeaderType; // default value is "default"
  logo: {
    defaultUrl: string;
  };
  menuList: Array<TopMenu>;
  actionButton: {
    text?: string;
    linkUrl?: string;
  };
  commonStyles?: HeaderCommonStyles;
};

export type HeaderCommonStyles = {
  defaultBackgroundColor?: string;
};

export type HeaderType = 'default';

export enum NavigationType {
  NOT_JUMP = 1, // do not jump
  ROUTE = 2, // routing Jump
  OPEN_NEW_TAB = 3, // open the URL in a new tab
}

export type Navigation = {
  type: NavigationType;
  title: string;
  path?: string; // route path or jump link
};

export type TopMenu = Navigation & {
  children: Array<SecondMenu>;
  isShowSecondMenus?: boolean;
};

export type SecondMenu = Navigation;
