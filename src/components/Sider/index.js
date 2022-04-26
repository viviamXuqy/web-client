import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import { MENUS, AUTH } from '../../constants/site';
import Cicon from '../../shared/components/Cicon';
import Cookies from 'js-cookie';
import './index.css';

class Sider extends PureComponent {
  static propTypes = {
    selectedKey: string.isRequired,
  }

  static defaultProps = {
    // list: ['cameras', 'nvrs', 'results'],
  }

  state = {
    // selectedKeys: [],
  }

  componentDidMount() {
  }

  render() {
    const {
      selectedKey,
    } = this.props;
    const user = JSON.parse(Cookies.get('user'));
    const type = selectedKey.split('-')[0].toUpperCase();
    const menuItem = MENUS[type].subMenu.map(item => {
      let key = item.path.split('/');
      key = `${key[1]}-${key[2]}`;
      const auth = AUTH[user.grade].includes(item.path);
      if (auth) {
        return (
          <Menu.Item type={type} key={key}>
            <Link to={item.path}>
              <span>{item.icon && <Icon type={item.icon} />}
                {item.cicon && <Cicon type={item.cicon} />}
                <FormattedMessage id={item.name} />
              </span>
            </Link>
          </Menu.Item>);
      }
      return null;
    });
    return (
      <Layout.Sider className="app-sider">
        <Menu
          mode="inline"
          theme="dark"
          className="app-sider__menu"
          defaultSelectedKeys={[selectedKey]}
        >
          {menuItem}
        </Menu>
      </Layout.Sider>
    );
  }
}

export default Sider;
