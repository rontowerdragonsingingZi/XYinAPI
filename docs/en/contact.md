# Contact Us

<div class="contact-intro">
  <p>Welcome to contact the XYinAPI team! We provide multiple contact methods, and you can choose the most convenient way to communicate with us.</p>
</div>

## Contact Methods

<div class="contact-grid-horizontal">
  <div class="contact-card">
    <div class="card-icon qq-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tencentqq.svg" alt="QQ" />
    </div>
    <div class="card-content">
      <h3>QQ Friend</h3>
      <p class="group-number">ID: <strong>1330141297</strong></p>
      <p class="description">Add QQ friend for technical support</p>
    </div>
  </div>

  <div class="contact-card">
    <div class="card-icon qq-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tencentqq.svg" alt="QQ" />
    </div>
    <div class="card-content">
      <h3>QQ Group</h3>
      <p class="group-number">Group: <strong>792307397</strong></p>
      <p class="description">Join QQ group to communicate with other users</p>
    </div>
  </div>

  <div class="contact-card">
    <div class="card-icon wechat-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/wechat.svg" alt="WeChat" />
    </div>
    <div class="card-content">
      <h3>WeChat ID</h3>
      <p class="wechat-id">WeChat: <strong>XYin20030731</strong></p>
      <p class="description">Add WeChat friend</p>
    </div>
  </div>

  <div class="contact-card">
    <div class="card-icon gmail-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg" alt="Gmail" />
    </div>
    <div class="card-content">
      <h3>Gmail</h3>
      <p class="email-text"><strong>yb8495812@gmail.com</strong></p>
      <p class="description">Contact us via Gmail</p>
    </div>
  </div>

  <div class="contact-card">
    <div class="card-icon qqmail-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tencentqq.svg" alt="QQ Mail" />
    </div>
    <div class="card-content">
      <h3>QQ Mail</h3>
      <p class="email-text"><strong>yabo2003@qq.com</strong></p>
      <p class="description">Contact us via QQ Mail</p>
    </div>
  </div>

  <div class="contact-card">
    <div class="card-icon telegram-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg" alt="Telegram" />
    </div>
    <div class="card-content">
      <h3>Telegram</h3>
      <p class="telegram-text"><strong>@MahoSys</strong></p>
      <p class="description">Contact us via Telegram</p>
    </div>
  </div>
</div>

## Support Us

<div class="support-intro">
  <p>If you find our service helpful, welcome to support us through the following methods!</p>
</div>

<div class="contact-grid-horizontal">
  <div class="contact-card payment-card">
    <div class="card-icon wechat-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/wechat.svg" alt="WeChat" />
    </div>
    <h3>WeChat Reward</h3>
    <div class="payment-qr">
      <img src="/images/微信收款.jpg" alt="WeChat Payment QR Code" />
    </div>
    <p class="description">Scan to reward via WeChat</p>
  </div>

  <div class="contact-card payment-card">
    <div class="card-icon alipay-icon">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/alipay.svg" alt="Alipay" />
    </div>
    <h3>Alipay Reward</h3>
    <div class="payment-qr">
      <img src="/images/支付宝收款.jpg" alt="Alipay Payment QR Code" />
    </div>
    <p class="description">Scan to reward via Alipay</p>
  </div>
</div>

<style scoped>
.contact-intro,
.support-intro {
  text-align: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-bg-soft) 100%);
  border-radius: 12px;
}

.contact-intro p,
.support-intro p {
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
  margin: 0;
}

.section-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  display: inline-block;
  width: 28px;
  height: 28px;
  color: var(--vp-c-brand-1);
}

.contact-grid-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 2.5rem 0;
  justify-content: center;
}

.contact-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  text-align: left;
}

.contact-card.payment-card {
  flex: 0 1 calc(33.333% - 1.5rem);
  min-width: 240px;
  max-width: 300px;
  flex-direction: column;
  text-align: center;
  gap: 0;
  padding: 1.5rem;
}

.contact-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.contact-card:hover::before {
  transform: scaleX(1);
}

.contact-card.featured {
  border-color: var(--vp-c-brand-1);
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-brand-soft) 100%);
}

.contact-card.support {
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, rgba(255, 193, 7, 0.1) 100%);
}

.card-icon {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: var(--vp-c-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-card.payment-card .card-icon {
  margin: 0 auto 1.5rem;
}

.card-icon img {
  width: 50px;
  height: 50px;
  animation: float 3s ease-in-out infinite;
}

.qq-icon img {
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(180deg) brightness(118%) contrast(119%);
}

.wechat-icon img {
  filter: invert(64%) sepia(88%) saturate(1739%) hue-rotate(85deg) brightness(95%) contrast(101%);
}

.alipay-icon img {
  filter: invert(47%) sepia(96%) saturate(1993%) hue-rotate(193deg) brightness(103%) contrast(101%);
}

.gmail-icon img {
  filter: invert(27%) sepia(98%) saturate(7495%) hue-rotate(359deg) brightness(99%) contrast(118%);
}

.qqmail-icon img {
  filter: invert(27%) sepia(98%) saturate(7495%) hue-rotate(359deg) brightness(99%) contrast(118%);
}

.telegram-icon img {
  filter: invert(64%) sepia(59%) saturate(4498%) hue-rotate(175deg) brightness(97%) contrast(101%);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contact-card.payment-card .card-content {
  flex: none;
}

.contact-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand-1);
  font-size: 1.25rem;
  font-weight: 600;
}

.group-number,
.wechat-id,
.email-text,
.telegram-text {
  margin: 0.25rem 0;
  color: var(--vp-c-text-1);
  font-size: 1rem;
}

.group-number strong,
.wechat-id strong,
.email-text strong,
.telegram-text strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
  font-family: 'Courier New', monospace;
}

.description {
  margin: 0.25rem 0 0 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.5;
}

.payment-qr {
  margin: 1.5rem auto;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 200px;
  height: 200px;
}

.payment-qr img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}

.support-intro {
  text-align: center;
  margin: 1rem 0 2rem 0;
}

.support-intro p {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contact-grid-horizontal {
    flex-direction: column;
    align-items: center;
  }

  .contact-card {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .contact-card.payment-card {
    max-width: 100%;
  }

  .payment-qr {
    width: 180px;
    height: 180px;
  }

  .payment-qr img {
    width: 160px;
    height: 160px;
  }
}
</style>

