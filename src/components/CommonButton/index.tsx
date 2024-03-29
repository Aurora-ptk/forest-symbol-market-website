import { Button } from 'antd';
import styles from './styles.module.scss';
import { CSSProperties } from 'react';
import clsx from 'clsx';
export type CommonButtonProps = {
  className?: string;
  style?: CSSProperties;
  fontColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  text: string;
  onClick?: () => void;
};

export default function CommonButton({
  className,
  style,
  text,
  fontColor,
  backgroundColor,
  borderColor,
  onClick,
}: CommonButtonProps) {
  return (
    <Button
      className={clsx(styles.commonButton, className)}
      style={{ ...style, color: fontColor, backgroundColor: backgroundColor, borderColor: borderColor }}
      onClick={onClick}>
      {text}
    </Button>
  );
}
