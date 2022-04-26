import React, { PureComponent } from 'react';
import { object } from 'prop-types';
import { Card } from 'antd';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import trafficImage from '../../assets/images/traffic.png';
import driverImage from '../../assets/images/driver.png';
// import addImage from '../../assets/images/add_icon.png';
import './index.less';

class SmartApp extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
  }

  state = {

  }

  componentDidMount() {

  }

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <React.Fragment >
        <div className="app-page smartApp-content">
          <Card
            bordered={false}
            className="app-card smart-app-content"
          >
            <div className="clearfix">
              <div className="card-item">
                <Link to="/smartapp/monitor" >
                  <Card
                    hoverable
                    bordered={false}
                    cover={<img alt="" src={trafficImage} className="img" />}
                  >
                    <span className="fs-16">{formatMessage({ id: 'App.smartapp.monitorName' })}</span>
                  </Card>
                </Link>
              </div>
              <div className="card-item">
                <Link to="/smartapp/reviewplate/tasks" >
                  <Card
                    hoverable
                    bordered={false}
                    cover={<img alt="" src={driverImage} className="img" />}
                  >
                    <span className="fs-16">车牌复审</span>
                  </Card>
                </Link>
              </div>
              {/* <div className="card-item">
                <Link to="/smartapp/driver" >
                  <Card
                    hoverable
                    bordered={false}
                    cover={<img alt="" src={driverImage} className="img" />}
                  >
                    <span className="fs-16">
                    {formatMessage({ id: 'App.smartapp.driverName' })}</span>
                  </Card>
                </Link>
              </div>
              <div className="card-item">
                <Card
                  hoverable
                  bordered={false}
                  cover={<img alt="" src={addImage} className="img" />}
                >
                  <span className="fs-16">
                  {formatMessage({ id: 'App.smartapp.expandAppName' })}</span>
                </Card>
              </div> */}
            </div>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default (injectIntl(SmartApp));
