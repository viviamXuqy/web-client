import React, { PureComponent } from 'react';
import { object, func } from 'prop-types';
import { Form, Button, Input } from 'antd';
import { injectIntl } from 'react-intl';

import Cicon from '../../../shared/components/Cicon';

class Filter extends PureComponent {
  static propTypes = {
    intl: object.isRequired,
    form: object.isRequired,
    onSearch: func.isRequired,
  }

  handleSubmit = e => {
    e.preventDefault();

    const { onSearch } = this.props;

    this.props.form.validateFieldsAndScroll((err, {
      ...values
    }) => {
      if (!err) {
        const options = {
          ...values,
        };

        onSearch(options);
      }
    });
  }

  render() {
    const { form, intl: { formatMessage }, onSearch } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Form
          className="app-page__filter"
          layout="inline"
          onSubmit={this.handleSubmit}
        >
          <div className="fl">
            <Form.Item>
              {getFieldDecorator('plateNo')(
                <Input className="result-input" placeholder="请输入车牌号" />,
              )}
            </Form.Item>
            <Form.Item className="buttons-group">
              <Button type="primary" htmlType="submit" icon="search">
                {formatMessage({ id: 'App.control.search' })}
              </Button>
              <Button
                className="buttons-group"
                type="primary"
                onClick={onSearch}
              >
                <Cicon type="therefresh" />{formatMessage({ id: 'App.control.reset' })}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields({
    filter: {
      plateNo = '',
    } = {},
  }) {
    const { createFormField } = Form;

    return {
      plateNo: createFormField({
        value: plateNo,
      }),
    };
  },
})(injectIntl(Filter));
