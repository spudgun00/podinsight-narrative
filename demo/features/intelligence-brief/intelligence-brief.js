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
        
        // Discord button
        const discordBtn = this.container.querySelector('.brief-action-btn[title="Share via Discord"]');
        if (discordBtn) {
            discordBtn.addEventListener('click', () => this.shareViaDiscord());
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
        const subject = `Crypto Intelligence Brief - Week ${weekNum}, ${month} ${year}`;
        
        const body = `Hi team,

Please find this week's Crypto Intelligence Brief below.

Key Highlights:
• RWA tokenization reaching escape velocity
• ETH restaking offering sustainable 15-25% yields
• Bitcoin L2s finally gaining real traction
• Memecoin exhaustion driving quality rotation

View the full brief here: ${window.location.origin}/demo/pdf/weekly-brief.html

Best regards,
Synthea.ai Intelligence Team

--
Synthesized from 876 hours across 50+ crypto podcasts
© ${year} Synthea.ai • Proprietary & Confidential`;

        // Create mailto link
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.location.href = mailtoLink;
    },
    
    shareViaDiscord: function() {
        // Get current date for the message
        const today = new Date();
        const weekNum = Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const month = monthNames[today.getMonth()];
        
        // Create Discord message
        const message = `📊 *Crypto Intelligence Brief - Week ${weekNum}, ${month}*\n\n` +
                       `Key narratives:\n` +
                       `• RWAs dominating with institutional adoption\n` +
                       `• Restaking yields sustainable at 15-25%\n` +
                       `• Bitcoin L2s crossing $2B TVL\n` +
                       `• Memecoins dying, quality rising\n\n` +
                       `View full brief: ${window.location.origin}/demo/pdf/weekly-brief.html`;
        
        // Copy to clipboard and show notification
        navigator.clipboard.writeText(message).then(() => {
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'discord-notification';
            notification.textContent = 'Brief copied to clipboard - paste in Discord!';
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