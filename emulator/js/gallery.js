// ═══════════════════════════════════════════════════════════════
// IBM 5100 Timeline Gallery - JavaScript
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

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox').classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevLightbox();
                if (e.key === 'ArrowRight') this.nextLightbox();
            }
        });
    }

    loadVisualizations() {
        this.showLoading(true);
        
        // In a real implementation, this would fetch from the visualizations directory
        // For now, we'll simulate loading from localStorage or scan the directory
        const stored = localStorage.getItem('ibm5100_visualizations');
        if (stored) {
            this.visualizations = JSON.parse(stored);
        } else {
            // Sample data for demonstration
            this.visualizations = this.getSampleData();
        }
        
        this.applyFilters();
        this.showLoading(false);
    }

    getSampleData() {
        // This would be replaced with actual directory scanning
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
                prompt: 'Modern scientist with holographic displays'
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
                prompt: 'Hacker in neon-lit room with retro computers'
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
                prompt: 'Time traveler with futuristic gadget'
            }
        ];
    }

    applyFilters() {
        let filtered = [...this.visualizations];

        // Apply era filter
        if (this.currentFilter.era !== 'all') {
            filtered = filtered.filter(item => item.era === this.currentFilter.era);
        }

        // Apply character filter
        if (this.currentFilter.character !== 'all') {
            filtered = filtered.filter(item => item.character === this.currentFilter.character);
        }

        // Apply type filter
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

        // Apply search filter
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

        // Apply sort
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

        // Update stats
        stats.textContent = `${this.filteredItems.length} visualization${this.filteredItems.length !== 1 ? 's' : ''}`;

        // Clear grid
        grid.innerHTML = '';

        if (this.filteredItems.length === 0) {
            grid.appendChild(emptyState);
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        // Render items
        this.filteredItems.forEach((item, index) => {
            const element = this.createGalleryItem(item, index);
            grid.appendChild(element);
        });
    }

    createGalleryItem(item, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-item-wrapper';
        wrapper.setAttribute('data-index', index);

        const isVideo = item.type === 'video' || item.filename.endsWith('.mp4');
        const isLive = item.filename.startsWith('live_');

        let mediaContent;
        if (isVideo) {
            mediaContent = `<div class="gallery-item-video"></div>`;
        } else {
            mediaContent = `<img class="gallery-item-image" src="${item.path}" alt="${item.prompt}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%231a1a1a%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%2300ff00%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22%3EImage not found%3C/text%3E%3C/svg%3E'">`;
        }

        wrapper.innerHTML = `
            <div class="gallery-item" onclick="gallery.openLightbox(${index})">
                ${mediaContent}
                <span class="gallery-item-type">${isVideo ? 'VIDEO' : isLive ? 'LIVE' : 'IMAGE'}</span>
                <div class="gallery-item-info">
                    <div class="gallery-item-title">${item.prompt}</div>
                    <div class="gallery-item-meta">
                        <span class="gallery-item-tag">${item.era}</span>
                        <span class="gallery-item-tag">${item.character}</span>
                        <span>${item.year}</span>
                    </div>
                </div>
            </div>
        `;

        return wrapper;
    }

    openLightbox(index) {
        this.currentLightboxIndex = index;
        const item = this.filteredItems[index];
        const lightbox = document.getElementById('lightbox');
        const image = document.getElementById('lightbox-image');
        const video = document.getElementById('lightbox-video');
        const title = document.getElementById('lightbox-title');
        const meta = document.getElementById('lightbox-meta');

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
            // Remove from array
            this.visualizations = this.visualizations.filter(v => v.id !== item.id);
            
            // Save to localStorage
            localStorage.setItem('ibm5100_visualizations', JSON.stringify(this.visualizations));
            
            // Close lightbox and re-render
            this.closeLightbox();
            this.applyFilters();
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

    // Public method to add new visualization (called from bridge)
    addVisualization(data) {
        this.visualizations.unshift(data);
        localStorage.setItem('ibm5100_visualizations', JSON.stringify(this.visualizations));
        this.applyFilters();
    }
}

// Initialize gallery
let gallery;
document.addEventListener('DOMContentLoaded', () => {
    gallery = new TimelineGallery();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelineGallery;
}
