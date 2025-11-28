import { createI18n } from 'vue-i18n'

// 语言文件
import zh from './zh.json'
import en from './en.json'

export type Language = 'zh' | 'en'

export const messages = {
  zh,
  en,
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: 'zh', // 默认语言
  fallbackLocale: 'zh', // 回退语言
  messages,
  globalInjection: true, // 全局注入 $t 函数
})

export default i18n

