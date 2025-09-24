// LeafByte Content Script
// Displays real-time emission overlay and monitors page changes

(function() {
  'use strict';
  
  let emissionBadge = null;
  let currentEmissions = 0;
  let resourceBreakdown = {};
  let isCalculating = false;
  
  // Initialize content script
  function init() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createEmissionBadge);
    } else {
      createEmissionBadge();
    }
    
    // Monitor for dynamic content changes
    observePageChanges();
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(handleMessage);
  }
  
  // Create the emission display badge
  function createEmissionBadge() {
    if (emissionBadge || document.getElementById('leafbyte-badge')) {
      return; // Badge already exists
    }
    
    emissionBadge = document.createElement('div');
    emissionBadge.id = 'leafbyte-badge';
    emissionBadge.className = 'leafbyte-badge';
    
    // Badge structure
    emissionBadge.innerHTML = `
      <div class="leafbyte-badge-content">
        <div class="leafbyte-icon">🌱</div>
        <div class="leafbyte-emissions">
          <span class="leafbyte-value">0.0</span>
          <span class="leafbyte-unit">g CO₂e</span>
        </div>
      </div>
      <div class="leafbyte-tooltip" id="leafbyte-tooltip">
        <div class="leafbyte-tooltip-header">
          <strong>Carbon Emissions Breakdown</strong>
        </div>
        <div class="leafbyte-tooltip-content">
          <div class="leafbyte-breakdown">
            <div class="leafbyte-breakdown-item">
              <span class="leafbyte-category">Images:</span>
              <span class="leafbyte-percentage">0%</span>
            </div>
            <div class="leafbyte-breakdown-item">
              <span class="leafbyte-category">Scripts:</span>
              <span class="leafbyte-percentage">0%</span>
            </div>
            <div class="leafbyte-breakdown-item">
              <span class="leafbyte-category">Styles:</span>
              <span class="leafbyte-percentage">0%</span>
            </div>
            <div class="leafbyte-breakdown-item">
              <span class="leafbyte-category">HTML:</span>
              <span class="leafbyte-percentage">0%</span>
            </div>
            <div class="leafbyte-breakdown-item">
              <span class="leafbyte-category">Other:</span>
              <span class="leafbyte-percentage">0%</span>
            </div>
          </div>
          <div class="leafbyte-tips">
            <div class="leafbyte-tip">💡 Loading...</div>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    emissionBadge.addEventListener('mouseenter', showTooltip);
    emissionBadge.addEventListener('mouseleave', hideTooltip);
    emissionBadge.addEventListener('click', toggleTooltip);
    
    // Append to body
    document.body.appendChild(emissionBadge);
    
    // Calculate initial emissions
    setTimeout(calculateEmissions, 1000);
  }
  
  // Calculate page emissions using Performance API
  function calculateEmissions() {
    if (isCalculating) return;
    isCalculating = true;
    
    try {
      const BYTES_TO_CO2_FACTOR = 0.00000285; // grams CO2e per byte
      
      // Get performance entries
      const resources = performance.getEntriesByType('resource');
      const navigation = performance.getEntriesByType('navigation')[0];
      
      let totalBytes = 0;
      const breakdown = {
        html: 0,
        css: 0,
        javascript: 0,
        images: 0,
        videos: 0,
        fonts: 0,
        other: 0
      };
      
      // Process resource entries
      resources.forEach(resource => {
        const size = resource.transferSize || resource.encodedBodySize || 0;
        totalBytes += size;
        
        // Categorize resources
        const url = resource.name.toLowerCase();
        const initiator = resource.initiatorType;
        
        if (url.match(/\.(css)$/)) {
          breakdown.css += size;
        } else if (url.match(/\.(js|jsx|ts|tsx)$/) || initiator === 'script') {
          breakdown.javascript += size;
        } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)$/) || initiator === 'img') {
          breakdown.images += size;
        } else if (url.match(/\.(mp4|webm|avi|mov|wmv|flv)$/) || initiator === 'video') {
          breakdown.videos += size;
        } else if (url.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
          breakdown.fonts += size;
        } else if (initiator === 'xmlhttprequest' || initiator === 'fetch') {
          breakdown.other += size;
        } else {
          breakdown.html += size;
        }
      });
      
      // Add navigation document size
      if (navigation) {
        const navSize = navigation.transferSize || navigation.encodedBodySize || 0;
        totalBytes += navSize;
        breakdown.html += navSize;
      }
      
      // Calculate emissions
      currentEmissions = totalBytes * BYTES_TO_CO2_FACTOR;
      resourceBreakdown = breakdown;
      
      // Update display
      updateBadgeDisplay();
      
      // Send data to background script
      chrome.runtime.sendMessage({
        type: 'PAGE_EMISSIONS',
        data: {
          url: window.location.href,
          domain: window.location.hostname,
          totalBytes,
          emissions: currentEmissions,
          resourceBreakdown: breakdown,
          timestamp: Date.now()
        }
      });
      
    } catch (error) {
      console.error('LeafByte: Error calculating emissions:', error);
    } finally {
      isCalculating = false;
    }
  }
  
  // Update badge display with current emissions
  function updateBadgeDisplay() {
    if (!emissionBadge) return;
    
    const valueElement = emissionBadge.querySelector('.leafbyte-value');
    const badgeContent = emissionBadge.querySelector('.leafbyte-badge-content');
    
    if (valueElement) {
      valueElement.textContent = currentEmissions.toFixed(1);
    }
    
    // Update badge color based on emission level
    if (badgeContent) {
      badgeContent.className = 'leafbyte-badge-content';
      if (currentEmissions < 0.5) {
        badgeContent.classList.add('low-emission');
      } else if (currentEmissions < 1.0) {
        badgeContent.classList.add('medium-emission');
      } else {
        badgeContent.classList.add('high-emission');
      }
    }
    
    // Update tooltip breakdown
    updateTooltipBreakdown();
  }
  
  // Update tooltip with resource breakdown
  function updateTooltipBreakdown() {
    const tooltip = document.getElementById('leafbyte-tooltip');
    if (!tooltip) return;
    
    const totalBytes = Object.values(resourceBreakdown).reduce((sum, bytes) => sum + bytes, 0);
    
    if (totalBytes === 0) return;
    
    // Calculate percentages
    const percentages = {
      images: ((resourceBreakdown.images / totalBytes) * 100).toFixed(1),
      javascript: ((resourceBreakdown.javascript / totalBytes) * 100).toFixed(1),
      css: ((resourceBreakdown.css / totalBytes) * 100).toFixed(1),
      html: ((resourceBreakdown.html / totalBytes) * 100).toFixed(1),
      other: (((resourceBreakdown.videos + resourceBreakdown.fonts + resourceBreakdown.other) / totalBytes) * 100).toFixed(1)
    };
    
    // Update breakdown display
    const breakdownItems = tooltip.querySelectorAll('.leafbyte-breakdown-item');
    if (breakdownItems.length >= 5) {
      breakdownItems[0].querySelector('.leafbyte-percentage').textContent = percentages.images + '%';
      breakdownItems[1].querySelector('.leafbyte-percentage').textContent = percentages.javascript + '%';
      breakdownItems[2].querySelector('.leafbyte-percentage').textContent = percentages.css + '%';
      breakdownItems[3].querySelector('.leafbyte-percentage').textContent = percentages.html + '%';
      breakdownItems[4].querySelector('.leafbyte-percentage').textContent = percentages.other + '%';
    }
    
    // Generate eco-tips
    updateEcoTips(percentages);
  }
  
  // Generate and display eco-tips
  function updateEcoTips(percentages) {
    const tipElement = emissionBadge.querySelector('.leafbyte-tip');
    if (!tipElement) return;
    
    const tips = [];
    
    if (parseFloat(percentages.images) > 40) {
      tips.push('💡 Consider compressing images to reduce emissions');
    }
    if (parseFloat(percentages.javascript) > 30) {
      tips.push('💡 Heavy JavaScript detected - consider code splitting');
    }
    if (currentEmissions > 1.0) {
      tips.push('💡 This page has high emissions - try enabling an ad blocker');
    }
    if (parseFloat(percentages.other) > 20) {
      tips.push('💡 Consider reducing third-party resources');
    }
    
    if (tips.length === 0) {
      tips.push('✅ This page has relatively low emissions!');
    }
    
    tipElement.textContent = tips[Math.floor(Math.random() * tips.length)];
  }
  
  // Show tooltip
  function showTooltip() {
    const tooltip = document.getElementById('leafbyte-tooltip');
    if (tooltip) {
      tooltip.style.display = 'block';
    }
  }
  
  // Hide tooltip
  function hideTooltip() {
    const tooltip = document.getElementById('leafbyte-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }
  
  // Toggle tooltip (for mobile)
  function toggleTooltip() {
    const tooltip = document.getElementById('leafbyte-tooltip');
    if (tooltip) {
      tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
    }
  }
  
  // Observe page changes for dynamic content
  function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldRecalculate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check for new images, scripts, or other resources
              if (node.tagName === 'IMG' || node.tagName === 'SCRIPT' || 
                  node.tagName === 'LINK' || node.tagName === 'VIDEO') {
                shouldRecalculate = true;
              }
              
              // Check for new resources in added subtrees
              if (node.querySelector && 
                  node.querySelector('img, script, link[rel="stylesheet"], video')) {
                shouldRecalculate = true;
              }
            }
          });
        }
      });
      
      if (shouldRecalculate) {
        // Debounce recalculation
        clearTimeout(window.leafbyteRecalcTimer);
        window.leafbyteRecalcTimer = setTimeout(calculateEmissions, 2000);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Handle messages from background script
  function handleMessage(message, sender, sendResponse) {
    if (message.type === 'UPDATE_EMISSIONS') {
      currentEmissions = message.emissions;
      resourceBreakdown = message.breakdown || {};
      updateBadgeDisplay();
    } else if (message.type === 'RECALCULATE_EMISSIONS') {
      calculateEmissions();
    }
  }
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (emissionBadge && emissionBadge.parentNode) {
      emissionBadge.parentNode.removeChild(emissionBadge);
    }
  });
  
  // Initialize when script loads
  init();
  
})();