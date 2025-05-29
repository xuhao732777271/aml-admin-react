import type { FC } from 'react';
import { Space } from 'antd';
import classNames from 'classnames';
import styles from './app-logo.module.less';
import logoImg from '@/assets/images/logo.png';

const AppLogo: FC = () => {
  return (
    <div className={classNames('anticon', styles['app-logo'])}>
      <Space>
        <img className={styles['logo-img']} src={logoImg} alt='logo' />
        <div className={styles['logo-name']}>反洗钱合规自查平台</div>
      </Space>
    </div>
  );
};

export default AppLogo;
