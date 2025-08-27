import { Layout } from '@arco-design/web-react'
import * as React from 'react'
import ChatFooter from '../components/footer'
import ChatHeader from '../components/header'
import FunctionMenu from '../components/menu'
import './App.css'
const Sider = Layout.Sider
const Header = Layout.Header
const Footer = Layout.Footer
const Content = Layout.Content
const App: React.FC = () => {
  
  return (
    <div className='layout-basic-demo '>
      <Layout className=''>
        <Header>
          <ChatHeader />
        </Header>
        <Layout className='flex'>
          <Sider collapsible>
            <FunctionMenu />
          </Sider>
          <Content className='flex-1'>Content</Content>
        </Layout>
        <Footer>
          <ChatFooter />
        </Footer>
      </Layout>
    </div>
  )
}

export default App
