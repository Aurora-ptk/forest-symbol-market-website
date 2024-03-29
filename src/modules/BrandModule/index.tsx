import clsx from 'clsx';
import CommonImage from '@/components/CommonImage';
import { DEVICE_TYPE } from '@/constants/enum';
import RowDescription from '@/components/RowDescription';
import styles from './styles.module.scss';
import DownloadButtonGroup from '@/components/DownloadButtonGroup';
import { ButtonKey } from '@/types/components/button';
import { BrandModuleType, IBrandModule } from '@/types/modules/brandModule';
import { Button } from 'antd';
import { s3Url } from '@/constants/network';
import { openWithBlank } from '@/utils/router';
import CommonButton from '@/components/CommonButton';

export interface BrandModuleProps {
  type: DEVICE_TYPE;
  moduleData: IBrandModule;
}

export default function BrandModule({ type, moduleData }: BrandModuleProps) {
  return (
    <section
      className={clsx([
        'section-container',
        styles.brandModuleWrap,
        moduleData.type === BrandModuleType.White ? styles.whiteType : styles.brandType,
      ])}
      style={{
        backgroundColor: moduleData.commonStyles?.defaultBackgroundColor,
        paddingTop: moduleData.commonStyles?.paddingVertical + 'px' || 'auto',
        paddingBottom: moduleData.commonStyles?.paddingVertical + 'px' || 'auto',
      }}>
      <section className={clsx([styles.brandModuleContainer, styles.brandModule])}>
        <section className={styles.brandModuleLeft}>
          {/* section 1: title */}
          <div className={styles.title} style={{ letterSpacing: type === DEVICE_TYPE.IOS ? -1 : 'normal' }}>
            {moduleData.title.text}
          </div>

          {/* section 2: description */}
          <div className="flex-column-start">
            {Array.isArray(moduleData?.descriptionList) &&
              moduleData.descriptionList.map((item, idx) => {
                return (
                  <RowDescription
                    key={'BrandModule_Description' + '_' + idx}
                    className={styles.desc}
                    iconSrc={item.icon?.filename_disk ? s3Url + item.icon?.filename_disk : ''}
                    gap={10}
                    content={item.text}
                  />
                );
              })}
          </div>

          {/* section 3: button list */}
          {Array.isArray(moduleData?.buttonList) && moduleData.buttonList.length > 0 && (
            <div className={styles.buttonGroup}>
              {moduleData.buttonList.map((btn, index) => {
                return btn.key === ButtonKey.DownloadApp ? (
                  <DownloadButtonGroup
                    key={'BrandModule' + '_' + index + '_' + btn.key}
                    type={type}
                    chromeStoreUrl={btn?.extensionUrl}
                    iosStoreUrl={btn?.iOSUrl}
                    androidStoreUrl={btn?.androidUrl}
                    otherDownloadUrl={btn?.otherUrl}
                    goDownloadPageUrl={btn?.otherUrl} // TODO
                    downloadPageBtnClassName={styles.downloadPageBtn}
                  />
                ) : (
                  <CommonButton
                    key={'BrandModule' + '_' + index + '_' + btn.key}
                    text={btn?.text || ''}
                    fontColor={btn.commonStyles.default?.fontColor}
                    backgroundColor={btn.commonStyles.default?.backgroundColor}
                    borderColor={btn.commonStyles.default?.borderColor}
                    onClick={() => openWithBlank(btn.link?.url, btn.link?.target)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* section 4: hero image */}
        <div className={styles.mainImage}>
          <CommonImage
            src={moduleData.image.filename_disk ? s3Url + moduleData.image.filename_disk : ''}
            width={640} // TODO
            height={640} // TODO
            className={clsx(['flex-row-center', styles.mainImage])}
            alt="homeMainImage"
            layout="intrinsic" // TODO
            priority
          />
        </div>
      </section>
    </section>
  );
}
