// ═══════════════════════════════════════════════════════════════
// IBM 5100 Timeline Gallery - JavaScript with Metadata Display
// ═══════════════════════════════════════════════════════════════

class TimelineGallery {
    constructor() {
        this.visualizations = [];
        this.filteredItems = [];
        this.currentFilter = {
            era: 'all',
            character: 'all',
            type: 'all',
            sort: 'newest',
            search: ''
        };
        this.currentLightboxIndex = -1;
        
        // Comparison mode
        this.compareMode = false;
        this.selectedItems = [];
        this.splitView = false;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadVisualizations();
        this.render();
    }

    bindEvents() {
        // Filter events
        document.getElementById('filter-era').addEventListener('change', (e) => {
            this.currentFilter.era = e.target.value;
            this.applyFilters();
        });

        document.getElementById('filter-character').addEventListener('change', (e) => {
            this.currentFilter.character = e.target.value;
            this.applyFilters();
        });

        document.getElementById('filter-type').addEventListener('change', (e) => {
            this.currentFilter.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('filter-sort').addEventListener('change', (e) => {
            this.currentFilter.sort = e.target.value;
            this.applyFilters();
        });

        // Search events
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            this.applyFilters();
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadVisualizations();
        });

        // Download All button
        document.getElementById('download-all-btn').addEventListener('click', () => {
            this.downloadAllAsZip();
        });

        // Cancel download button
        document.getElementById('cancel-download-btn').addEventListener('click', () => {
            this.cancelDownload();
        });

        // Compare mode button
        document.getElementById('compare-mode-btn').addEventListener('click', () => {
            this.toggleCompareMode();
        });

        // Comparison bar buttons
        document.getElementById('compare-selected-btn').addEventListener('click', () => {
            this.openComparison();
        });

        document.getElementById('clear-selection-btn').addEventListener('click', () => {
            this.clearSelection();
        });

        document.getElementById('exit-compare-mode-btn').addEventListener('click', () => {
            this.toggleCompareMode();
        });

        // Lightbox events
        document.getElementById('lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        document.getElementById('lightbox-prev').addEventListener('click', () => {
            this.prevLightbox();
        });

        document.getElementById('lightbox-next').addEventListener('click', () => {
            this.nextLightbox();
        });

        document.getElementById('lightbox-open').addEventListener('click', () => {
            this.openCurrentFile();
        });

        document.getElementById('lightbox-delete').addEventListener('click', () => {
            this.deleteCurrentItem();
        });

        // Comparison modal events
        document.getElementById('comparison-close').addEventListener('click', () => {
            this.closeComparison();
        });

        document.getElementById('close-comparison').addEventListener('click', () => {
            this.closeComparison();
        });

        document.getElementById('swap-images-btn').addEventListener('click', () => {
            this.swapComparisonImages();
        });

        document.getElementById('toggle-view-btn').addEventListener('click', () => {
            this.toggleSplitView();
        });

        document.getElementById('download-comparison').addEventListener('click', () => {
            this.downloadComparison();
        });

