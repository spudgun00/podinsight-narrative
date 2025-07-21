const IntelligenceBrief = {
    init: function(container) {
        this.container = container;
        this.bindEvents();
    },
    
    bindEvents: function() {
        const toggleBtn = this.container.querySelector('[data-action="toggleBrief"]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleBrief());
        }
        
        // Main Download button
        const downloadBtn = this.container.querySelector('[data-action="downloadBrief"]');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadPDF());
        }
        
        // Slack button
        const slackBtn = this.container.querySelector('.brief-action-btn[title="Share via Slack"]');
        if (slackBtn) {
            slackBtn.addEventListener('click', () => this.shareViaSlack());
        }
        
        // Email Brief button
        const emailBtn = this.container.querySelector('.brief-action-btn[title="Email Brief"]');
        if (emailBtn) {
            emailBtn.addEventListener('click', () => this.emailBrief());
        }
    },
    
    toggleBrief: function() {
        const collapsed = this.container.querySelector('#briefCollapsed');
        const expanded = this.container.querySelector('#briefExpanded');
        const btn = this.container.querySelector('#expandBriefBtn');
        const btnText = this.container.querySelector('#expandText');
        
        if (expanded.style.display === 'none') {
            collapsed.style.display = 'none';
            expanded.style.display = 'block';
            btn.classList.add('expanded');
            btnText.textContent = 'Collapse Analysis';
        } else {
            collapsed.style.display = 'block';
            expanded.style.display = 'none';
            btn.classList.remove('expanded');
            btnText.textContent = 'View Full Analysis';
        }
    },
    
    downloadPDF: function() {
        // Open the weekly brief HTML in a new tab
        window.open('pdf/weekly-brief.html', '_blank');
    },
    
    emailBrief: function() {
        // Get current date for the subject line
        const today = new Date();
        const weekNum = Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear();
        
        // Email parameters
        const subject = `VCPulse Weekly Intelligence Brief - Week ${weekNum}, ${month} ${year}`;
        
        const body = `Hi team,

Please find this week's VCPulse Intelligence Brief below.

Key Highlights:
• AI infrastructure dominates with Series A at 20-30x ARR
• DePIN showing 190% momentum (contrarian signal)
• Developer tools consolidation emerging as blindspot

View the full brief here: ${window.location.origin}/demo/pdf/weekly-brief.html

Best regards,
VCPulse Intelligence Team

--
Synthesized from 1,498 hours across 47 VC podcasts
© ${year} VCPulse • Proprietary & Confidential`;

        // Create mailto link
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.location.href = mailtoLink;
    },
    
    shareViaSlack: function() {
        // Get current date for the message
        const today = new Date();
        const weekNum = Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const month = monthNames[today.getMonth()];
        
        // Create Slack message
        const message = `📊 *VCPulse Weekly Intelligence Brief - Week ${weekNum}, ${month}*\n\n` +
                       `Key highlights:\n` +
                       `• AI infrastructure dominates with Series A at 20-30x ARR\n` +
                       `• DePIN showing 190% momentum (contrarian signal)\n` +
                       `• Developer tools consolidation emerging as blindspot\n\n` +
                       `View full brief: ${window.location.origin}/demo/pdf/weekly-brief.html`;
        
        // Copy to clipboard and show notification
        navigator.clipboard.writeText(message).then(() => {
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'slack-notification';
            notification.textContent = 'Brief copied to clipboard - paste in Slack!';
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 10);
            
            // Hide and remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    }
};

window.IntelligenceBrief = IntelligenceBrief;