import { h, defineComponent, Component } from 'vue'
import { iconType } from './types'
import { IconifyOffline, IconifyOnline, IconFont } from '../index'

/**
 * @description: 在函数中渲染图标组件, 支持传attr
 * 支持fontawesome4、5+、iconfont、remixicon、element-plus的icons、自定义svg
 * @param icon 必传 图标
 * @param attrs 可选 iconType 属性
 * @return Component
 */

// 用法示例:

// 在 main.js 中 导入 下载的 iconfont
// import './assets/iconfont/iconfont.js'
// import './assets/iconfont/iconfont.css'

// 不传第二个参数, 默认就以 font-class 的形式渲染 IconFont
// useIcon('IF-icon-water' || 'IF-icon-water svg' || 'IF-icon-water uni')

// useIcon('ant-design:bar-chart-outlined', { online: true, color: 'red' })

// useIcon('vertical-left-outlined') || useIcon('vertical-left-outlined', { color: '#000' })

export function useIcon(icon: any, attrs?: iconType): Component {
  const ifReg = /^IF-/

  // iconfont 图标
  if (ifReg.test(icon)) {
    const name = icon.split(ifReg)[1] // 'icon-water' || 'icon-water svg/uni'
    const iconName = name.slice(0, name.indexOf(' ') == -1 ? name.length : name.indexOf(' ')) // 'icon-water'
    const iconType = name.slice(name.indexOf(' ') + 1, name.length) // svg/uni || icon-water(将会走到iconfont的第三种情况, font-class)

    return defineComponent({
      name: 'IconFont',
      render() {
        return h(IconFont, {
          icon: iconName,
          iconType, // 这两个属性合在一起就是传递给 IconFont 的 attrs
          ...attrs // 解构 & 透传给 IconFont
        })
      }
    })
  } else {
    return defineComponent({
      name: 'Icon',
      render() {
        const IconifyIcon = attrs && attrs['online'] ? IconifyOnline : IconifyOffline

        return h(IconifyIcon, {
          icon,
          ...attrs
        })
      }
    })
  }
}
