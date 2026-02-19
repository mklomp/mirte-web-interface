export default defineNuxtPlugin((nuxtApp) => {

  window._paq = window._paq || [];

  window._paq.push(['disableCookies']);
  window._paq.push(['disableBrowserFeatureDetection']);

  const matomoUrl = "https://stats.mirte.org/";
  const script = document.createElement('script');
  script.async = true;
  script.src = matomoUrl + "matomo.js";
  document.head.appendChild(script);

  window._paq.push(['setTrackerUrl', matomoUrl + 'matomo.php']);
  window._paq.push(['setSiteId', 1]);

  nuxtApp.$router.afterEach((to) => {
      // Do not include paths that ends with a / due to
      // hoe Vue works. Vue creates dummy folders that
      // will actually forward to the single page setup.
      // Therefore, when refeshing, it will first treat
      // it as a folder and add the /, which redirects
      // to the single page. We only want to track the
      // single page visits.
      if (!to.path.endsWith("/")) {
        const originalReferrer = sessionStorage.getItem('originalReferrer');
        if (originalReferrer) {
          // Override Matomo referrer
          window._paq.push(['setReferrerUrl', originalReferrer]);
          sessionStorage.removeItem('originalReferrer');
        }
        window._paq.push(['setCustomUrl', to.fullPath]);
        window._paq.push(['setDocumentTitle', document.title]);
        window._paq.push(['trackPageView']);
        window._paq.push(['enableLinkTracking']);
      }   
  });



});

