import { lazy } from '@loadable/component';
import type { RouteObject } from '../types';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';

// form module page
const workCenterRoute: RouteObject = {
  path: '/work',
  name: 'workCenter',
  element: <LayoutGuard />,
  meta: {
    title: '工作中心',
    icon: 'work',
    orderNo: 2
  },
  children: [
    {
      path: 'data-import',
      name: 'DataImport',
      element: LazyLoad(lazy(() => import('@/views/work-center/data-import'))),
      meta: {
        title: 'step1:数据导入',
        key: 'dataImport'
      }
    },
    {
      path: 'start-check',
      name: 'StartCheck',
      element: LazyLoad(lazy(() => import('@/views/work-center/start-check'))),
      meta: {
        title: 'step2:合规检测',
        key: 'startCheck'
      }
    },
    {
      path: 'check-result',
      name: 'CheckResult',
      element: LazyLoad(lazy(() => import('@/views/work-center/check-result'))),
      meta: {
        title: 'step3:检测报告',
        key: 'checkResult'
      }
    }
  ]
};

export default workCenterRoute;
