import { Button, Menu } from '@arco-design/web-react'
import { IconCalendar } from '@arco-design/web-react/icon'
import * as React from 'react'
import useStorage from '../../hooks/useStorage'
import type { Conversation } from '../header'
const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const FunctionMenu: React.FC = () => {
  const PRACTICE_ARR = ['HTML', 'CSS', 'JS', 'React', 'TS']
  const [list, setList] = useStorage('list', [] as Conversation[])
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [curIndex, setCurIndex] = useStorage('curIndex', 0)
  // 监听list的变化
  React.useEffect(() => {
    console.log('列表已更新:', list, curIndex)
    // 这里可以添加其他需要在list变化时执行的逻辑
  }, [list])

  return (
    <div>
      <Menu
        defaultOpenKeys={['1']}
        onClickMenuItem={key => {
          console.log('点击了', key)
          setCurIndex(Number(key.split('conversation')[1]))
        }}
        defaultSelectedKeys={[`conversation${curIndex}`]}
        style={{ width: '100%' }}
      >
        <SubMenu
          key='1'
          title={
            <span>
              <IconCalendar />
              AI模拟面试
            </span>
          }
        >
          {list.map((_, index) => {
            return (
              <MenuItem
                key={`conversation${index}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span>对话{index + 1}</span>
                {hoveredIndex === index && (
                  <Button
                    size='mini'
                    type='text'
                    status='danger'
                    onClick={_e => {
                      // e.stopPropagation(); // 阻止事件冒泡
                      // 这里可以添加删除逻辑
                      setList(list.filter((_, i) => i !== index))
                      if (curIndex === index) {
                        setCurIndex(index - 1)
                      }
                    }}
                  >
                    删除
                  </Button>
                )}
              </MenuItem>
            )
          })}
        </SubMenu>
        {/* <SubMenu
          key='2'
          title={
            <span>
              <IconCalendar />
              专项练习
            </span>
          }
        >
          {PRACTICE_ARR.map(practice => {
            return (
              <MenuItem key={`${practice}`}>
                <a href='https://www.baidu.com' target='_blank'>
                  {practice}
                </a>
              </MenuItem>
            )
          })}
        </SubMenu> */}
      </Menu>
    </div>
  )
}
export default FunctionMenu
