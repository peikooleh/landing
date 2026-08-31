(() => {
  const config = window.MOYAMOVA_CONFIG || {};
  const trainerUrl = config.trainerUrl || 'https://moyamova.online/';

  function trackEvent(name, params = {}) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  }

  const translations = {
    ru: {
      navTrainer: 'Тренажёр', navHelp: 'Помощь', eyebrow: 'Немецкий без лишней теории',
      heroTitle: 'Учи немецкий<br><span>практикой.</span>',
      heroLead: 'MOYAMOVA — простой тренажёр слов, артиклей и конструкций. Открывается прямо в браузере.',
      openTrainer: 'Запустить тренажёр', heroNote: 'Бесплатно · без установки',
      point1: 'Слова и переводы', point2: 'Артикли и грамматика', point3: 'Повторение ошибок',
      floatPractice: 'Практика<br><b>без перегруза</b>', floatLevel: 'в одном<br>тренажёре',
      trainerKicker: 'Внутри MOYAMOVA', trainerTitle: 'Только то, что помогает практиковаться.',
      trainerIntro: 'Короткие сессии, понятный интерфейс и разные типы заданий — чтобы возвращаться к немецкому регулярно.',
      feature1Title: 'Слова и переводы', feature1Text: 'Тренируйте лексику в обе стороны и сразу проверяйте себя.',
      feature2Title: 'Артикли', feature2Text: 'Отдельная практика der, die, das без лишних отвлечений.',
      feature3Title: 'Конструкции', feature3Text: 'Закрепляйте предлоги и устойчивые сочетания на практике.',
      flow1: 'Изучи', flow2: 'Повтори', flow3: 'Посмотри', flow4: 'Практикуй снова',
      youtubeTitle: 'Смотри. Запоминай. Возвращайся к практике.', youtubeIntro: 'Два канала с немецким: выбирайте удобный язык объяснений.',
      videoPending: 'Загружаем последние видео…', videoConfig: 'Если список ещё не обновился — откройте канал напрямую.',
      channelUkText: 'Немецкий с украинским переводом', channelRuText: 'Немецкий с русским переводом', openChannel: 'Открыть канал',
      scheduleKicker: 'График публикаций', scheduleTitle: 'Новый немецкий — почти каждый день.',
      scheduleNote: 'Русский канал сейчас активно наполняется. После синхронизации контента оба канала перейдут на стабильный график: 2 длинных видео в неделю + Shorts каждый день.',
      scheduleUa: 'Украинский канал', scheduleRu: 'Русский канал', shortsLabel: 'Shorts', shortsTime: 'ежедневно · 07:00<br>выходные · 09:00',
      longLabel: 'Большие видео', uaLongTime: 'вт · пт · 17:00', ruLongTime: 'пн · вт · чт · пт · 17:00',
      playlistKicker: 'Все подборки', playlistTitle: 'Выбери тему и продолжай на YouTube.',
      playlistIntro: 'Плейлисты обновляются автоматически — новые подборки появятся здесь вместе с обложками.',
      playlistUa: 'Українською', playlistRu: 'По-русски', allOnYoutube: 'Все на YouTube', playlistLoading: 'Загружаем плейлисты…', playlistUnavailable: 'Плейлисты временно недоступны. Откройте канал на YouTube.',
      viberTitle: 'Присоединяйся к сообществу MOYAMOVA.', viberText: 'Новости проекта, обновления тренажёра и связь с MOYAMOVA — в одной группе.', joinViber: 'Открыть Viber',
      helpKicker: 'MOYAMOVA как приложение', helpTitle: 'Добавь тренажёр на главный экран телефона.',
      helpText: 'Короткая инструкция для iPhone / iPad и Android, плюс ответы по использованию MOYAMOVA.', openHelp: 'Открыть помощь',
      betaKicker: 'Бета-тест MOYAMOVA', betaTitle: 'Хотите помочь MOYAMOVA стать лучше?',
      betaText: 'Присоединяйтесь к бета-тестированию новых функций и версий приложения.', betaButton: 'Стать бета-тестером',
      ctaKicker: 'Можно начать прямо сейчас', ctaTitle: 'Открой MOYAMOVA и попробуй одну сессию.',
      footerText: 'Немецкий — меньше теории, больше практики.', trainerLink: 'Тренажёр', privacy: 'Политика конфиденциальности', terms: 'Условия использования'
    },
    uk: {
      navTrainer: 'Тренажер', navHelp: 'Допомога', eyebrow: 'Німецька без зайвої теорії',
      heroTitle: 'Вивчай німецьку<br><span>на практиці.</span>',
      heroLead: 'MOYAMOVA — простий тренажер слів, артиклів і конструкцій. Відкривається просто у браузері.',
      openTrainer: 'Запустити тренажер', heroNote: 'Безкоштовно · без встановлення',
      point1: 'Слова й переклади', point2: 'Артиклі та граматика', point3: 'Повторення помилок',
      floatPractice: 'Практика<br><b>без перевантаження</b>', floatLevel: 'в одному<br>тренажері',
      trainerKicker: 'Всередині MOYAMOVA', trainerTitle: 'Тільки те, що допомагає практикуватися.',
      trainerIntro: 'Короткі сесії, зрозумілий інтерфейс і різні типи завдань — щоб регулярно повертатися до німецької.',
      feature1Title: 'Слова й переклади', feature1Text: 'Тренуйте лексику в обидва боки та одразу перевіряйте себе.',
      feature2Title: 'Артиклі', feature2Text: 'Окрема практика der, die, das без зайвих відволікань.',
      feature3Title: 'Конструкції', feature3Text: 'Закріплюйте прийменники та сталі сполучення на практиці.',
      flow1: 'Вивчи', flow2: 'Повтори', flow3: 'Подивись', flow4: 'Практикуй знову',
      youtubeTitle: 'Дивись. Запам’ятовуй. Повертайся до практики.', youtubeIntro: 'Два канали з німецькою: обирайте зручну мову пояснень.',
      videoPending: 'Завантажуємо останні відео…', videoConfig: 'Якщо список ще не оновився — відкрийте канал напряму.',
      channelUkText: 'Німецька з українським перекладом', channelRuText: 'Німецька з російським перекладом', openChannel: 'Відкрити канал',
      scheduleKicker: 'Графік публікацій', scheduleTitle: 'Нова німецька — майже щодня.',
      scheduleNote: 'Російський канал зараз активно наповнюється. Після синхронізації контенту обидва канали перейдуть на стабільний графік: 2 довгі відео на тиждень + Shorts щодня.',
      scheduleUa: 'Український канал', scheduleRu: 'Російський канал', shortsLabel: 'Shorts', shortsTime: 'щодня · 07:00<br>вихідні · 09:00',
      longLabel: 'Довгі відео', uaLongTime: 'вт · пт · 17:00', ruLongTime: 'пн · вт · чт · пт · 17:00',
      playlistKicker: 'Усі добірки', playlistTitle: 'Обери тему та продовжуй на YouTube.',
      playlistIntro: 'Плейлисти оновлюються автоматично — нові добірки з’являться тут разом з обкладинками.',
      playlistUa: 'Українською', playlistRu: 'Російською', allOnYoutube: 'Усе на YouTube', playlistLoading: 'Завантажуємо плейлисти…', playlistUnavailable: 'Плейлисти тимчасово недоступні. Відкрийте канал на YouTube.',
      viberTitle: 'Приєднуйся до спільноти MOYAMOVA.', viberText: 'Новини проєкту, оновлення тренажера та зв’язок із MOYAMOVA — в одній групі.', joinViber: 'Відкрити Viber',
      helpKicker: 'MOYAMOVA як застосунок', helpTitle: 'Додай тренажер на головний екран телефона.',
      helpText: 'Коротка інструкція для iPhone / iPad та Android, а також відповіді щодо використання MOYAMOVA.', openHelp: 'Відкрити допомогу',
      betaKicker: 'Бета-тест MOYAMOVA', betaTitle: 'Хочете допомогти MOYAMOVA стати кращою?',
      betaText: 'Приєднуйтеся до бета-тестування нових функцій і версій застосунку.', betaButton: 'Стати бета-тестером',
      ctaKicker: 'Можна почати прямо зараз', ctaTitle: 'Відкрий MOYAMOVA і спробуй одну сесію.',
      footerText: 'Німецька — менше теорії, більше практики.', trainerLink: 'Тренажер', privacy: 'Політика конфіденційності', terms: 'Умови використання'
    }
  };

  function openTrainer(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const targetUrl = link?.href || trainerUrl;
    const location = link?.closest('.hero') ? 'hero' : (link?.closest('.final-cta') ? 'final_cta' : 'other');

    trackEvent('trainer_open', {
      location,
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      language: document.documentElement.dataset.lang || 'ru'
    });

    const isSmall = window.matchMedia('(max-width: 720px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isSmall) {
      window.open(targetUrl, '_blank', 'noopener');
      return;
    }
    const width = 430;
    const height = Math.min(820, Math.max(650, window.screen.availHeight - 80));
    const left = Math.max(0, Math.round((window.screen.availWidth - width) / 2));
    const top = Math.max(0, Math.round((window.screen.availHeight - height) / 2));
    const popup = window.open(targetUrl, 'moyamova_trainer', `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);
    if (!popup) window.open(targetUrl, '_blank', 'noopener');
  }

  document.querySelectorAll('[data-open-trainer]').forEach(link => {
    link.href = trainerUrl;
    link.addEventListener('click', openTrainer);
  });

  function setLanguage(lang) {
    if (!translations[lang]) lang = 'ru';
    document.documentElement.lang = lang === 'uk' ? 'uk' : 'ru';
    document.documentElement.dataset.lang = lang;
    document.querySelectorAll('[data-lang-btn]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.langBtn === lang));
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = translations[lang][el.dataset.i18n];
      if (value != null) el.innerHTML = value;
    });
    const legalLang = lang === 'uk' ? 'uk' : 'ru';
    document.querySelectorAll('[data-legal-link]').forEach(link => {
      const doc = link.dataset.legalLink;
      if (doc) link.href = `./legal/${doc}.${legalLang}.html`;
    });
    localStorage.setItem('moyamova-lang', lang);
  }

  document.querySelectorAll('[data-lang-btn]').forEach(btn => btn.addEventListener('click', () => {
    const lang = btn.dataset.langBtn;
    trackEvent('language_change', { language: lang });
    setLanguage(lang);
  }));
  setLanguage(localStorage.getItem('moyamova-lang') || (navigator.language?.toLowerCase().startsWith('uk') ? 'uk' : 'ru'));

  function setupChannelLink(code) {
    const channel = config.channels?.[code];
    if (!channel) return;
    const link = document.querySelector(`[data-channel-link="${code}"]`);
    const channelId = (channel.channelId || '').trim();
    const channelUrl = (channel.channelUrl || '').trim() || (channelId ? `https://www.youtube.com/channel/${channelId}` : '');

    if (link && channelUrl) {
      link.href = channelUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.classList.remove('is-disabled');
      link.removeAttribute('aria-disabled');
    }
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function renderVideos(code, videos) {
    const slot = document.querySelector(`[data-video-slot="${code}"]`);
    if (!slot || !Array.isArray(videos) || !videos.length) return;

    slot.classList.add('has-videos');
    slot.innerHTML = videos.slice(0, 3).map((video, index) => {
      const id = encodeURIComponent(video.id || '');
      const url = `https://www.youtube.com/watch?v=${id}`;
      const thumb = video.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      const title = escapeHtml(video.title || 'MOYAMOVA');
      const date = video.published ? new Date(video.published) : null;
      const dateLabel = date && !Number.isNaN(date.valueOf())
        ? new Intl.DateTimeFormat(document.documentElement.lang === 'uk' ? 'uk-UA' : 'ru-RU', {day:'2-digit', month:'short'}).format(date)
        : '';

      return `<a class="video-card${index === 0 ? ' video-card-main' : ''}" data-youtube-video="${code}" href="${url}" target="_blank" rel="noopener" aria-label="${title}">
        <span class="video-thumb">
          <img src="${escapeHtml(thumb)}" alt="" loading="lazy">
          <span class="video-play" aria-hidden="true">▶</span>
        </span>
        <span class="video-meta">
          <strong>${title}</strong>
          ${dateLabel ? `<small>${escapeHtml(dateLabel)}</small>` : ''}
        </span>
      </a>`;
    }).join('');
  }


  function renderPlaylists(code, playlists) {
    const slot = document.querySelector(`[data-playlist-slot="${code}"]`);
    if (!slot) return;
    if (!Array.isArray(playlists) || !playlists.length) {
      const lang = document.documentElement.dataset.lang || 'ru';
      slot.innerHTML = `<div class="playlist-empty">${translations[lang].playlistUnavailable}</div>`;
      return;
    }

    slot.innerHTML = playlists.map(playlist => {
      const id = encodeURIComponent(playlist.id || '');
      const url = playlist.url || `https://www.youtube.com/playlist?list=${id}`;
      const title = escapeHtml(playlist.title || 'MOYAMOVA');
      const thumb = escapeHtml(playlist.thumbnail || '');
      const count = Number.isFinite(Number(playlist.videoCount)) && Number(playlist.videoCount) > 0
        ? Number(playlist.videoCount)
        : null;
      const countLabel = count
        ? (document.documentElement.lang === 'uk' ? `${count} відео` : `${count} видео`)
        : 'YouTube';

      return `<a class="playlist-card" data-youtube-playlist="${code}" href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${title}">
        <span class="playlist-thumb">
          ${thumb ? `<img src="${thumb}" alt="" loading="lazy">` : '<span class="playlist-thumb-fallback">MOYAMOVA</span>'}
          <span class="playlist-layer" aria-hidden="true"></span>
          <span class="playlist-icon" aria-hidden="true">▶</span>
        </span>
        <span class="playlist-meta">
          <strong>${title}</strong>
          <small>${escapeHtml(countLabel)}</small>
        </span>
      </a>`;
    }).join('');
  }

  async function loadLatestVideos() {
    try {
      const response = await fetch('./assets/data/youtube.json', {cache: 'no-store'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const ukData = data.channels?.uk || {};
      const ruData = data.channels?.ru || {};
      renderVideos('uk', Array.isArray(ukData) ? ukData : (ukData.videos || []));
      renderVideos('ru', Array.isArray(ruData) ? ruData : (ruData.videos || []));
      renderPlaylists('uk', Array.isArray(ukData) ? [] : (ukData.playlists || []));
      renderPlaylists('ru', Array.isArray(ruData) ? [] : (ruData.playlists || []));
    } catch (error) {
      console.warn('MOYAMOVA: youtube.json is not available yet.', error);
    }
  }


  const viberUrl = (config.viberUrl || '').trim();
  if (viberUrl) {
    const block = document.querySelector('[data-viber-block]');
    if (block) block.hidden = false;
    document.querySelectorAll('[data-viber-link], [data-viber-footer]').forEach(link => {
      link.href = viberUrl;
      link.hidden = false;
    });
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('a');
    if (!target) return;

    const language = document.documentElement.dataset.lang || 'ru';

    if (target.matches('[data-channel-link]')) {
      trackEvent('youtube_channel_click', {
        channel: target.dataset.channelLink || 'unknown',
        location: target.closest('.playlist-language') ? 'playlists' : 'channel_card',
        language
      });
      return;
    }

    if (target.matches('[data-youtube-video]')) {
      trackEvent('youtube_video_click', { channel: target.dataset.youtubeVideo, language });
      return;
    }

    if (target.matches('[data-youtube-playlist]')) {
      trackEvent('youtube_playlist_click', { channel: target.dataset.youtubePlaylist, language });
      return;
    }

    if (target.matches('[data-viber-link], [data-viber-footer]')) {
      trackEvent('viber_click', { location: target.matches('[data-viber-footer]') ? 'footer' : 'community', language });
      return;
    }

    if (target.closest('#beta-test')) {
      trackEvent('beta_test_click', { language });
      return;
    }

    if (target.getAttribute('href') === './help/') {
      const location = target.closest('.site-header') ? 'header' : (target.closest('.footer') ? 'footer' : 'help_strip');
      trackEvent('help_open', { location, language });
      return;
    }

    if (!target.matches('[data-open-trainer]') && target.href && target.href.startsWith(trainerUrl)) {
      trackEvent('trainer_open', { location: 'footer', device: window.innerWidth < 768 ? 'mobile' : 'desktop', language });
    }
  });

  setupChannelLink('uk');
  setupChannelLink('ru');
  loadLatestVideos();
  document.getElementById('year').textContent = new Date().getFullYear();
})();
