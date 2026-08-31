# MOYAMOVA Landing

Static landing page for **moyamova.com** presenting the MOYAMOVA web trainer at **https://moyamova.online/** and the RU/UA YouTube channels.

## Deploy

No build step is required. Publish the repository root with GitHub Pages, Cloudflare Pages, Netlify, or any static hosting.

## YouTube setup

Open `assets/js/config.js` and add both channel IDs and (optionally) explicit channel URLs:

```js
channels: {
  uk: { channelId: 'UC...', channelUrl: 'https://youtube.com/@...' },
  ru: { channelId: 'UC...', channelUrl: 'https://youtube.com/@...' }
}
```

When a valid channel ID is set, the page embeds that channel's **Uploads playlist** automatically. This does not require a YouTube API key.

## Trainer popup

Desktop: opens `moyamova.online` in a centered ~430 px wide app window.
Mobile: opens the trainer in a normal new browser tab because mobile browsers do not reliably support custom popup dimensions.

## Structure

- `index.html` — main landing page
- `assets/css/main.css` — responsive design
- `assets/js/app.js` — popup, language switcher, YouTube embeds
- `assets/js/config.js` — external links/channel IDs
- `assets/img/` — MOYAMOVA logo and real trainer screenshots
- `legal/` — privacy, terms, impressum inherited from the previous project

## Before production

Review and replace the inherited legal text where required. It was carried over from the old landing project and should not be treated as final legal advice.


## YouTube

Последние 3 ролика каждого канала хранятся в `assets/data/youtube.json`. GitHub Action `.github/workflows/update-youtube.yml` обновляет файл из официальных YouTube RSS-фидов при push, вручную и каждые 6 часов. API-ключ не нужен. Карточки открывают ролики непосредственно на YouTube, поэтому ограничения iframe/embed больше не ломают блок.


## v1.5: playlists, schedule, help, Viber

- The landing shows the current publication schedule for RU/UA channels.
- `scripts/update_youtube.py` now refreshes the latest videos **and public playlist cards with covers** into `assets/data/youtube.json`.
- `help/index.html` contains iOS/iPadOS and Android home-screen installation instructions and a prepared section for the full trainer manual.
- Set `viberUrl` in `assets/js/config.js` when the public Viber invite link is available. The Viber block and footer link stay hidden until that value is present.
