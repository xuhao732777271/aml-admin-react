import { lazy } from '@loadable/component';
import type { RouteObject } from '../types';
import { LayoutGuard } from '../guard';
import { LazyLoad } from '@/components/LazyLoad';

// form module page
const detectionResultRoute: RouteObject = {
  path: '/result',
  name: 'detectionResult',
  element: <LayoutGuard />,
  meta: {
    title: '检测结果',
    icon: 'compo',
    orderNo: 3
  },
  children: [
    {
      path: 'org-classify-statistics',
      name: 'OrgClassifyStatistics',
      element: LazyLoad(lazy(() => import('@/views/detection-result/org-classify-statistics'))),
      meta: {
        title: '机构分类统计',
        key: 'orgClassifyStatistics'
      }
    },
    {
      path: 'modal-classify-statistics',
      name: 'ModalClassifyStatistics',
      element: LazyLoad(lazy(() => import('@/views/detection-result/modal-classify-statistics'))),
      meta: {
        title: '模型分类统计',
        key: 'modalClassifyStatistics'
      }
    },
    {
      path: 'sql-query-analyzer',
      name: 'SqlQueryAnalyzer',
      element: LazyLoad(lazy(() => import('@/views/detection-result/sql-query-analyzer'))),
      meta: {
        title: 'SQL查询分析器',
        key: 'sqlQueryAnalyzer'
      }
    }
  ]
};

export default detectionResultRoute;
