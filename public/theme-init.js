/* Applies the reader's saved theme before the page first paints. The app sets
   the same attribute once React mounts (src/lib/preferences.ts), but by then a
   reader who chose the theme opposite to their system's had already seen a
   flash of the other one. Plain ES5, loaded synchronously from <head>; an
   external file because the site's policy allows no inline script. Storage
   can throw outright (Safari Lockdown mode), so the read is guarded. */
(function () {
  try {
    var theme = window.localStorage.getItem('theme')
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme
    // oxlint-disable-next-line no-unused-vars -- ES5 has no bare catch
  } catch (error) {
    /* No stored preference is readable: the system theme stands. */
  }
})()
