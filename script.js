class InfiniteScroll {
    constructor() {
        this.projects = ['BLUEFORCE', 'GOLDFISH', 'CISCO', 'SAP', 'SCOPESTYLE'];
        this.images = ['project-image-1', 'project-image-2', 'project-image-3', 'project-image-4', 'project-image-5'];

        this.currentProjectIndex = 2; // CISCO is in middle
        this.currentImageIndex = 0;

        this.isAnimating = false;
        this.itemHeight = 34; // Height of nav items
        this.imageHeight = 297.06; // Height of images

        this.init();
    }

    init() {
        this.setupProjectNavigation();
        this.setupImageGallery();
        this.bindScrollEvents();
    }

    setupProjectNavigation() {
        const projectNav = document.querySelector('[data-name="ProjectNav"]');
        if (!projectNav) return;

        // Clear existing content and set up for scrolling
        projectNav.innerHTML = '';
        projectNav.style.position = 'relative';
        projectNav.style.overflow = 'hidden';
        projectNav.style.height = '170px'; // 5 items * 34px

        // Create 9 nav items (4 above + 5 visible + 0 below initially)
        for (let i = -4; i <= 4; i++) {
            this.createNavItem(i);
        }
    }

    createNavItem(relativeIndex) {
        const projectNav = document.querySelector('[data-name="ProjectNav"]');
        const projectIndex = (this.currentProjectIndex + relativeIndex + this.projects.length) % this.projects.length;

        const navItem = document.createElement('div');
        navItem.className = 'nav-item absolute w-full flex items-center justify-start gap-2.5 px-0 py-1 transition-all duration-300';
        navItem.innerHTML = `<span class="project-nav-text flex-grow">${this.projects[projectIndex]}</span>`;
        navItem.dataset.relativeIndex = relativeIndex;

        // Position item relative to center of 170px container
        const containerCenter = 85; // 170px / 2
        const yPosition = containerCenter + (relativeIndex * this.itemHeight) - (this.itemHeight / 2);
        navItem.style.transform = `translateY(${yPosition}px)`;
        navItem.style.height = `${this.itemHeight}px`;

        // Set opacity based on position (-2 to 2 are visible, 0 is center)
        if (relativeIndex === 0) {
            navItem.style.opacity = '1'; // Center item
        } else if (Math.abs(relativeIndex) <= 2) {
            navItem.style.opacity = '0.3'; // Visible items
        } else {
            navItem.style.opacity = '0'; // Hidden items
        }

        projectNav.appendChild(navItem);
    }

    setupImageGallery() {
        const imageSection = document.querySelector('[data-name="ProjectCarousel"]');
        if (!imageSection) return;

        // Clear existing content and set up for scrolling
        imageSection.innerHTML = '';
        imageSection.style.position = 'relative';
        imageSection.style.overflow = 'hidden';

        // Create 9 images (2 above + 5 visible + 2 below)  
        for (let i = -2; i <= 6; i++) {
            this.createImageItem(i);
        }
    }

    createImageItem(relativeIndex) {
        const imageSection = document.querySelector('[data-name="ProjectCarousel"]');
        const imageIndex = (this.currentImageIndex + relativeIndex + this.images.length) % this.images.length;

        const imageDiv = document.createElement('div');
        imageDiv.className = `image-item absolute w-full bg-center bg-cover bg-no-repeat transition-all duration-300 ${this.images[imageIndex]}`;
        imageDiv.dataset.relativeIndex = relativeIndex;

        // Use full image height spacing to prevent overlap and fill browser height
        const yPosition = relativeIndex * this.imageHeight;
        imageDiv.style.transform = `translateY(${yPosition}px)`;
        imageDiv.style.height = `${this.imageHeight}px`;

        // Set opacity based on visibility (show 5 images: -2 to +2)
        if (relativeIndex >= -2 && relativeIndex <= 2) {
            imageDiv.style.opacity = '1'; // Visible images
        } else {
            imageDiv.style.opacity = '0'; // Hidden images
        }

        imageSection.appendChild(imageDiv);
    }

    scroll(direction) {
        if (this.isAnimating) return;

        this.isAnimating = true;

        // Update current indices
        if (direction > 0) {
            this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length;
            this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        } else {
            this.currentProjectIndex = (this.currentProjectIndex - 1 + this.projects.length) % this.projects.length;
            this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        }

        // Animate all items
        this.animateNavItems(direction);
        this.animateImageItems(direction);

        // Clean up after animation
        setTimeout(() => {
            this.cleanupNavItems(direction);
            this.cleanupImageItems(direction);
            this.isAnimating = false;
        }, 300);
    }

    animateNavItems(direction) {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const currentIndex = parseInt(item.dataset.relativeIndex);
            const newIndex = currentIndex - direction; // Opposite direction for upward movement
            const containerCenter = 85;
            const newY = containerCenter + (newIndex * this.itemHeight) - (this.itemHeight / 2);

            item.style.transform = `translateY(${newY}px)`;
            item.dataset.relativeIndex = newIndex;

            // Update opacity based on new position
            if (newIndex === 0) {
                item.style.opacity = '1';
            } else if (Math.abs(newIndex) <= 2) {
                item.style.opacity = '0.3';
            } else {
                item.style.opacity = '0';
            }
        });
    }

    animateImageItems(direction) {
        const imageItems = document.querySelectorAll('.image-item');

        imageItems.forEach(item => {
            const currentIndex = parseInt(item.dataset.relativeIndex);
            const newIndex = currentIndex - direction;
            const newY = newIndex * this.imageHeight;

            item.style.transform = `translateY(${newY}px)`;
            item.dataset.relativeIndex = newIndex;

            // Update opacity (show 5 images: -2 to +2)
            if (newIndex >= -2 && newIndex <= 2) {
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0';
            }
        });
    }

    cleanupNavItems(direction) {
        const projectNav = document.querySelector('[data-name="ProjectNav"]');
        const navItems = Array.from(document.querySelectorAll('.nav-item'));

        if (direction > 0) {
            // Remove items that moved too far up, add new item at bottom
            navItems.forEach(item => {
                const index = parseInt(item.dataset.relativeIndex);
                if (index < -4) {
                    item.remove();
                }
            });
            // Add new item at bottom
            this.createNavItem(4);
        } else {
            // Remove items that moved too far down, add new item at top
            navItems.forEach(item => {
                const index = parseInt(item.dataset.relativeIndex);
                if (index > 4) {
                    item.remove();
                }
            });
            // Add new item at top
            this.createNavItem(-4);
        }
    }

    cleanupImageItems(direction) {
        const imageItems = Array.from(document.querySelectorAll('.image-item'));

        if (direction > 0) {
            // Remove items that moved too far up, add new item at bottom
            imageItems.forEach(item => {
                const index = parseInt(item.dataset.relativeIndex);
                if (index < -2) {
                    item.remove();
                }
            });
            // Add new item at bottom
            this.createImageItem(6);
        } else {
            // Remove items that moved too far down, add new item at top
            imageItems.forEach(item => {
                const index = parseInt(item.dataset.relativeIndex);
                if (index > 6) {
                    item.remove();
                }
            });
            // Add new item at top
            this.createImageItem(-2);
        }
    }

    bindScrollEvents() {
        let scrollAccumulator = 0;
        const scrollThreshold = 5; // Even lower threshold for instant response on nav items

        window.addEventListener('wheel', (e) => {
            e.preventDefault();

            // Accumulate scroll delta
            scrollAccumulator += Math.abs(e.deltaY);

            // Trigger on very small scroll amount
            if (scrollAccumulator >= scrollThreshold) {
                const direction = e.deltaY > 0 ? 1 : -1;
                this.scroll(direction);
                scrollAccumulator = 0; // Reset accumulator
            }

        }, { passive: false });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InfiniteScroll();
});