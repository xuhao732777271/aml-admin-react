/** 检测状态 */
export enum Status {
  // OTHER_RESULT = "0",
  INITIAL_SUBMISSION = '1',
  RUNNING = '2',
  // COUNT_COMPLETED = "4",
  HDFS_SUCCESS = '7',
  EXECUTION_COMPLETED = '8',
  EXECUTION_EXCEPTION = '9'
  // EXECUTION_COMPLETED_10 = "10",
  // EXECUTION_COMPLETED_11 = "11",
  // MANUAL_CANCEL = "A",
  // MANUAL_PAUSE = "B",
}

/** 检测状态映射 */
export const statusMap = {
  // [Status.OTHER_RESULT]: "关联其他结果",
  [Status.INITIAL_SUBMISSION]: '初始提交',
  [Status.RUNNING]: '运行中',
  // [Status.COUNT_COMPLETED]: "统计数量完成",
  [Status.HDFS_SUCCESS]: 'HDFS产生成功',
  [Status.EXECUTION_COMPLETED]: '执行完成',
  [Status.EXECUTION_EXCEPTION]: '执行异常'
  // [Status.EXECUTION_COMPLETED_10]: "执行完成",
  // [Status.EXECUTION_COMPLETED_11]: "执行完成",
  // [Status.MANUAL_CANCEL]: "人工取消",
  // [Status.MANUAL_PAUSE]: "人工暂停",
};

const list = Object.keys(statusMap).map(key => ({
  value: key,
  label: statusMap[key]
}));
export const statusList = [{ value: '', label: '全部' }, ...list];
// console.log(statusMap[Status.INITIAL_SUBMISSION]); // 输出: 初始提交
// console.log(statusMap[Status.RUNNING]); // 输出: 运行中
// console.log(statusMap[Status.EXECUTION_EXCEPTION]); // 输出: 执行异常

export const percentList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 0.0,
    label: '0%'
  },
  {
    value: 0.05,
    label: '5%'
  },
  {
    value: 0.1,
    label: '10%'
  },
  {
    value: 0.2,
    label: '20%'
  },
  {
    value: 0.3,
    label: '30%'
  },
  {
    value: 0.4,
    label: '40%'
  },
  {
    value: 0.5,
    label: '50%'
  },
  {
    value: 0.6,
    label: '60%'
  },
  {
    value: 0.7,
    label: '70%'
  }
];

export const columnsForInfo = [
  {
    title: '参数名称',
    key: 'paraString',
    overflow: true,
    align: 'center',
    fixed: 'left',
    minWidth: 150
  },
  {
    title: '参数说明',
    key: 'paraDesc',
    align: 'center',
    minWidth: 100
  },
  {
    title: '参数值',
    slot: 'paraValue',
    align: 'center',
    minWidth: 150
  },
  {
    title: '操作',
    slot: 'action',
    align: 'center',
    fixed: 'right',
    minWidth: 60
  }
];
export const conditionList = [
  {
    value: '>',
    label: '>'
  },
  {
    value: '<',
    label: '<'
  },
  {
    value: '=',
    label: '='
  },
  {
    value: '>=',
    label: '>='
  },
  {
    value: '<=',
    label: '<='
  },
  {
    value: 'not in',
    label: 'not in'
  },
  {
    value: 'like',
    label: 'like'
  },
  {
    value: 'is null',
    label: 'is null'
  },
  {
    value: 'not like',
    label: 'not like'
  }
];
export const tradeList = [
  {
    value: '13',
    label: '房地产业'
  },
  {
    value: '25',
    label: '其他'
  },
  {
    value: '24',
    label: '国际组织'
  },
  {
    value: '23',
    label: '采矿业'
  },
  {
    value: '22',
    label: '农、林、牧、渔业'
  },
  {
    value: '21',
    label: '政府机构'
  },
  {
    value: '20',
    label: '居民服务、修理和其他服务业'
  },
  {
    value: '19',
    label: '水利、环境和公共设施管理业'
  },
  {
    value: '18',
    label: '电力、热力、燃气及水生产和供应业'
  },
  {
    value: '16',
    label: '公共管理、社会保障和社会组织'
  },
  {
    value: '15',
    label: '卫生和社会工作'
  },
  {
    value: '14',
    label: '交通运输、仓储和邮政业'
  },
  {
    value: '1',
    label: '信息传输、软件和信息技术服务业'
  },
  {
    value: '12',
    label: '文化、体育和娱乐业'
  },
  {
    value: '11',
    label: '线下零售与服务业'
  },
  {
    value: '10',
    label: '电子商务'
  },
  {
    value: '9',
    label: '住宿和餐饮业'
  },
  {
    value: '8',
    label: '批发和零售业'
  },
  {
    value: '7',
    label: '科学研究和技术服务业'
  },
  {
    value: '6',
    label: '建筑业'
  },
  {
    value: '5',
    label: '金融业'
  },
  {
    value: '4',
    label: '教育'
  },
  {
    value: '3',
    label: '租赁和商务服务业'
  },
  {
    value: '2',
    label: '制造业'
  }
];
export const companySizeList = [
  {
    value: '1',
    label: '20人以下'
  },
  {
    value: '2',
    label: '21-99人'
  },
  {
    value: '3',
    label: '100-499人'
  },
  {
    value: '4',
    label: '500-999人'
  },
  {
    value: '5',
    label: '1000-9999人'
  },
  {
    value: '6',
    label: '10000人以上'
  }
];
