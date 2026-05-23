const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const overlayCanvas = document.getElementsByClassName('input_overlay')[0];
const overlayCtx = overlayCanvas.getContext('2d');
const statusElement = document.getElementById('status');

// --- FIREWORKS SYSTEM ---
let fireworks = [];
let particles = [];
let hue = 120;
let limiterTotal = 5;
let limiterTick = 0;
let timerTotal = 80;
let timerTick = 0;
let mousedown = false;
let mx, my;
let fingerCount = 0; // Global variable shared between camera and fireworks

// Set canvas size
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

// Overlay canvas size (small)
overlayCanvas.width = 200;
overlayCanvas.height = 150;

window.addEventListener('resize', () => {
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
    let xDistance = p1x - p2x;
    let yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Firework Class
class Firework {
    constructor(sx, sy, tx, ty) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = random(60, 100); // Brighter trails
        this.targetRadius = 1;
        // Random hue for each firework, or use global hue
        this.hue = random(0, 360);
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }
        this.speed *= this.acceleration;
        let vx = Math.cos(this.angle) * this.speed;
        let vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

        if (this.distanceTraveled >= this.distanceToTarget) {
            createParticles(this.tx, this.ty, this.hue); // Pass hue to particles
            fireworks.splice(index, 1);
        } else {
            this.x += vx;
            this.y += vy;
        }
    }

    draw() {
        canvasCtx.beginPath();
        canvasCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        canvasCtx.lineTo(this.x, this.y);
        canvasCtx.strokeStyle = 'hsl(' + this.hue + ', 100%, ' + this.brightness + '%)';
        canvasCtx.stroke();
    }
}

// Particle Class
class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 8; // Longer trails for explosion
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = random(0, Math.PI * 2);
        this.speed = random(2, 15); // Faster explosion
        this.friction = 0.96; // Less friction
        this.gravity = 0.6; // Reduced gravity for "floaty" feel
        this.hue = random(hue - 20, hue + 20); // Varied color based on parent
        this.brightness = random(60, 100); // Brighter
        this.alpha = 1;
        this.decay = random(0.005, 0.02); // Longer life
    }

    update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }

    draw() {
        canvasCtx.beginPath();
        canvasCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        canvasCtx.lineTo(this.x, this.y);
        // Add flickering efffect
        let flickering = Math.random() < 0.3 ? 0.3 : 1;
        canvasCtx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + (this.alpha * flickering) + ')';
        canvasCtx.stroke();
    }
}

function createParticles(x, y, hue) {
    let particleCount = 80; // More particles
    while (particleCount--) {
        particles.push(new Particle(x, y, hue));
    }
}

function loop() {
    requestAnimationFrame(loop);
    hue += 0.5;

    // Clear canvas with trail effect
    canvasCtx.globalCompositeOperation = 'destination-out';
    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    let j = particles.length;
    while (j--) {
        particles[j].draw();
        particles[j].update(j);
    }

    // Logic to launch fireworks based on finger count
    if (fingerCount > 0) {
        // Higher finger count -> Faster launch rate (lower limiterTotal)
        // 1 finger: slow, 5 fingers: fast
        // Mapping: 1 -> 20, 5 -> 2
        let launchRate = Math.max(2, 25 - (fingerCount * 4));

        limiterTick++;
        if (limiterTick >= launchRate) {
            // Launch multiple fireworks for high finger counts to look cooler
            let firesToLaunch = Math.ceil(fingerCount / 2);
            for (let k = 0; k < firesToLaunch; k++) {
                fireworks.push(new Firework(
                    window.innerWidth / 2,
                    window.innerHeight,
                    random(0, window.innerWidth),
                    random(0, window.innerHeight / 2)
                ));
            }
            limiterTick = 0;
        }
    }
}

loop();

// --- MEDIAPIPE HANDS ---

function onResults(results) {
    // Clear overlay canvas
    overlayCtx.save();
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.drawImage(results.image, 0, 0, overlayCanvas.width, overlayCanvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Only use the first detected hand for simplicity
        const landmarks = results.multiHandLandmarks[0];

        // Draw landmarks
        drawConnectors(overlayCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 1 });
        drawLandmarks(overlayCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 2 });

        // Count fingers
        let fingers = 0;

        // Thumb (checking x position relative to IP joint depending on hand side isn't perfect without knowing handing, 
        // but simpler logic is checking if tip is far from palm center compared to MCP. 
        // A robust, handedness-agnostic 'is thumb up' is tricky in 2D. 
        // We'll use a simplified check: is thumb tip.x further away from pinky mcp.x than thumb mcp.x? 
        // Actually, let's use the simplest vector logic relative to wrist/palm for general "extension"
        // OR standard approach: compare tip X to IP X. But needs Right/Left info.
        // Let's assume user raises hand naturally.

        // Standard geometric approach for 4 fingers (Index, Middle, Ring, Pinky)
        // Tip y < Pip y (Pip is the joint below tip) - Note: Y increases downwards in screen coords
        if (landmarks[8].y < landmarks[6].y) fingers++; // Index
        if (landmarks[12].y < landmarks[10].y) fingers++; // Middle
        if (landmarks[16].y < landmarks[14].y) fingers++; // Ring
        if (landmarks[20].y < landmarks[18].y) fingers++; // Pinky

        // Thumb: This is trickier. A simple heuristic: distance from tip to pinky MCP > distance from IP to pinky MCP?
        // Let's try: if thumb tip is "extended". 
        // Simple 2D check: X distance from other fingers? 
        // Let's rely on coordinate logic: if thumb tip[4].x < lip[3].x (for right hand)
        // We can get handedness from results.multiHandedness if we turn it on.
        // Let's assume generic "extension" based on distance from wrist [0]
        // If dist(4, 0) > dist(3, 0) * 1.1 ? relatively reliable
        // Or simpler: check x coordinate diff if hand is vertical.

        // Let's just create a generic 'thumb is extended' check based on angle or distance
        const thumbTip = landmarks[4];
        const thumbIp = landmarks[3];
        const thumbMcp = landmarks[2];

        // Using vector calculation for thumb extension (works for most orientations but best for upright hand)
        // Check if tip is farther from base of palm (wrist) than MCP
        // No, simple "is extended" check:
        // Calculate distance from wrist(0) to tip(4) vs wrist(0) to ip(3)
        // If tip is further, it's extended.
        const d_wrist_tip = Math.hypot(landmarks[0].x - landmarks[4].x, landmarks[0].y - landmarks[4].y);
        const d_wrist_ip = Math.hypot(landmarks[0].x - landmarks[3].x, landmarks[0].y - landmarks[3].y);

        // Threshold usually needed but simple inequality often works for thumb
        if (d_wrist_tip > d_wrist_ip) fingers++;

        fingerCount = fingers;
        statusElement.innerText = `Phát hiện: ${fingerCount} ngón tay`;
    } else {
        fingerCount = 0; // No hand -> no fireworks
        statusElement.innerText = "Giơ tay lên camera...";
    }
    overlayCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});

camera.start();
