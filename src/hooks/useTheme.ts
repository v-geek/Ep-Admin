import { useSystemStore } from '@/store/modules/system'
import { getDarkColor, getLightColor } from '@/utils/theme'

export function useTheme() {
  const systemStore = useSystemStore()

  const changeDark = (isDark: boolean) => {
    const html = document.documentElement as HTMLElement

    // 添加暗黑模式的类名
    html.classList[isDark ? 'add' : 'remove']('dark')

    // if (isDark) html.setAttribute('class', 'dark')
    // else html.setAttribute('class', '')

    systemStore.setDark(isDark)
  }

  const changeTheme = (color: string) => {
    systemStore.setThemeColor(color)

    const html = document.documentElement as HTMLElement

    // 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色

    // https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/common/var.scss
    // https://doc.buildadmin.com/senior/web/styles.html#%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%8F%98%E9%87%8F

    html.style.setProperty('--el-color-primary', color)

    // 颜色加深或变浅
    for (let i = 1; i <= 9; i++) {
      html.style.setProperty(
        `--el-color-primary-light-${i}`,
        systemStore.isDark ? `${getDarkColor(color, i / 10)}` : `${getLightColor(color, i / 10)}`
      )
    }

    html.style.setProperty(
      '--el-color-primary-dark-2',
      systemStore.isDark ? `${getLightColor(color, 0.2)}` : `${getDarkColor(color, 0.3)}`
    )
  }

  // 页面初始化时, 还原 主题 & 暗黑模式
  const initThemeAndDark = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      systemStore.setDark(true)
    }
    changeDark(systemStore.isDark)
    changeTheme(systemStore.themeColor)
  }

  return {
    changeDark,
    changeTheme,
    initThemeAndDark
  }
}
