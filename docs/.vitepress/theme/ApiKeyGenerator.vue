<template>
  <div class="api-key-generator">
    <div class="generator-container">
      <div class="header">
        <h1>{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </div>

      <!-- 生成按鈕區域 -->
      <div class="action-section" v-if="!generatedToken">
        <button
          class="generate-button primary"
          @click="generateToken('7d')"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">{{ freeButtonText }}</span>
          <span v-else>{{ loadingText }}</span>
        </button>
      </div>

      <!-- 驗證 API Key 區域 -->
      <div class="verify-section" v-if="!generatedToken">
        <div class="divider">
          <span>{{ verifyDividerText }}</span>
        </div>

        <div class="verify-input-group">
          <input
            v-model="verifyToken"
            type="text"
            :placeholder="verifyPlaceholderText"
            class="verify-input"
            @keyup.enter="verifyApiKey"
          />
          <button
            class="verify-button"
            @click="verifyApiKey"
            :disabled="isVerifying || !verifyToken.trim()"
          >
            <span v-if="!isVerifying">{{ verifyButtonText }}</span>
            <span v-else>{{ loadingText }}</span>
          </button>
        </div>

        <!-- 驗證結果顯示 -->
        <div class="verify-result" v-if="verifyResult">
          <div class="result-card" :class="verifyResult.valid ? 'valid' : 'invalid'">
            <div class="result-header">
              <svg v-if="verifyResult.valid" class="icon-success" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <svg v-else class="icon-error" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <h4>{{ verifyResult.message }}</h4>
            </div>

            <div class="result-details" v-if="verifyResult.valid">
              <div class="detail-item">
                <span class="label">{{ verifyExpiryOptionText }}:</span>
                <span class="value">{{ formatExpiryOption(verifyResult.expiry_option) }}</span>
              </div>
              <div class="detail-item" v-if="verifyResult.expires_at">
                <span class="label">{{ verifyExpiresAtText }}:</span>
                <span class="value">{{ formatDateTime(verifyResult.expires_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">{{ verifyIssuedAtText }}:</span>
                <span class="value">{{ formatDateTime(verifyResult.issued_at) }}</span>
              </div>
            </div>

            <div class="result-error" v-if="!verifyResult.valid && verifyResult.error">
              <p>{{ verifyResult.error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Token 显示区域 -->
      <div class="token-display" v-if="generatedToken">
        <div class="token-info">
          <h3>{{ successTitle }}</h3>
          <div class="token-box">
            <code>{{ generatedToken }}</code>
            <button class="copy-button" @click="copyToken" :title="copyButtonText">
              <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
          <p class="expiry-info">{{ expiryText }}: <strong>{{ expiryDisplay }}</strong></p>
        </div>

        <!-- 升级广告 -->
        <div class="upgrade-ad">
          <p class="ad-text">{{ upgradeAdText }}</p>

          <!-- 按钮组 -->
          <div class="button-group">
            <button class="action-button upgrade-button" @click="handleUpgrade">
              {{ upgradeButtonText }}
            </button>
            <button class="action-button regenerate-button" @click="resetGenerator">
              {{ regenerateButtonText }}
            </button>
          </div>
        </div>
      </div>

      <!-- 錯誤提示 -->
      <div class="error-message" v-if="errorMessage">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '获取 API Key'
  },
  subtitle: {
    type: String,
    default: '免费生成您的 API 访问令牌'
  },
  freeButtonText: {
    type: String,
    default: '免费获取 Key'
  },
  upgradeAdText: {
    type: String,
    default: '联系我们为您的API key延长为永久或进行商业与技术合作交流，XYin团队欢迎您！'
  },
  upgradeButtonText: {
    type: String,
    default: '升级'
  },
  loadingText: {
    type: String,
    default: '处理中...'
  },
  copyButtonText: {
    type: String,
    default: '复制'
  },
  successTitle: {
    type: String,
    default: '您的 API Key'
  },
  expiryText: {
    type: String,
    default: '过期时间'
  },
  regenerateButtonText: {
    type: String,
    default: '重新生成'
  },
  contactUrl: {
    type: String,
    default: '/contact'
  },
  apiBaseUrl: {
    type: String,
    default: 'https://api.xyin.online'
  },
  verifyDividerText: {
    type: String,
    default: '或'
  },
  verifyPlaceholderText: {
    type: String,
    default: '输入您的 API Key 验证时长'
  },
  verifyButtonText: {
    type: String,
    default: '验证'
  },
  verifyExpiryOptionText: {
    type: String,
    default: '有效期类型'
  },
  verifyExpiresAtText: {
    type: String,
    default: '过期时间'
  },
  verifyIssuedAtText: {
    type: String,
    default: '签发时间'
  }
})

const isLoading = ref(false)
const generatedToken = ref('')
const expiryInfo = ref('')
const errorMessage = ref('')
const copied = ref(false)

// 驗證相關狀態
const verifyToken = ref('')
const isVerifying = ref(false)
const verifyResult = ref(null)

const expiryDisplay = computed(() => {
  if (expiryInfo.value === 'forever') {
    return props.expiryText === '过期时间' ? '永不过期' : 'Never Expires'
  }
  return props.expiryText === '过期时间' ? '7天后过期' : 'Expires in 7 days'
})

const generateToken = async (expiry) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${props.apiBaseUrl}/auth/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expiry })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      generatedToken.value = data.token
      expiryInfo.value = data.expiry
    } else {
      errorMessage.value = data.message || (props.expiryText === '过期时间' ? '生成失败，请稍后重试' : 'Generation failed, please try again later')
    }
  } catch (error) {
    errorMessage.value = props.expiryText === '过期时间' ? '网络错误，请检查连接' : 'Network error, please check your connection'
  } finally {
    isLoading.value = false
  }
}

