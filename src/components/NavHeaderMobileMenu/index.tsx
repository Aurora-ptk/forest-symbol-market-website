import { Button } from 'antd';
import { iconClose } from '@/assets/images';
import clsx from 'clsx';
import CommonImage from '@/components/CommonImage';
import styles from './styles.module.scss';
import { jumpOrScrollToTop, openWithBlank, switchPage } from '@/utils/router';
import { ROUTER } from '@/constants/enum';
import { useCallback, useRef, useState } from 'react';
import MenuArrowSVG from '@/components/SVGComponents/MenuArrowSVG';
import { Popup } from 'antd-mobile';
import { Header, TopMenu } from '@/types/global/header';

enum HiddenSecondType {
  ALL_HIDDEN = 'none',
}

export type NavHeaderMobileMenuProps = {
  isOpen: boolean;
  data: Header;
  callback: () => void;
};

export default function NavHeaderMobileMenu({ isOpen = false, data, callback }: NavHeaderMobileMenuProps) {
  const [menuData, setMenuData] = useState(data.menuList || []);
  const showSecondMenusIndex = useRef<number>(-1);

  const onClose = () => {
    callback?.();
    showSecondMenus(HiddenSecondType.ALL_HIDDEN);
  };

  const showSecondMenus = useCallback(
    (parentIndex: number | HiddenSecondType) => {
      if (parentIndex === HiddenSecondType.ALL_HIDDEN || showSecondMenusIndex.current === parentIndex) {
        showSecondMenusIndex.current = -1;
        return setMenuData(data.menuList || []);
      }

      showSecondMenusIndex.current = parentIndex;

      const dataTrans = data.menuList?.map((item, index) => {
        return {
          ...item,
          isShowSecondMenus: index === parentIndex,
        };
      });
      if (Array.isArray(dataTrans) && dataTrans?.length > 0) {
        setMenuData(dataTrans);
      }
    },
    [data.menuList],
  );

  return (
    <Popup
      position="right"
      visible={isOpen}
      showCloseButton={false}
      className="navHeaderMobileMenu"
      bodyClassName={styles.navHeaderMobileMenuBody}
      stopPropagation={['click']}>
      <div className={clsx(['flex-row-between', styles.logoRow])}>
        <CommonImage
          src={data.logo.defaultUrl}
          style={{ width: 142, height: 32, cursor: 'pointer' }}
          width={142}
          height={32}
          alt="websiteLogo"
          priority
          onClick={() => jumpOrScrollToTop(ROUTER.DEFAULT, onClose)}
        />
        <CommonImage
          src={iconClose}
          style={{ width: 24, height: 24, cursor: 'pointer' }}
          width={24}
          height={24}
          alt="websiteMenu"
          onClick={onClose}
          priority
        />
      </div>
      <div className={styles.menusWrap}>
        {menuData?.map((item, index) => {
          return (
            <div key={'NavHeaderMobileMenu-first-' + item.title + index}>
              <div className={styles.menuGroup}>
                <div
                  className={clsx([
                    'flex-row-between',
                    styles.firstMenu,
                    item?.isShowSecondMenus ? styles.rotateSvg : null,
                  ])}
                  onClick={
                    item?.children?.length === 0
                      ? () => switchPage(item.type, item.path, onClose)
                      : () => showSecondMenus(index)
                  }>
                  <span className="text-black-btn overflow-x-hidden">{item.title}</span>
                  {item?.children?.length > 0 && <MenuArrowSVG />}
                </div>
                {item?.children?.length > 0 && (
                  <div
                    className={clsx([styles.secondMenuList, item?.isShowSecondMenus ? styles.visible : styles.hidden])}>
                    {item.children.map((v, k) => {
                      return (
                        <div
                          key={'NavHeaderMobileMenu-second-' + v.title + k}
                          className={clsx(['overflow-x-hidden', styles.secondMenu])}
                          onClick={() => switchPage(v.type, v.path, onClose)}>
                          {v.title}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {data.actionButton?.text && (
          <Button type="text" className={styles.downloadBtn} onClick={() => openWithBlank(data.actionButton?.linkUrl || '')}>
            {data?.actionButton.text}
          </Button>
        )}
      </div>
    </Popup>
  );
}
