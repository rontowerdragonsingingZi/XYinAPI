import DefaultTheme from 'vitepress/theme'
import './custom.css'
import DocumentAnimation from './DocumentAnimation.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('DocumentAnimation', DocumentAnimation)
    if (typeof window !== 'undefined') {
      // 等待DOM和Live2D脚本都准备完成后初始化
      const initWhenReady = () => {
        // 确保body存在且Live2D库已加载
        if (document.body && window.L2Dwidget) {
          initLive2D()
        } else {
          setTimeout(initWhenReady, 100)
        }
      }
      
      // 延迟初始化，确保DOM完全加载
      setTimeout(() => {
        initWhenReady()
      }, 500)
    }
  }
}

function initLive2D() {
  // 避免重复初始化
  if (window.live2dInitialized) return
  
  // 确保必要的DOM元素存在
  if (!document.body) {
    console.warn('Live2D: document.body 不存在，延迟初始化')
    setTimeout(initLive2D, 200)
    return
  }
  
  try {
    if (window.L2Dwidget && typeof window.L2Dwidget.init === 'function') {
      window.L2Dwidget.init({
        model: {
          jsonPath: 'https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json'
        },
        display: {
          position: 'right',
          width: 150,
          height: 300,
          hOffset: 0,
          vOffset: 80
        },
        mobile: {
          show: true
        },
        log: false,
        pluginRootPath: 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/',
        pluginJsPath: 'lib/',
        pluginModelPath: 'assets/',
        tagMode: false
      })
      window.live2dInitialized = true
    }
  } catch (error) {
    console.warn('Live2D初始化失败:', error)
    window.live2dInitialized = false
  }
}
