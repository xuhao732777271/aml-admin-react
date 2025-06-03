import React, { useEffect, useRef, useState } from 'react';
import type { DataNode } from 'antd/es/tree';
import { Button, Tree, Input, Table, message, Modal, Dropdown } from 'antd';
import { FolderOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ImportWorkAPI from '@/api/work-center';
import PageBaseAPI from '@/api/base';
import PageModuleAPI from '@/api/module';
import { columnsForInfo } from '@/utils/constant';
import './index.less';

interface ModelData {
  ruleId?: string;
  ruleName?: string;
  modelDesc?: string;
  parmList?: any[];
  menuId?: string;
}

const columns = [
  {
    title: '模型ID',
    dataIndex: 'ruleId',
    minWidth: 80,
    align: 'center' as const
  },
  {
    title: '模型名称',
    dataIndex: 'ruleName',
    minWidth: 300,
    align: 'center' as const,
    ellipsis: true
  },
  {
    title: '模型描述',
    dataIndex: 'modelDesc',
    minWidth: 400,
    align: 'center' as const,
    ellipsis: true
  }
];
const menuItems = [
  { key: 'expandAll', label: '全部展开' },
  { key: 'collapseAll', label: '全部收起' },
  { key: 'selectAll', label: '全选' },
  { key: 'deselectAll', label: '全不选' }
];
const StartCheck: React.FC = () => {
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [allModelList, setAllModelList] = useState<ModelData[]>([]);
  const [parmList, setParmList] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const treeRef = useRef<any>(null);

  const getCheckedNodesList = () => {
    // Helper to get all leaf node keys from tree data
    const getLeafKeysFromTree = (nodes: DataNode[]): string[] => {
      return nodes.reduce((acc: string[], node) => {
        if (node.isLeaf && node.key) {
          acc.push(node.key.toString());
        }
        if (node.children?.length) {
          acc.push(...getLeafKeysFromTree(node.children));
        }
        return acc;
      }, []);
    };

    // Filter out selectedKeys that are not actual leaf node keys in the current treeData
    const allLeafKeys = getLeafKeysFromTree(treeData);
    const checkedLeafKeys = selectedKeys.filter(key => allLeafKeys.includes(key));

    // 调试输出
    console.log('selectedKeys:', selectedKeys);
    console.log('checkedLeafKeys:', checkedLeafKeys);
    console.log('allModelList:', allModelList);

    // 根据 key 找到对应的模型数据
    const list = checkedLeafKeys
      .map(key => {
        // 确保 key 和 ruleId 都转换为字符串再比较
        const current = allModelList.find(model => String(model.ruleId) === String(key));
        if (!current) {
          console.warn('未匹配到模型，key:', key);
        }
        return current;
      })
      .filter((item): item is ModelData => item !== undefined); // 过滤掉 undefined

    console.log('最终table数据:', list);
    return list;
  };
  const init = () => {
    ImportWorkAPI.getRuleTree().then((res: any) => {
      if (res && res.resList) {
        // 处理树形数据，确保每个节点都有正确的key和title
        const processTreeData = (nodes: any[]): DataNode[] => {
          return nodes.map((node, index) => {
            // 确保生成唯一的字符串 key，包括回退逻辑
            const key = node.ruleId?.toString() || `generated-key-${index}-${Math.random().toString(36).substr(2, 5)}`;
            const processedNode: DataNode = {
              key,
              title: node.title || node.ruleName || `节点 ${key}`, // Ensure title exists
              children: node.children ? processTreeData(node.children) : undefined,
              isLeaf: !node.children?.length // Mark as leaf if no children or empty children array
            };
            // Log generated key for debugging
            if (!node.ruleId && !node.menuId) {
              console.warn(`为节点 ${processedNode.title} 生成了回退 key: ${key}`);
            }
            return processedNode;
          });
        };
        const processedData = processTreeData(res.resList);
        setTreeData(processedData);
      }
    });
    PageBaseAPI.getList().then((res: any) => {
      if (res && res.resList) {
        setAllModelList(res.resList);
      }
    });
  };

  useEffect(() => {
    init();
  }, []);
  const handleCommand = (command: string) => {
    switch (command) {
      case 'expandAll':
        const getAllKeys = (nodes: DataNode[]): string[] => {
          const keys: string[] = [];
          const processNode = (node: DataNode) => {
            if (node.key) {
              keys.push(node.key.toString());
            }
            if (node.children?.length) {
              node.children.forEach(processNode);
            }
          };
          nodes.forEach(processNode);
          return keys;
        };
        const allKeys = getAllKeys(treeData);
        // 先展开所有节点
        setExpandedKeys(allKeys);
        break;
      case 'collapseAll':
        setExpandedKeys([]);
        break;
      case 'selectAll':
        const getAllLeafKeys = (nodes: DataNode[]): string[] => {
          const keys = nodes.reduce((acc, node) => {
            if (node.isLeaf && node.key) {
              acc.push(node.key.toString());
            } else if (node.children?.length) {
              acc.push(...getAllLeafKeys(node.children));
            }
            return acc;
          }, [] as string[]);
          return keys;
        };
        const leafKeys = getAllLeafKeys(treeData);
        setSelectedKeys(leafKeys);
        break;
      case 'deselectAll':
        setSelectedKeys([]);
        break;
    }
  };
  const toggleRowExpand = async (expanded: boolean, record: ModelData) => {
    // Only fetch if expanding and parmList is not already loaded for this record
    if (expanded && (!record.parmList || record.parmList.length === 0)) {
      try {
        const res = await PageModuleAPI.getParmlist({ id: record.ruleId });
        if ((res as any).state) {
          // 访问 state 属性
          const fetchedParmList = (res as any)?.resList || []; // 访问 resList 属性
          // Update the specific model in allModelList with fetched params
          setAllModelList(prevList =>
            prevList.map(model =>
              String(model.ruleId) === String(record.ruleId) ? { ...model, parmList: fetchedParmList } : model
            )
          );
          // Set parmList state for the currently expanded row
          setParmList(fetchedParmList);
        } else {
          message.error((res as any)?.resMsg || '未知错误'); // 访问 resMsg 属性
        }
      } catch (error) {
        message.error('获取参数列表失败');
      }
    } else if (expanded && record.parmList) {
      // If parmList already exists, use it directly
      setParmList(record.parmList);
    } else if (!expanded) {
      // Clear parmList when collapsing
      setParmList([]);
    }
  };
  // 处理参数行保存
  const updateRow = async (row: any) => {
    try {
      const res = await PageModuleAPI.updateParmRow(row);
      if ((res as any).state) {
        // 访问 state 属性
        message.success('保存成功');
        // Find the model associated with this parameter row
        const currentModel = allModelList.find(model =>
          model.parmList?.some((param: any) => String(param.id) === String(row.id))
        );
        if (currentModel) {
          // Re-fetch parmList for the current model to get updated data
          const resRefresh = await PageModuleAPI.getParmlist({ id: currentModel.ruleId });
          if ((resRefresh as any).state) {
            // 访问 state 属性
            const refreshedParmList = (resRefresh as any)?.resList || []; // 访问 resList 属性
            setAllModelList(prevList =>
              prevList.map(model =>
                String(model.ruleId) === String(currentModel.ruleId) ? { ...model, parmList: refreshedParmList } : model
              )
            );
            // Update parmList state if the updated row belongs to the currently expanded model
            if (parmList.some((param: any) => String(param.id) === String(row.id))) {
              setParmList(refreshedParmList);
            }
          }
        }
      } else {
        message.error((res as any)?.resMsg || '保存失败'); // 访问 resMsg 属性
      }
    } catch (error) {
      message.error('保存失败');
    }
  };
  const startCheck = async () => {
    const checkedNodes = getCheckedNodesList();
    const parentNodes = getAllParentNodes(checkedNodes);
    const data = [...new Set([...parentNodes, ...checkedNodes])];

    try {
      const res = await ImportWorkAPI.ifRunning();
      if (!res.state) {
        Modal.confirm({
          title: '提示',
          content: '有模型正在执行，确定继续提交吗？',
          onOk: () => execRule(data)
        });
      } else {
        execRule(data);
      }
    } catch (error) {
      message.error('检查执行状态失败');
    }
  };
  const getAllParentNodes = (nodes: ModelData[]) => {
    const allParents = new Set<ModelData>();
    const store = treeRef.current?.store;

    const collectParents = (nodeData: ModelData) => {
      allParents.add(nodeData);
      const currentNode = store?.getNode(nodeData.menuId);
      const parentNode = currentNode?.parent;

      if (parentNode?.level === 2) {
        allParents.add(parentNode.data);
        const data = parentNode.parent?.data;
        if (data) allParents.add(data);
      } else if (parentNode?.level === 1) {
        allParents.add(parentNode.data);
      }
    };

    nodes.forEach(collectParents);
    return Array.from(allParents);
  };

  const execRule = async (data: ModelData[]) => {
    try {
      const res = await ImportWorkAPI.execRuleRunTree(data);
      if (res.state) {
        navigate('/checkResult');
      } else {
        message.error(res.resMsg);
      }
    } catch (error) {
      message.error('执行规则失败');
    }
  };
  const onTreeCheck = (checkedKeysValue: any, info: any) => {
    const leafKeys = info.checkedNodes.filter((node: any) => node.isLeaf).map((node: any) => node.key);
    setSelectedKeys(leafKeys);
  };

  return (
    <div className='crud-container'>
      <div className='left-card'>
        <div className='card-header'>
          <div className='title'>
            <FolderOutlined />
            <span>模型目录</span>
          </div>
          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key }) => handleCommand(key)
            }}
            placement='bottomRight'
          >
            <span
              style={{
                cursor: 'pointer'
              }}
            >
              <DownOutlined />
            </span>
          </Dropdown>
        </div>
        <Tree
          ref={treeRef}
          checkable
          treeData={treeData}
          checkedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onCheck={onTreeCheck}
          onExpand={keys => setExpandedKeys(keys as string[])}
          defaultExpandAll={false}
          autoExpandParent={true}
          expandAction='click'
          motion={null}
        />
      </div>
      <div className='right-card'>
        <div className='card-header'>
          <span>已选模型 ({getCheckedNodesList().length})</span>
        </div>
        <Table
          dataSource={getCheckedNodesList()}
          columns={columns}
          expandable={{
            expandedRowRender: record =>
              record.parmList?.length ? (
                <div className='paramTable'>
                  <Table
                    bordered
                    dataSource={parmList}
                    columns={columnsForInfo.map(col => ({
                      ...(col as any),
                      render:
                        col.slot === 'paraValue'
                          ? (_, row: any) => (
                              <Input value={row.paraValue} onChange={e => (row.paraValue = e.target.value)} />
                            )
                          : col.slot === 'action'
                            ? (_, row) => (
                                <Button type='primary' onClick={() => updateRow(row)}>
                                  保存
                                </Button>
                              )
                            : undefined
                    }))}
                  />
                </div>
              ) : (
                <div className='noParams'>未设置模型参数</div>
              ),
            onExpand: toggleRowExpand
          }}
        />
        <div className='footer'>
          <Button type='primary' onClick={startCheck}>
            开始执行
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartCheck;
