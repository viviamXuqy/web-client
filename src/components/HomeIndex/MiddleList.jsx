import React from 'react';
import { List, Button } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Cicon from '../../shared/components/Cicon';
import { AUTH } from '../../constants/site';
import Cookies from 'js-cookie';

let data = [
  {
    id: 1,
    title: 'App.header.tab.equipment',
    className: 'camera',
    path: '/cameras/ipc',
  },
  {
    id: 2,
    title: 'App.header.tab.task',
    className: 'mission',
    path: '/tasks/analysis',
  },
  {
    id: 3,
    title: 'App.header.tab.result',
    className: 'scan',
    path: '/results/resultsList',
  },
  {
    id: 4,
    title: 'App.header.tab.smartapp',
    className: 'apply',
    path: '/smartapp',
  },
  {
    id: 5,
    title: 'App.header.tab.system',
    className: 'system',
    path: '/system/setting',
  },
];

class MiddleList extends React.PureComponent {
  // 当组件输出到 DOM 后会执行 componentDidMount() 钩子
  componentDidMount() {
  }

  // 组件被从DOM中移除，React会调用componentWillUnmount()这个钩子函数
  componentWillUnmount() {
  }

  render() {
    Cookies.set('user', JSON.stringify({
      grade: 3,
    }));
    const user = JSON.parse(Cookies.get('user'));
    data = user && data.filter(item => AUTH[user.grade].includes(item.path));
    return (
      <div>
        <List
          className="homeindex-results-list"
          grid={{ gutter: 16, column: data.length }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <Link to={item.path}>
                <div className="text-center">
                  <Button type="primary" shape="circle" icon="" size="large" >
                    <Cicon className="index-page-middle-icon" type={item.className} />
                  </Button>
                  <div className="index-page-middle-label"><FormattedMessage id={item.title} /></div>
                </div>
              </Link>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default MiddleList;
