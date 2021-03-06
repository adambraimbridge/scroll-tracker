const throttle = require('lodash/throttle');
const isEqual = require('lodash/isEqual');

function getPercentageViewable (element) {
  const rect = element.getBoundingClientRect();
  const percentage = (100 / rect.height) * (window.innerHeight - rect.top);
  return percentage === Infinity ? 0 : percentage;

}

module.exports = (function() {
  let _scrollHandler;
  let _currentBuckets;

  class ScrollTracker {
    constructor({element, buckets, callback, delay}) {
      this.rootEl = element;
      this.rootEl.dataset.scrollTracking = true;
      _scrollHandler = throttle(() => {
        const percentage = getPercentageViewable(element);
        const currentBuckets = buckets.filter(bucket => bucket <= percentage);
        if (!isEqual(currentBuckets, _currentBuckets)) {
          _currentBuckets = currentBuckets;
          callback(currentBuckets);
        }
      }, delay);
      document.addEventListener('scroll', _scrollHandler);
    }

    destroy () {
      document.removeEventListener('scroll', _scrollHandler);
      delete this.rootEl.dataset.scrollTracking;
      delete this.rootEl;
    }
  };

  return ScrollTracker;
}());
