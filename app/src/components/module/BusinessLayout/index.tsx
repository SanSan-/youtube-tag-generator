import React, { ReactElement } from 'react';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

interface Props {
  children?: Array<ReactElement> | ReactElement;
}

const BusinessLayout: React.FC<Props> = ({ children }: Props): ReactElement =>
  <Layout className='layout'>
    <Header>
      <div style={{ color: 'white' }}>Youtube Tags Generator</div>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <div className='site-layout-content'>{children}</div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>SanSan © 2021</Footer>
  </Layout>;

export default BusinessLayout;
