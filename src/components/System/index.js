import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Card, Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import Sider from '../../containers/layout/Sider';
import Basics from './basics/index';
import Time from './time/index';
import UserCenter from './UserCenter/index';
import './index.css';

const { TabPane } = Tabs;


class System extends PureComponent {
  static propTypes = {
    sdkMeta: object.isRequired,
    userMeta: object.isRequired,
    fetchSdks: func.isRequired,
    deleteSdk: func.isRequired,
    sdks: object.isRequired,
    intl: object.isRequired,
    modifyWorkMode: func.isRequired,
    recoverConfig: func.isRequired,
    saveNtp: func.isRequired,
    saveManual: func.isRequired,
    updateSdkStatus: func.isRequired,
    fetchUsers: func.isRequired,
    deleteUser: func.isRequired,
    updateUserStatus: func.isRequired,
    users: object.isRequired,
  }

  state = {

  }

  componentDidMount() {

  }

  render() {
    const {
      fetchSdks, sdks, sdkMeta, deleteSdk, intl, modifyWorkMode, recoverConfig,
      saveNtp, saveManual, updateSdkStatus,
      userMeta, fetchUsers, deleteUser, updateUserStatus, users,
    } = this.props;
    return (
      <React.Fragment>
        <Sider selectedKey="system-setting" />
        <div className="app-page">
          <Card
            bordered={false}
            className="app-card"
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab={intl.formatMessage({ id: 'App.system.basicConfiguration' })} key="1">
                <Basics
                  meta={sdkMeta}
                  fetchSdks={fetchSdks}
                  sdks={sdks}
                  deleteSdk={deleteSdk}
                  intl={intl}
                  modifyWorkMode={modifyWorkMode}
                  recoverConfig={recoverConfig}
                  updateSdkStatus={updateSdkStatus}
                />
              </TabPane>
              <TabPane tab={intl.formatMessage({ id: 'App.system.timeConfiguration' })} key="2">
                <Time saveNtp={saveNtp} intl={intl} saveManual={saveManual} />
              </TabPane>
              <TabPane tab={intl.formatMessage({ id: 'App.system.accountManage' })} key="3">
                <UserCenter
                  meta={userMeta}
                  users={users}
                  fetchUsers={fetchUsers}
                  deleteUser={deleteUser}
                  updateUserStatus={updateUserStatus}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default (injectIntl(System));