const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(generatedToken.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const handleUpgrade = () => {
  window.location.href = props.contactUrl
}

const resetGenerator = () => {
  generatedToken.value = ''
  expiryInfo.value = ''
  errorMessage.value = ''
  copied.value = false
}

// 驗證 API Key
const verifyApiKey = async () => {
  if (!verifyToken.value.trim()) return

  isVerifying.value = true
  verifyResult.value = null
  errorMessage.value = ''

  try {
    const response = await fetch(`${props.apiBaseUrl}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: verifyToken.value.trim() })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      verifyResult.value = data
    } else {
      errorMessage.value = data.message || (props.expiryText === '过期时间' ? '验证失败，请稍后重试' : 'Verification failed, please try again later')
    }
  } catch (error) {
    errorMessage.value = props.expiryText === '过期时间' ? '网络错误，请检查连接' : 'Network error, please check your connection'
  } finally {
    isVerifying.value = false
  }
}

// 格式化過期選項
const formatExpiryOption = (option) => {
  if (option === 'forever') {
    return props.expiryText === '过期时间' ? '永久' : 'Forever'
  }
  if (option === '7d') {
    return props.expiryText === '过期时间' ? '7天' : '7 Days'
  }
  return option
}

// 格式化日期時間
const formatDateTime = (dateString) => {
  if (!dateString) return '-'

  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    return dateString
  }
}
</script>

<style scoped>
.api-key-generator {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.generator-container {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand);
}

.subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

.action-section {
  text-align: center;
  margin: 2rem 0;
}

.generate-button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.generate-button:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.generate-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.token-display {
  margin-top: 2rem;
}

.token-info {
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.token-info h3 {
  margin-bottom: 1rem;
  color: var(--vp-c-brand);
}

.token-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 1rem;
}

.token-box code {
  flex: 1;
  word-break: break-all;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.copy-button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.copy-button:hover {
  background: var(--vp-c-brand-dark);
}

.expiry-info {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.upgrade-ad {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: center;
}

.ad-text {
  color: var(--vp-c-text-1);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  font-weight: 500;
  border: none;
}

.upgrade-button {
  background: var(--vp-c-brand);
  color: white;
}

.upgrade-button:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.regenerate-button {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.regenerate-button:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
}

/* 驗證區域樣式 */
.verify-section {
  margin-top: 2rem;
  padding-top: 2rem;
}

.divider {
  text-align: center;
  margin: 2rem 0 1.5rem;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: var(--vp-c-divider);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: var(--vp-c-bg-soft);
  padding: 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.verify-input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.verify-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.verify-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(var(--vp-c-brand-rgb), 0.1);
}

.verify-input::placeholder {
  color: var(--vp-c-text-3);
}

.verify-button {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.verify-button:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.verify-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.verify-result {
  margin-top: 1.5rem;
}

.result-card {
  border-radius: 8px;
  padding: 1.5rem;
  border: 2px solid;
  transition: all 0.3s;
}

.result-card.valid {
  background: rgba(16, 185, 129, 0.05);
  border-color: #10b981;
}

.result-card.invalid {
  background: rgba(239, 68, 68, 0.05);
  border-color: #ef4444;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.result-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.icon-success {
  color: #10b981;
  flex-shrink: 0;
}

.icon-error {
  color: #ef4444;
  flex-shrink: 0;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.detail-item .value {
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-size: 0.95rem;
}

.result-error {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
}

.result-error p {
  margin: 0;
  color: #ef4444;
  font-size: 0.9rem;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .verify-input-group {
    flex-direction: column;
  }

  .verify-button {
    width: 100%;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>

