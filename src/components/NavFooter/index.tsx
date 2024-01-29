import clsx from 'clsx';
import CommonImage from '@/components/CommonImage';
import { NavigationType, ROUTER } from '@/constants/enum';
import LinkForBlank from '@/components/LinkForBlank';
import { CSSProperties, useCallback, useState } from 'react';
import { jumpOrScrollToTop, switchPage } from '@/utils/router';
import { getFullYear } from '@/utils/time';
import styles from './styles.module.scss';
import { s3Url } from '@/constants/network';
import { Footer } from '@/types/global/footer';

export interface INavFooter {
  className?: string;
  style?: CSSProperties;
  footerMediaClassName?: string;
  data: Footer;
}

export default function NavFooter({ className, style, footerMediaClassName, data }: INavFooter) {
  const [socialMediaData, setSocialMediaData] = useState(data.socialMediaList);
  const showActiveMedia = useCallback(
    (index: number) => {
      const dataTrans = data.socialMediaList?.map((v, k) => {
        return {
          ...v,
          isActive: index === k,
        };
      });
      if (dataTrans?.length > 0) {
        setSocialMediaData(dataTrans);
      }
    },
    [data.socialMediaList],
  );

  return (
    <footer
      id="website-footer"
      className={clsx(['section-container', 'flex-row-content-center', styles.footer, className])}
      style={{ backgroundColor: data.commonStyles?.defaultBackgroundColor, ...style }}>
      <div className={clsx(['page-container', styles.footerBody])}>
        <div className={styles.footerNav}>
          <CommonImage
            src={data.logo.defaultUrl}
            style={{ width: 142, height: 32, cursor: 'pointer', minWidth: 142, marginRight: 120, marginBottom: 40 }}
            width={142}
            height={32}
            alt="websiteLogo"
            className={styles.logo}
            onClick={() => jumpOrScrollToTop(ROUTER.DEFAULT)}
          />
          <div className={clsx(['flex-row', styles.menus])}>
            {Array.isArray(data.menuList) &&
              data.menuList.map((item, index) => {
                return (
                  <div key={'FooterFirstMenu-' + item.title + index} className={styles.menuGroup}>
                    {item.type === NavigationType.NOT_JUMP && <div className={styles.firstMenus}>{item.title}</div>}
                    {item?.children &&
                      item.children?.map((v, k) => {
                        return (
                          <div
                            key={'FooterSecondMenu-' + v.title + k}
                            className={styles.secondMenus}
                            onClick={() => switchPage(v.type, v.path)}>
                            {v.title}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className={clsx([styles.footerMedia, footerMediaClassName])}
          style={{ borderTopColor: data.commonStyles?.dividingLineColor }}>
          <div className="flex-row-center">
            {socialMediaData?.map((item, index) => {
              return (
                <div
                  key={'FooterSocialMedia-' + item.name + index}
                  onMouseOver={() => showActiveMedia(index)}
                  onMouseOut={() => showActiveMedia(-1)}
                  className="flex-row-center">
                  <LinkForBlank
                    href={item.link}
                    className={styles.iconBase}
                    ariaLabel={item.name}
                    element={
                      <div style={{ position: 'relative' }}>
                        <CommonImage
                          src={item?.activeSvg?.filename_disk ? s3Url + item?.activeSvg?.filename_disk : ''}
                          style={{
                            width: 24,
                            height: 24,
                            opacity: item?.isActive ? 1 : 0,
                            position: 'absolute',
                            top: 0,
                          }}
                          width={24}
                          height={24}
                          alt=""
                        />
                        <CommonImage
                          src={item?.svg?.filename_disk ? s3Url + item?.svg?.filename_disk : ''}
                          style={{ width: 24, height: 24, opacity: item?.isActive ? 0 : 1 }}
                          alt=""
                          width={24}
                          height={24}
                        />
                      </div>
                    }
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.footerPower}>
            {data.powerName.text}@{getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