        // Comparison divider drag
        const divider = document.getElementById('comparison-divider');
        divider.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('comparison-modal').classList.contains('active')) {
                if (e.key === 'Escape') this.closeComparison();
                if (e.key === 'ArrowLeft') this.swapComparisonImages();
                if (e.key === 's') this.toggleSplitView();
            } else if (document.getElementById('lightbox').classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevLightbox();
                if (e.key === 'ArrowRight') this.nextLightbox();
                if (e.key === 'i') this.toggleMetadataPanel();
            } else if (this.compareMode) {
                if (e.key === 'Escape') this.toggleCompareMode();
                if (e.key === 'Enter') this.openComparison();
                if (e.key === 'c') this.clearSelection();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // Metadata Helper Methods
    // ═══════════════════════════════════════════════════════════════

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    formatGenerationTime(ms) {
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    }

    getMetadataHTML(item) {
        const fileSize = item.fileSize ? this.formatFileSize(item.fileSize) : 'Unknown';
        const genTime = item.generationTime ? this.formatGenerationTime(item.generationTime) : 'Unknown';
        const created = item.timestamp ? this.formatTimestamp(item.timestamp) : 'Unknown';
        
        return `
            <div class="metadata-panel">
                <div class="metadata-section">
                    <h4>AI Prompt</h4>
                    <div class="metadata-prompt">${item.prompt || 'No prompt available'}</div>
                </div>
                <div class="metadata-grid">
                    <div class="metadata-item">
                        <span class="metadata-label">File Size</span>
                        <span class="metadata-value">${fileSize}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Generation Time</span>
                        <span class="metadata-value">${genTime}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Created</span>
                        <span class="metadata-value">${created}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Type</span>
                        <span class="metadata-value">${item.type.toUpperCase()}</span>
                    </div>
                </div>
                ${item.model ? `
                <div class="metadata-section">
                    <h4>Model Info</h4>
                    <div class="metadata-model">${item.model}</div>
                </div>
                ` : ''}
            </div>
        `;
    }

    // ═══════════════════════════════════════════════════════════════
    // Data Loading
    // ═══════════════════════════════════════════════════════════════

    loadVisualizations() {
        this.showLoading(true);
        
        const stored = localStorage.getItem('ibm5100_visualizations');
        if (stored) {
            this.visualizations = JSON.parse(stored);
        } else {
            this.visualizations = this.getSampleData();
        }
        
        this.applyFilters();
        this.showLoading(false);
    }

    getSampleData() {
        return [
            {
                id: 1,
                filename: '2020_cientifico_2025_20250714_120000.png',
                path: '../visualizations/2020_cientifico_2025_20250714_120000.png',
                era: '2020',
                character: 'cientifico',
                year: 2025,
                type: 'image',
                timestamp: '2025-07-14T12:00:00',
                prompt: 'Modern scientist with holographic displays',
                fileSize: 2457600,
                generationTime: 4500,
                model: 'stable-diffusion-3-5-large'
            },
            {
                id: 2,
                filename: '1980_hacker_1985_20250714_130000.png',
                path: '../visualizations/1980_hacker_1985_20250714_130000.png',
                era: '1980',
                character: 'hacker',
                year: 1985,
                type: 'image',
                timestamp: '2025-07-14T13:00:00',
                prompt: 'Hacker in neon-lit room with retro computers',
                fileSize: 1843200,
                generationTime: 3800,
                model: 'stable-diffusion-3-5-large'
            },
            {
                id: 3,
                filename: 'video_2030_viajero_2035_20250714_140000.mp4',
                path: '../visualizations/video_2030_viajero_2035_20250714_140000.mp4',
                era: '2030',
                character: 'viajero',
                year: 2035,
                type: 'video',
                timestamp: '2025-07-14T14:00:00',
                prompt: 'Time traveler with futuristic gadget',
                fileSize: 15728640,
                generationTime: 12000,
                model: 'cosmos-transfer1'
            }
        ];
    }

    applyFilters() {
        let filtered = [...this.visualizations];

        if (this.currentFilter.era !== 'all') {
            filtered = filtered.filter(item => item.era === this.currentFilter.era);
        }

        if (this.currentFilter.character !== 'all') {
            filtered = filtered.filter(item => item.character === this.currentFilter.character);
        }

        if (this.currentFilter.type !== 'all') {
            const typeMap = {
                'image': ['png', 'jpg', 'jpeg'],
                'video': ['mp4', 'avi', 'mov'],
                'live': ['live']
            };
            const extensions = typeMap[this.currentFilter.type] || [];
            filtered = filtered.filter(item => {
                return extensions.some(ext => item.filename.toLowerCase().includes(ext));
            });
        }

        if (this.currentFilter.search) {
            const search = this.currentFilter.search;
            filtered = filtered.filter(item => 
                item.filename.toLowerCase().includes(search) ||
                item.prompt.toLowerCase().includes(search) ||
                item.era.toLowerCase().includes(search) ||
                item.character.toLowerCase().includes(search) ||
                item.year.toString().includes(search)
            );
        }

        filtered.sort((a, b) => {
            switch (this.currentFilter.sort) {
                case 'newest':
                    return new Date(b.timestamp) - new Date(a.timestamp);
                case 'oldest':
                    return new Date(a.timestamp) - new Date(b.timestamp);
                case 'year-asc':
                    return a.year - b.year;
                case 'year-desc':
                    return b.year - a.year;
                default:
                    return 0;
            }
        });

        this.filteredItems = filtered;
        this.render();
    }

    render() {
        const grid = document.getElementById('gallery-grid');
        const emptyState = document.getElementById('empty-state');
        const stats = document.getElementById('gallery-stats');

        stats.textContent = `${this.filteredItems.length} visualization${this.filteredItems.length !== 1 ? 's' : ''}`;

        grid.innerHTML = '';

        if (this.filteredItems.length === 0) {
            grid.appendChild(emptyState);
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        this.filteredItems.forEach((item, index) => {
            const element = this.createGalleryItem(item, index);
            grid.appendChild(element);
        });
    }

    createGalleryItem(item, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-item-wrapper';
        wrapper.setAttribute('data-index', index);

        if (this.compareMode) {
            wrapper.classList.add('selectable');
            const isSelected = this.selectedItems.some(s => s.id === item.id);
            if (isSelected) {
                wrapper.classList.add('selected');
            }
        }

        const isVideo = item.type === 'video' || item.filename.endsWith('.mp4');
        const isLive = item.filename.startsWith('live_');

        let mediaContent;
        if (isVideo) {
            mediaContent = `<div class="gallery-item-video"></div>`;
        } else {
            mediaContent = `<img class="gallery-item-image" src="${item.path}" alt="${item.prompt}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%2300ff00%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22%3EImage not found%3C/text%3E%3C/svg%3E'">`;
        }

        let checkboxHTML = '';
        if (this.compareMode) {
            const isChecked = this.selectedItems.some(s => s.id === item.id);
            checkboxHTML = `<div class="selection-checkbox ${isChecked ? 'checked' : ''}" onclick="event.stopPropagation(); gallery.toggleItemSelection(${index})"></div>`;
        }

        const fileSize = item.fileSize ? this.formatFileSize(item.fileSize) : '';
        const genTime = item.generationTime ? this.formatGenerationTime(item.generationTime) : '';

        wrapper.innerHTML = `
            <div class="gallery-item" onclick="gallery.handleItemClick(${index})">
                ${checkboxHTML}
                ${mediaContent}
                <span class="gallery-item-type">${isVideo ? 'VIDEO' : isLive ? 'LIVE' : 'IMAGE'}</span>
                <div class="gallery-item-info">
                    <div class="gallery-item-title">${item.prompt}</div>
                    <div class="gallery-item-meta">
                        <span class="gallery-item-tag">${item.era}</span>
                        <span class="gallery-item-tag">${item.character}</span>
                        <span>${item.year}</span>
                    </div>
                    <div class="gallery-item-metadata">
                        ${fileSize ? `<span class="metadata-badge">${fileSize}</span>` : ''}
                        ${genTime ? `<span class="metadata-badge">${genTime}</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        return wrapper;
    }

    handleItemClick(index) {
        if (this.compareMode) {
            this.toggleItemSelection(index);
        } else {
            this.openLightbox(index);
        }
    }

    toggleItemSelection(index) {
        const item = this.filteredItems[index];
        const existingIndex = this.selectedItems.findIndex(s => s.id === item.id);

        if (existingIndex >= 0) {
            this.selectedItems.splice(existingIndex, 1);
        } else {
            if (this.selectedItems.length >= 2) {
                this.selectedItems.shift();
            }
            this.selectedItems.push(item);
        }

        this.updateComparisonBar();
        this.render();
    }

    updateComparisonBar() {
        const count = document.getElementById('comparison-count');
        const compareBtn = document.getElementById('compare-selected-btn');
        
        count.textContent = `${this.selectedItems.length} selected`;
        compareBtn.disabled = this.selectedItems.length !== 2;
    }

    clearSelection() {
        this.selectedItems = [];
        this.updateComparisonBar();
        this.render();
    }

    toggleCompareMode() {
        this.compareMode = !this.compareMode;
        const bar = document.getElementById('comparison-bar');
        const btn = document.getElementById('compare-mode-btn');
        
        if (this.compareMode) {
            bar.style.display = 'flex';
            btn.textContent = '✕ EXIT COMPARE';
            btn.classList.add('btn-danger');
            btn.classList.remove('btn-secondary');
            this.clearSelection();
        } else {
            bar.style.display = 'none';
            btn.textContent = '⇄ COMPARE';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-secondary');
            this.selectedItems = [];
        }
        
        this.render();
    }

    openComparison() {
        if (this.selectedItems.length !== 2) return;

        const modal = document.getElementById('comparison-modal');
        const leftImg = document.getElementById('comparison-left-img');
        const rightImg = document.getElementById('comparison-right-img');
        const leftLabel = document.getElementById('comparison-left-label');
        const rightLabel = document.getElementById('comparison-right-label');
        const leftInfo = document.getElementById('comparison-left-info');
        const rightInfo = document.getElementById('comparison-right-info');
        const yearDiff = document.getElementById('comparison-year-diff');

        const [left, right] = this.selectedItems;

        leftImg.src = left.path;
        rightImg.src = right.path;

        const leftYear = left.year;
        const rightYear = right.year;

        leftLabel.textContent = leftYear < rightYear ? 'Before' : 'After';
        rightLabel.textContent = leftYear < rightYear ? 'After' : 'Before';

        leftInfo.innerHTML = `
            <div class="year">${leftYear}</div>
            <div class="prompt">${left.prompt}</div>
            <div class="meta">${left.era} | ${left.character}</div>
            <div class="metadata-mini">
                ${left.fileSize ? `<span>${this.formatFileSize(left.fileSize)}</span>` : ''}
                ${left.generationTime ? `<span>${this.formatGenerationTime(left.generationTime)}</span>` : ''}
            </div>
        `;

        rightInfo.innerHTML = `
            <div class="year">${rightYear}</div>
            <div class="prompt">${right.prompt}</div>
            <div class="meta">${right.era} | ${right.character}</div>
            <div class="metadata-mini">
                ${right.fileSize ? `<span>${this.formatFileSize(right.fileSize)}</span>` : ''}
                ${right.generationTime ? `<span>${this.formatGenerationTime(right.generationTime)}</span>` : ''}
            </div>
        `;

        const diff = Math.abs(rightYear - leftYear);
        yearDiff.textContent = `${diff} year${diff !== 1 ? 's' : ''} apart`;

        modal.classList.add('active');
    }

    closeComparison() {
        const modal = document.getElementById('comparison-modal');
        modal.classList.remove('active');
        modal.classList.remove('split-view');
    }

    swapComparisonImages() {
        const leftImg = document.getElementById('comparison-left-img');
        const rightImg = document.getElementById('comparison-right-img');
        const leftLabel = document.getElementById('comparison-left-label');
        const rightLabel = document.getElementById('comparison-right-label');
        const leftInfo = document.getElementById('comparison-left-info');
        const rightInfo = document.getElementById('comparison-right-info');

        const tempSrc = leftImg.src;
        const tempLabel = leftLabel.textContent;
        const tempInfo = leftInfo.innerHTML;

        leftImg.src = rightImg.src;
        leftLabel.textContent = rightLabel.textContent;
        leftInfo.innerHTML = rightInfo.innerHTML;

        rightImg.src = tempSrc;
        rightLabel.textContent = tempLabel;
        rightInfo.innerHTML = tempInfo;
    }

    toggleSplitView() {
        const modal = document.getElementById('comparison-modal');
        const btn = document.getElementById('toggle-view-btn');
        
        this.splitView = !this.splitView;
        
        if (this.splitView) {
            modal.classList.add('split-view');
            btn.textContent = '↔ SIDE BY SIDE';
        } else {
            modal.classList.remove('split-view');
            btn.textContent = '◉ SPLIT VIEW';
        }
    }

    startDrag(e) {
        this.isDragging = true;
        e.preventDefault();
    }

    onDrag(e) {
        if (!this.isDragging) return;

        const container = document.getElementById('comparison-container');
        const rect = container.getBoundingClientRect();
        
        if (this.splitView) {
            const y = e.clientY - rect.top;
            const percentage = (y / rect.height) * 100;
            container.style.setProperty('--split-position', `${percentage}%`);
        } else {
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            container.style.setProperty('--split-position', `${percentage}%`);
        }
    }

    endDrag() {
        this.isDragging = false;
    }

    downloadComparison() {
        const leftImg = document.getElementById('comparison-left-img');
        const rightImg = document.getElementById('comparison-right-img');
        
        const downloadLink = document.createElement('a');
        downloadLink.href = leftImg.src;
        downloadLink.download = 'comparison_before.png';
        downloadLink.click();

        setTimeout(() => {
            downloadLink.href = rightImg.src;
            downloadLink.download = 'comparison_after.png';
            downloadLink.click();
        }, 500);
    }

    // ═══════════════════════════════════════════════════════════════
    // Lightbox with Metadata Panel
    // ═══════════════════════════════════════════════════════════════

    openLightbox(index) {
        this.currentLightboxIndex = index;
        const item = this.filteredItems[index];
        const lightbox = document.getElementById('lightbox');
        const image = document.getElementById('lightbox-image');
        const video = document.getElementById('lightbox-video');
        const title = document.getElementById('lightbox-title');
        const meta = document.getElementById('lightbox-meta');
        const metadataPanel = document.getElementById('lightbox-metadata');

        const isVideo = item.type === 'video' || item.filename.endsWith('.mp4');

        if (isVideo) {
            image.style.display = 'none';
            video.style.display = 'block';
            video.src = item.path;
        } else {
            video.style.display = 'none';
            image.style.display = 'block';
            image.src = item.path;
        }

        title.textContent = item.prompt;
        meta.textContent = `${item.era} | ${item.character} | ${item.year} | ${new Date(item.timestamp).toLocaleString()}`;

        // Update metadata panel
        if (metadataPanel) {
            metadataPanel.innerHTML = this.getMetadataHTML(item);
        }

        lightbox.classList.add('active');
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        const video = document.getElementById('lightbox-video');
        
        lightbox.classList.remove('active');
        video.pause();
        video.src = '';
    }

    prevLightbox() {
        if (this.currentLightboxIndex > 0) {
            this.openLightbox(this.currentLightboxIndex - 1);
        }
    }

    nextLightbox() {
        if (this.currentLightboxIndex < this.filteredItems.length - 1) {
            this.openLightbox(this.currentLightboxIndex + 1);
        }
    }

    openCurrentFile() {
        const item = this.filteredItems[this.currentLightboxIndex];
        if (item) {
            window.open(item.path, '_blank');
        }
    }

    deleteCurrentItem() {
        const item = this.filteredItems[this.currentLightboxIndex];
        if (item && confirm(`Delete "${item.filename}"?`)) {
            this.visualizations = this.visualizations.filter(v => v.id !== item.id);
            localStorage.setItem('ibm5100_visualizations', JSON.stringify(this.visualizations));
            this.closeLightbox();
            this.applyFilters();
        }
    }

    toggleMetadataPanel() {
        const metadataPanel = document.getElementById('lightbox-metadata');
        if (metadataPanel) {
            metadataPanel.classList.toggle('expanded');
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    addVisualization(data) {
        this.visualizations.unshift(data);
        localStorage.setItem('ibm5100_visualizations', JSON.stringify(this.visualizations));
        this.applyFilters();
    }
}

let gallery;
document.addEventListener('DOMContentLoaded', () => {
    gallery = new TimelineGallery();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelineGallery;
}
