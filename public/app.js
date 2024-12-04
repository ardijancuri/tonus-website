import { gsap } from 'https://cdn.skypack.dev/gsap';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const totalImages = 85;
const imagePath = '/src/img/bg-frames-webp/';
const sequenceImage = document.getElementById('sequenceImage');
const tonusTitle = document.getElementById('tonusTitle');
const secondSection = document.getElementById('secondSection');
const lastFrame = document.getElementById('lastFrame');
const loadingOverlay = document.getElementById('loadingOverlay');

let loadedImages = 0;

// Preload all images in sequence
const preloadImages = () => {
    for (let i = 1; i <= totalImages; i++) {
        const img = new Image();
        img.src = `${imagePath}${padNumber(i, 4)}.webp`;
        img.onload = handleImageLoad;
    }
};

// Function to pad the image number with leading zeros
function padNumber(number, size) {
    let s = String(number);
    while (s.length < (size || 4)) {
        s = '0' + s;
    }
    return s;
}

// Function to handle each image load
function handleImageLoad() {
    loadedImages++;
    if (loadedImages === totalImages) {
        hideLoadingOverlay();
    }
}

// Function to hide the loading overlay
function hideLoadingOverlay() {
    loadingOverlay.classList.add('hiddenOverlay');
}

// Function to update the image based on the current frame
function updateImage(frame) {
    const paddedIndex = padNumber(frame, 4);
    requestAnimationFrame(() => {
        sequenceImage.src = `${imagePath}${paddedIndex}.webp`;
    });
}

// ScrollTrigger for the image sequence
ScrollTrigger.create({
    trigger: '#secondSection',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    pin: true,
    onUpdate: (self) => {
        const progress = self.progress;
        const frame = Math.round(progress * (totalImages - 1)) + 1;
        updateImage(frame);

        // Update opacity of the TONUS title based on progress
        tonusTitle.style.opacity = 1 - (progress * 3);
        secondSection.style.setProperty('--bg-opacity', 1 - (progress * 2));

        if (frame === totalImages) {
            lastFrame.style.opacity = '1';
        } else {
            lastFrame.style.opacity = '0';
        }
    },
});

// Horizontal Scroll Logic
const panels = gsap.utils.toArray(".content");

ScrollTrigger.create({
    trigger: '#horizontalScroll',
    start: '0 top',
    end: 'bottom top',
    scrub: true,
    pin: true,
    onUpdate: (self) => {
        const progress = self.progress;
        const movement = -100 * progress * (panels.length - 1);
        gsap.set(panels, { xPercent: movement });
    },
});

// Preload images after DOM content loads
window.addEventListener('DOMContentLoaded', preloadImages);

// Ensure the title starts fully visible and centered
gsap.set(tonusTitle, { opacity: 1, transformOrigin: "center" });


