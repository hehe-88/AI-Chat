import { Layout } from '@arco-design/web-react'
import * as React from 'react'
import ConversationContent from '../components/conversation'
import ChatFooter from '../components/footer'
import ChatHeader from '../components/header'
import FunctionMenu from '../components/menu'
import './App.css'
const Sider = Layout.Sider
const Header = Layout.Header
const Footer = Layout.Footer
const Content = Layout.Content
const App: React.FC = () => {
  const siderRef = React.useRef<HTMLDivElement>(null)
  return (
    <div className='layout-basic-demo '>
      <Layout className=''>
        <Header>
          <ChatHeader />
        </Header>
        <Layout className='flex'>
          <Sider collapsible ref={siderRef}>
            <FunctionMenu />
          </Sider>
          <Content className='flex-1'>
            <ConversationContent siderRef={siderRef as React.RefObject<HTMLDivElement>} />
          </Content>
        </Layout>
        <Footer>
          <ChatFooter />
        </Footer>
      </Layout>
    </div>
  )
}

export default App
