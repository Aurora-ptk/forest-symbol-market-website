import { get } from '@/api/axios';
import { API } from '@/api/constants';
import { s3Url } from '@/constants/network';
import { ButtonComponent, ButtonKey } from '@/types/components/button';
import { DescriptionComponent } from '@/types/components/description';
import { GlobalModuleType } from '@/types/global';
import { GlobalConfig } from '@/types/global';
import { Footer } from '@/types/global/footer';
import { Header } from '@/types/global/header';
import { Module, ModuleType } from '@/types/modules';
import { handleErrorMessage } from '@/utils';
import { IAPIDescriptionItem } from './types';
import { DappPage } from '@/types/pages';

export const getGlobalConfig = async (): Promise<GlobalConfig> => {
  try {
    const { data } = await get(API.GET.GLOBAL_CONFIG);
    return {
      meta: {
        favicon: data.metaFavicon?.filename_disk ? s3Url + data.metaFavicon?.filename_disk : '',
        title: data.metaTitle,
        description: data.metaDescription,
        keywords: data.metaKeywords,
      },
      themeColor: {
        brand: data.themeColorBrand,
        hover: data.themeColorHover,
        normal: data.themeColorNormal,
        click: data.themeColorClick,
        disable: data.themeColorDisable,
      },
      functionalColor: {
        link: data.functionalColorLink,
        linkBg: data.functionalColorLinkBg,
        success: data.functionalColorSuccess,
        successBg: data.functionalColorSuccessBg,
        warning: data.functionalColorWarning,
        warningBg: data.functionalColorWarningBg,
        error: data.functionalColorError,
        errorBg: data.functionalColorErrorBg,
      },
      neutralColor: {
        primaryText: data.neutralColorPrimaryText,
        secondaryText: data.neutralColorSecondaryText,
        disableText: data.neutralColorDisableText,
        whiteText: data.neutralColorWhiteText,
        border: data.neutralColorBorder,
        dash: data.neutralColorDash,
        dividers: data.neutralColorDividers,
        normalBg: data.neutralColorNormalBg,
        hoverBg: data.neutralColorHoverBg,
        clickBg: data.neutralColorClickBg,
        pageBg: data.neutralColorPageBg,
        maskBg: data.neutralColorMaskBg,
      },
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const getHeader = async (): Promise<Header> => {
  try {
    const { data } = await get(API.GET.HEADER);
    const menuList = (data.menuList || []).map((item: any) => ({
      ...item.topMenu_id,
      type: item.topMenu_id.type.value,
    }));

    return {
      key: GlobalModuleType.Header,
      type: data.type,
      logo: {
        defaultUrl: data.defaultLogo?.filename_disk ? s3Url + data.defaultLogo?.filename_disk : '',
      },
      menuList,
      actionButton: {
        text: data.actionButtonText || undefined,
        linkUrl: data.actionButtonLinkUrl || undefined,
      },
      commonStyles: {
        defaultBackgroundColor: data.defaultBackgroundColor || undefined,
      },
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const getFooter = async (): Promise<Footer> => {
  try {
    const { data } = await get(API.GET.FOOTER);
    const menuList = (data.menuList || []).map((item: any) => ({
      ...item.bottomMenu_id,
      type: item.bottomMenu_id.type,
    }));
    const socialMediaList = (data.socialMediaList || []).map((item: any) => ({
      ...item.socialMedia_id,
    }));

    return {
      key: GlobalModuleType.Footer,
      powerName: {
        text: data.powerNameText,
      },
      logo: {
        defaultUrl: data.defaultLogo?.filename_disk ? s3Url + data.defaultLogo?.filename_disk : '',
      },
      menuList,
      socialMediaList,
      commonStyles: {
        defaultBackgroundColor: data.defaultBackgroundColor || undefined,
        dividingLineColor: data.dividingLineColor || undefined,
      },
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const getPage = async (key: string): Promise<DappPage | undefined> => {
  try {
    const { data } = await get(API.GET.PAGE);
    const pageData = data.find(
      (item: any) => item.status === 'published' && item.key?.toLowerCase() === key?.toLowerCase(),
    );
    if (!pageData) return undefined;
    const moduleList = formatModuleList(pageData.moduleList || []);
    return {
      ...pageData,
      moduleList,
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const formatModuleList = (moduleList = []): Module[] => {
  return (moduleList.map((moduleItem: any) => formatModule(moduleItem.item)).filter((item) => !!item) as Module[]).sort(
    (a, b) => a.index - b.index,
  );
};

const formatModule = (moduleItem: any): Module | undefined => {
  if (moduleItem.status !== 'published') return undefined;
  switch (moduleItem.key) {
    case ModuleType.BrandModule:
      return {
        key: ModuleType.BrandModule,
        index: moduleItem.index,
        title: {
          text: moduleItem.title,
        },
        image: moduleItem.image,
        type: moduleItem.type,
        buttonList: formatButtonList(moduleItem.buttonList),
        descriptionList: formatDescriptionList(moduleItem.descriptionList),
        commonStyles: {
          paddingVertical: moduleItem.paddingVertical || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
        },
      };
    case ModuleType.GraphicTextModule:
      return {
        key: ModuleType.GraphicTextModule,
        index: moduleItem.index,
        image: moduleItem.image,
        title: {
          text: moduleItem.title,
        },
        subTitle: {
          text: moduleItem.subTitle,
        },
        descriptionList: formatDescriptionList(moduleItem.descriptionList),
        type: moduleItem.type,
        commonStyles: {
          paddingVertical: moduleItem.paddingVertical || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
        },
      };
    case ModuleType.CardListModule:
      return {
        key: ModuleType.CardListModule,
        index: moduleItem.index,
        title: {
          text: moduleItem.title,
        },
        subTitle: {
          text: moduleItem.subTitle,
        },
        dataArray: formatDescriptionList(moduleItem.dataArray),
        commonStyles: {
          paddingVertical: moduleItem.paddingVertical || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
          defaultCardBackgroundColor: moduleItem.defaultCardBackgroundColor || undefined,
          defaultImgContainerBackgroundColor: moduleItem.defaultImgContainerBackgroundColor || undefined,
        },
      };
    case ModuleType.PartnersModule:
      return {
        key: ModuleType.PartnersModule,
        index: moduleItem.index,
        title: {
          text: moduleItem.title,
        },
        list: formatPartnerList(moduleItem.list),
        commonStyles: {
          paddingVertical: moduleItem.paddingVertical || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
          defaultCardBackgroundColor: moduleItem.defaultCardBackgroundColor || undefined,
        },
      };
    default:
      return undefined;
  }
};

const formatDescriptionList = (
  descriptionList: IAPIDescriptionItem[] | DescriptionComponent[] = [],
): DescriptionComponent[] => {
  return descriptionList
    .map((descriptionItem) => {
      const item = 'description_id' in descriptionItem ? descriptionItem.description_id : descriptionItem;
      return {
        index: item.index,
        text: item.text,
        subText: item.subText,
        icon: item.icon || undefined,
        children: formatDescriptionList(item.children),
      };
    })
    .sort((a: any, b: any) => a.index - b.index);
};

const formatButtonList = (buttonList = []) => {
  return (
    buttonList
      .map((buttonItem: any) =>
        formatButton({
          ...buttonItem.item,
        }),
      )
      .filter((item) => !!item) as ButtonComponent[]
  ).sort((a, b) => a.index - b.index);
};

const formatButton = (data: any): ButtonComponent | undefined => {
  switch (data.key) {
    case ButtonKey.Common:
      return {
        key: ButtonKey.Common,
        index: data.index,
        type: data.type,
        link: {
          url: data.linkUrl,
          target: data.linkTarget,
        },
        text: data.text || undefined,
        commonStyles: {
          default: {
            backgroundColor: data.defaultBackgroundColor || undefined,
            fontColor: data.defaultFontColor || undefined,
            borderColor: data.defaultBorderColor || undefined,
          },
        },
      };
    case ButtonKey.DownloadApp:
      return {
        key: ButtonKey.DownloadApp,
        index: data.index,
        type: data.type,
        androidUrl: data.androidUrl || undefined,
        iOSUrl: data.iOSUrl || undefined,
        extensionUrl: data.extensionUrl || undefined,
        otherUrl: data.otherUrl || undefined,
      };
    default:
      return undefined;
  }
};

const formatPartnerList = (partnerList: any[] = []) => {
  return partnerList
    .map(({ partner_id: item }) => ({
      index: item.index,
      logoImage: item.logoImage,
      url: item.url || undefined,
    }))
    .sort((a: any, b: any) => a.index - b.index);
};
