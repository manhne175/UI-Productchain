document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('video-container');
    const thumbnail = document.getElementById('video-thumbnail');
    const playButton = document.getElementById('play-button');
    const videoFrame = document.getElementById('video-player');
    
    const youtubeVideoID = "oqbSaGmVHvw"; 

    let isLoaded = false;

    container.addEventListener('click', function() {
        if (!isLoaded) {
            // 1. Ẩn ảnh bìa và nút play
            thumbnail.style.display = 'none';
            playButton.style.display = 'none';
            
            // 2. Hiện khung video
            videoFrame.style.display = 'block';

            // 3. Gán link vào iframe (autoplay=1 để tự chạy)
            videoFrame.src = `https://www.youtube.com/embed/${youtubeVideoID}?autoplay=1`;
            
            isLoaded = true;
        }
    });

    // Phát âm thanh khi click vào nút hôm
    const homButton = document.getElementById('hom-button');
    const homAudio = document.getElementById('hom-audio');

    if (homButton && homAudio) {
        homButton.addEventListener('click', function() {
            // Dừng âm thanh hiện tại nếu đang phát
            if (!homAudio.paused) {
                homAudio.pause();
                homAudio.currentTime = 0;
            } else {
                // Phát âm thanh
                homAudio.play().catch(function(error) {
                    console.error('Lỗi phát âm thanh:', error);
                });
            }
        });
    }

    // Array of random YouTube video IDs
    const randomVideoIDs = [
        "oqbSaGmVHvw",
        "jNQXAC9IVRw",
        "czetsT1xPIA",
        "GTZbDzs0WR4",
        "cY2D8NPgmO8",
        "6MxGmju1c4w",
        "7N0ypIvk2E8",
        "74Io5JupDag",
        "xo1VzoJiKSU",
        "tYzMGcUty6s"
    ];

    // Lazy load videos using Intersection Observer
    const videoItems = document.querySelectorAll('.video-item');
    
    if ('IntersectionObserver' in window) {
        const videoObserverOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0.25
        };

        const videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                const videoItem = entry.target;
                const videoId = videoItem.dataset.videoId;
                const thumbnail = videoItem.querySelector('.video-thumbnail');
                const playButton = videoItem.querySelector('.play-button-small');
                const videoPlayer = videoItem.querySelector('.video-player');
                const youtubeID = randomVideoIDs[videoId - 1];
                
                if (entry.isIntersecting) {
                    // Video is in viewport - load and autoplay every time
                    thumbnail.style.display = 'none';
                    playButton.style.display = 'none';
                    videoPlayer.style.display = 'block';
                    videoPlayer.src = `https://www.youtube.com/embed/${youtubeID}?autoplay=1`;
                } else {
                    // Video is out of viewport - unload to save resources
                    videoPlayer.src = '';
                    videoPlayer.style.display = 'none';
                    thumbnail.style.display = 'block';
                    playButton.style.display = 'flex';
                }
            });
        }, videoObserverOptions);

        videoItems.forEach(item => {
            videoObserver.observe(item);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        videoItems.forEach((item, index) => {
            initializeVideoItem(item, index + 1);
        });
    }

    function initializeVideoItem(videoItem, videoId) {
        const thumbnail = videoItem.querySelector('.video-thumbnail');
        const playButton = videoItem.querySelector('.play-button-small');
        const videoPlayer = videoItem.querySelector('.video-player');
        
        const youtubeID = randomVideoIDs[videoId - 1];
        let isLoaded = false;

        videoItem.addEventListener('click', function() {
            if (!isLoaded) {
                // Hide thumbnail and play button
                thumbnail.style.display = 'none';
                playButton.style.display = 'none';
                
                // Show video player
                videoPlayer.style.display = 'block';
                
                // Set video source
                videoPlayer.src = `https://www.youtube.com/embed/${youtubeID}?autoplay=1`;
                
                isLoaded = true;
            }
        });
    }
});