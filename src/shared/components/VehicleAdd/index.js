import React, { PureComponent } from 'react';
import { func, object } from 'prop-types';
import { message, Button, Select } from 'antd';
import classNames from 'classnames';
import './index.less';

class VehicleAdd extends PureComponent {
  static propTypes = {
    addVehicleTask: func.isRequired,
    fetchActiveTask: func.isRequired,
    hideModal: func.isRequired,
    intl: object.isRequired,
  }

  static defaultProps = {
  }


  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }
  componentDidMount() {
    const { fetchActiveTask } = this.props;
    fetchActiveTask().then(result => {
      this.setState({ list: result.response });
    });
  }

  handleSubmit=() => {
    const { addVehicleTask, intl, hideModal } = this.props;
    const { checkedId } = this.state;
    if (checkedId) {
      addVehicleTask({ originalTaskId: checkedId }).then(({ isOk }) => {
        if (isOk) {
          message.success(intl.formatMessage({ id: 'App.message.add.success' }));
          hideModal();
        }
      });
    } else {
      this.setState({ error: true });
    }
  }

  handleChange=value => {
    this.setState({ checkedId: value });
  }
  render() {
    const {
      hideModal, intl,
    } = this.props;
    let { list } = this.state;
    const { error } = this.state;
    list = list.length && list.map(item => (
      <Select.Option
        value={item.originalTaskId}
        key={item.originalTaskId}
      >{item.originalTaskName}
      </Select.Option>));
    return (
      <div className="vehicle-add-modal">
        <Select defaultValue="选择运行中的任务" className={classNames('select', error && 'error')} onChange={this.handleChange}>
          {list}
        </Select>
        <div className="window-content__footer buttons-group text-center">
          <Button onClick={hideModal}>{intl.formatMessage({ id: 'App.control.cancel' })}</Button>
          <Button
            type="primary"
            onClick={this.handleSubmit}
          >
            {intl.formatMessage({ id: 'App.control.ok' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default VehicleAdd;
