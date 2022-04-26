import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Button, Table } from 'antd';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

class ReviewPlateTaskTable extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    meta: object.isRequired,
    tasks: object.isRequired,
    onShowReviewTaskImageSet: func.isRequired,
    onPaginationChange: func.isRequired,
    onPutReviewPlateTaskStart: func.isRequired,
  }

  static defaultProps = {
  }

  state = {

  }

  componentDidMount() {
  }

  handlePutReviewPlateTaskStart = (id, status) => {
    const { onPutReviewPlateTaskStart } = this.props;

    onPutReviewPlateTaskStart(id, { status: status === 1 ? 2 : 1 });
  }

  handleShowReviewTaskImageSet = (text, record) => {
    const { onShowReviewTaskImageSet } = this.props;
    const { id, area, ratio } = record;

    const currTask = {
      id,
      area,
      ratio,
    };

    onShowReviewTaskImageSet(text, currTask);
  }

  render() {
    const {
      intl,
      tasks,
      meta,
      onPaginationChange,
    } = this.props;
    const columns = [
      {
        title: intl.formatMessage({ id: 'App.RT.taskId' }),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '任务名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => (
          // eslint-disable-next-line no-nested-ternary
          <span>{status === 3 ? '完成' : (status === 1 ? '正在识别' : ((!record.area || record.area.length < 3) ? '未设置' : '关闭'))}</span>
        ),
      }, {
        title: '设置监控区域',
        dataIndex: 'id',
        key: 'setting',
        render: (text, record) => (
          <div className="app-table__actions buttons-group">
            <button onClick={() => this.handleShowReviewTaskImageSet(text, record)} className="tablelink">{intl.formatMessage({ id: 'App.control.set' })}</button>
          </div>
        ),
      }, {
        title: '预览',
        dataIndex: 'id',
        key: 'preview',
        render: (id, record) => (
          <Link to={{ pathname: '/smartapp/reviewplate/preview', state: { taskId: id, name: record.name } }}>
            <button disabled={record.status !== 1 || !record.area || record.area.length < 3} className="tablelink pl-0 pr-0">
              预览
            </button>
          </Link>
        ),
      }, {
        title: '识别结果',
        dataIndex: 'id',
        key: 'result',
        render: id => (
          <Link to={{ pathname: '/smartapp/reviewplate/results', state: { taskId: id } }}>
            <button className="tablelink pl-0 pr-0">
              查看
            </button>
          </Link>
        ),
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'operation',
        render: (id, record) => (
          <Button
            type="primary"
            disabled={record.status === 1 || !record.area || record.area.length < 3}
            onClick={() => this.handlePutReviewPlateTaskStart(id, record.status)}
          >
            开始识别
          </Button>
        ),
      },
    ];
    const dataSource = Object.keys(tasks).length ? [...Object.values(tasks)]
      .map(item => ({
        key: item.id,
        ...item,
      })) : [];

    return (
      <div>
        <Table
          className="app-table"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            ...meta,
            onChange: onPaginationChange,
          }}
        />
      </div>
    );
  }
}

export default injectIntl(ReviewPlateTaskTable);
