// import type { UserInfo } from '@/types';
import { type FC, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Checkbox, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/stores';
import { setToken, setUserInfo } from '@/stores/modules/user';
import AuthAPI from '@/api/auth';
import classNames from 'classnames';
import styles from './index.module.less';

const LoginPage: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [captchaBase64, setCaptchaBase64] = useState('');
  const [formData, setFormData] = useState({
    username: 'admin',
    password: '123456',
    captcha: '',
    checkKey: -1
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getCaptcha = useCallback(() => {
    const current = new Date().getTime();
    AuthAPI.getCaptcha(current).then((res: any) => {
      if (res.success && res.result) {
        setCaptchaBase64(res.result);
        setFormData(prev => ({ ...prev, checkKey: current }));
      }
    });
  }, []);

  useEffect(() => {
    getCaptcha();
  }, [getCaptcha]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      loginAction({ ...values, checkKey: formData.checkKey });
    } catch (error) {
      message.error((error as unknown as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loginAction = async (params: typeof formData) => {
    try {
      AuthAPI.login(params)
        .then((res: any) => {
          if (res.success && res.result) {
            const { token, userInfo } = res.result;
            dispatch(setToken(token));
            dispatch(setUserInfo(userInfo));
            navigate(userInfo?.homePath || '/home');
            message.success('登录成功！');
          } else {
            getCaptcha();
            message.error(res.message);
          }
        })
        .catch(error => {
          getCaptcha();
          message.error(error.message);
        });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <div className={styles['login-wrapper']}>
      <div className={styles['login-box']}>
        <div className={styles['form-title']}>
          <p>账 号 登 录</p>
        </div>
        <Form form={form} size='large' className={styles['login-form']} onFinish={handleLogin}>
          <Form.Item name='username' rules={[{ required: true, message: '请输入账号' }]}>
            <Input
              placeholder='请输入账号'
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input
              type='password'
              placeholder='请输入密码'
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item name='captcha' rules={[{ required: true, message: '请输入验证码' }]}>
            <div className={styles['input-wrapper']}>
              <Input
                placeholder='验证码'
                prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
              />
              <img src={captchaBase64} className={styles['captcha-img']} onClick={getCaptcha} />
            </div>
          </Form.Item>
          <Form.Item>
            <Form.Item className={classNames('fl', styles['no-margin'])} valuePropName='checked'>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Form.Item className={classNames('fr', styles['no-margin'])}>
              <a href=''>忘记密码？</a>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className={styles['login-btn']} loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
