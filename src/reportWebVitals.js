const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      try {
        // Measure and report Core Web Vitals
        getCLS(onPerfEntry); // Cumulative Layout Shift
        getFID(onPerfEntry); // First Input Delay
        getFCP(onPerfEntry); // First Contentful Paint
        getLCP(onPerfEntry); // Largest Contentful Paint
        getTTFB(onPerfEntry); // Time to First Byte
      } catch (error) {
        console.error('Error reporting web vitals:', error);
      }
    }).catch((error) => {
      console.error('Failed to load web-vitals:', error);
    });
  } else {
    console.warn('onPerfEntry is not a function. Web vitals will not be reported.');
  }
};

export default reportWebVitals;
