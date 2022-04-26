import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Col, Layout, Menu, Avatar, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

import { getLocalLogo } from '../../utils/locale';
import { MENUS, MENUS_REL, AUTH, ROLES_AUTHORITY } from '../../constants/site';
import Cookies from 'js-cookie';
import { setStore } from '../../utils/storage';
import './index.less';


const { Header } = Layout;

class HeaderComp extends PureComponent {
  static propTypes = {
    router: object.isRequired,
    intl: object.isRequired,
  }

  constructor(props) {
    super(props);
    const { router } = props;
    const path = router.location.pathname;

    const pathKey = path.substring(path.indexOf('/'));
    const selectedKeys = [pathKey];
    this.state = {
      current: selectedKeys,
      user: JSON.parse(Cookies.get('user')),
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { router } = nextProps;
    const path = router.location.pathname;

    const pathKey = path.substring(path.indexOf('/'));
    const selectedKeys = [pathKey];
    if (selectedKeys !== prevState) {
      return {
        current: selectedKeys,
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  /* 菜单权限控制，返回角色所拥有的菜单权限 */
  handleAthenticatedMenus = menu => {
    const { user } = this.state;
    return menu
      .filter(key => AUTH[user.grade].includes(MENUS[key].path));
  }

  handleLangChange = key => {
    setStore('locale', key);
    window.location.href = '';
  }
  render() {
    const lang = this.props.intl.locale;
    const { current, user } = this.state;
    const athenticatedMenus = ROLES_AUTHORITY[user.grade];
    const menus = MENUS_REL(user.grade);
    const currentPath = (current && current.length > 0) ? current[0] : '';
    const isMonitorPath = currentPath === '/smartapp/monitor';

    return (
      <Header className={`app-header ${isMonitorPath && 'app-smartapp__monitor-bg'}`}>
        <Row gutter={24}>
          <Col className="gutter-row" span={3}>
            <Link to="/" className="app-logo">
              <img src={getLocalLogo(lang)} alt="Logo" />
            </Link>
          </Col>
          <Col className="gutter-row header-nav__middle" span={15}>
            <Menu
              mode="horizontal"
              theme="dark"
              selectedKeys={current}
              className={isMonitorPath && 'app-smartapp__monitor-bg'}
            >
              {athenticatedMenus.map(key => {
                const { name, path } = menus[key];
                let { subMenu } = menus[key];
                if (subMenu) {
                  subMenu = subMenu.map(item => {
                    if (AUTH[user.grade].includes(item.path)) {
                      return (
                        <Menu.Item key={item.path}>
                          <Link to={item.path}><FormattedMessage id={item.name} /></Link>
                        </Menu.Item>
                      );
                    }
                    return null;
                  });
                  return (
                    <Menu.SubMenu
                      title={<Link to={path}><FormattedMessage id={name} /></Link>}
                      key={path}
                    >
                      {subMenu}
                    </Menu.SubMenu>
                  );
                }
                  return (
                    <Menu.Item key={path}>
                      <Link to={path}><FormattedMessage id={name} /></Link>
                    </Menu.Item>
                  );
              })}
            </Menu>
          </Col>
          <Col className="gutter-row header-nav__right" span={6}>
            <Menu
              mode="horizontal"
              theme="dark"
              className={isMonitorPath && 'app-smartapp__monitor-bg'}
            >
              <Menu.SubMenu
                className="app-header__user-menu"
                title={
                  <div className="app-header__user-name" title={user.username}>
                    <Avatar
                      icon="user"
                      src={user.avatar}
                    />
                    {user.username}
                  </div>
                }
              >
                <Menu.Item key="logout">
                  <Link to="/logout"><Icon type="logout" /><FormattedMessage id="App.header.logout" /></Link>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu
                title={
                  <span>
                    <Icon type="global" />
                    <FormattedMessage id="App.header.language" />
                  </span>
                }
                onClick={({ key }) => this.handleLangChange(key)}
              >
                <Menu.Item key="zh-CN">
                    中文
                </Menu.Item>
                <Menu.Item key="en-US">
                    English
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Col>
        </Row>
      </Header>
    );
  }
}

export default injectIntl(HeaderComp);
