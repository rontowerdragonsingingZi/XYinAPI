export default {
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/logo.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/logo.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/logo.png' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['script', { src: 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js' }]
  ],
  vite: {
    server: {
      allowedHosts: ['vitepress.xyin.online']
    }
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'XYinAPI 文档转换服务',
      description: '强大的文档转换服务 - 支持 DOCX、PDF、图片等多种格式互转',
      themeConfig: {
        logo: '/images/logo.png',
        siteTitle: 'XYinAPI',
        nav: [
          { text: '首页', link: '/' },
          { text: 'API 文档', link: '/api/' },
          { text: '联系我们', link: '/contact' },
          {
            text: '联系我们',
            items: [
              { text: 'Swagger UI', link: 'https://api.xyin.online/docs', target: '_blank' },
              { text: 'ReDoc', link: 'https://api.xyin.online/redoc', target: '_blank' }
            ]
          }
        ],
        sidebar: {
          '/api/': [
            {
              text: 'API 概览',
              collapsed: false,
              items: [
                { text: 'API 介绍', link: '/api/' },
                { text: '基础信息', link: '/api/basic' },
                { text: '错误处理', link: '/api/errors' }
              ]
            },
            {
              text: '文档转换',
              collapsed: false,
              items: [
                { text: 'DOCX ↔ PDF', link: '/api/conversion/document' },
                { text: 'Word → 高清图片', link: '/api/conversion/word-to-image' },
                { text: '图片 → PDF', link: '/api/conversion/image-to-pdf' },
                { text: 'PDF → PNG', link: '/api/conversion/pdf-to-png' }
              ]
            },
            {
              text: 'PDF 操作',
              collapsed: true,
              items: [
                { text: 'PDF 页数统计', link: '/api/pdf/page-count' },
                { text: 'PDF 拆分', link: '/api/pdf/split' },
                { text: 'PDF 合并', link: '/api/pdf/merge' },
                { text: 'PDF 文字提取', link: '/api/pdf/extract-text' },
                { text: 'PDF 水印', link: '/api/pdf/watermark' },
                { text: '去除空白页', link: '/api/pdf/remove-blank' }
              ]
            },
            {
              text: 'PDF 安全',
              collapsed: true,
              items: [
                { text: 'PDF 加密', link: '/api/security/encrypt' },
                { text: 'PDF 解密', link: '/api/security/decrypt' },
                { text: '密码验证', link: '/api/security/verify-password' }
              ]
            },
            {
              text: '系统管理',
              collapsed: true,
              items: [
                { text: '健康检查', link: '/api/system/health' },
                { text: '文件下载', link: '/api/system/download' },
                { text: '清理文件', link: '/api/system/cleanup' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com' }
        ],
        footer: {
          message: 'XYinAPI 文档转换服务',
          copyright: 'Copyright © 2024 XYinAPI'
        },
        outline: {
          level: [2, 3],
          label: '页面导航'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'XYinAPI Document Conversion Service',
      description: 'Powerful Document Conversion Service - Support DOCX, PDF, Images and More',
      themeConfig: {
        logo: '/images/logo.png',
        siteTitle: 'XYinAPI',
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'API Docs', link: '/en/api/' },
          { text: 'Contact', link: '/en/contact' },
          {
            text: 'Contact Us',
            items: [
              { text: 'Swagger UI', link: 'https://api.xyin.online/docs', target: '_blank' },
              { text: 'ReDoc', link: 'https://api.xyin.online/redoc', target: '_blank' }
            ]
          }
        ],
        sidebar: {
          '/en/api/': [
            {
              text: 'API Overview',
              collapsed: false,
              items: [
                { text: 'API Introduction', link: '/en/api/' },
                { text: 'Basic Information', link: '/en/api/basic' },
                { text: 'Error Handling', link: '/en/api/errors' }
              ]
            },
            {
              text: 'Document Conversion',
              collapsed: false,
              items: [
                { text: 'DOCX ↔ PDF', link: '/en/api/conversion/document' },
                { text: 'Word → Image', link: '/en/api/conversion/word-to-image' },
                { text: 'Image → PDF', link: '/en/api/conversion/image-to-pdf' },
                { text: 'PDF → PNG', link: '/en/api/conversion/pdf-to-png' }
              ]
            },
            {
              text: 'PDF Operations',
              collapsed: true,
              items: [
                { text: 'PDF Page Count', link: '/en/api/pdf/page-count' },
                { text: 'PDF Split', link: '/en/api/pdf/split' },
                { text: 'PDF Merge', link: '/en/api/pdf/merge' },
                { text: 'PDF Extract Text', link: '/en/api/pdf/extract-text' },
                { text: 'PDF Watermark', link: '/en/api/pdf/watermark' },
                { text: 'Remove Blank Pages', link: '/en/api/pdf/remove-blank' }
              ]
            },
            {
              text: 'PDF Security',
              collapsed: true,
              items: [
                { text: 'PDF Encrypt', link: '/en/api/security/encrypt' },
                { text: 'PDF Decrypt', link: '/en/api/security/decrypt' },
                { text: 'Verify Password', link: '/en/api/security/verify-password' }
              ]
            },
            {
              text: 'System Management',
              collapsed: true,
              items: [
                { text: 'Health Check', link: '/en/api/system/health' },
                { text: 'File Download', link: '/en/api/system/download' },
                { text: 'Cleanup Files', link: '/en/api/system/cleanup' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com' }
        ],
        footer: {
          message: 'XYinAPI Document Conversion Service',
          copyright: 'Copyright © 2024 XYinAPI'
        },
        outline: {
          level: [2, 3],
          label: 'Page Navigation'
        }
      }
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    }
  }
}
