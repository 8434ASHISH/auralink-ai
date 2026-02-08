// ====================================
// AURALINK AI - MAIN APPLICATION
// ====================================

const app = {
    // State management
    state: {
        currentMode: 'nonverbal',
        voiceEnabled: true,
        displayName: '',
        language: 'en',
        cameraActive: false,
        detectionActive: false
    },

    // References
    refs: {
        video: null,
        canvas: null,
        ctx: null,
        model: null,
        lastBlinkTime: 0,
        isBlinking: false,
        fpsCounter: 0,
        lastFrameTime: Date.now()
    },

    // Initialize app
    init() {
        console.log('AuraLink AI initialized');
        this.setupEventListeners();
    },

    // Setup event listeners
    setupEventListeners() {
        // Prevent default form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => e.preventDefault());
        });

        // Toggle switches
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });
    },

    // Page navigation
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Special handling for main screen
            if (pageId === 'main-screen' && !this.state.cameraActive) {
                // Camera will be started by startCommunication
            }
        }
    },

    // Toggle voice
    toggleVoice() {
        this.state.voiceEnabled = !this.state.voiceEnabled;
        const toggle = document.getElementById('voiceToggle');
        if (toggle) {
            toggle.classList.toggle('active');
        }
    },

    // Mode selection
    selectMode(mode) {
        this.state.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-mode="${mode}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Update mode label
        const modeLabel = document.getElementById('currentModeLabel');
        if (modeLabel) {
            const modeNames = {
                'nonverbal': 'Non-Verbal',
                'limited': 'Limited',
                'simple': 'Simple',
                'support': 'Support'
            };
            modeLabel.textContent = modeNames[mode] || 'Non-Verbal';
        }
    },

    // Start communication (from mode selection)
    async startCommunication() {
        this.showPage('main-screen');
        
        if (!this.state.cameraActive) {
            await this.initCamera();
            await this.loadFaceDetection();
            this.startDetection();
        }
    },

    // Initialize camera
    async initCamera() {
        try {
            this.refs.video = document.getElementById('video');
            this.refs.canvas = document.getElementById('canvas');
            this.refs.ctx = this.refs.canvas.getContext('2d');

            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false 
            });
            
            this.refs.video.srcObject = stream;
            this.state.cameraActive = true;
            
            this.refs.video.onloadedmetadata = () => {
                this.refs.canvas.width = this.refs.video.videoWidth;
                this.refs.canvas.height = this.refs.video.videoHeight;
                console.log('Camera initialized:', this.refs.canvas.width, 'x', this.refs.canvas.height);
            };
        } catch (error) {
            console.error('Camera access error:', error);
            alert('Please allow camera access to use AuraLink AI. Camera is required for gesture detection.');
        }
    },

    // Load face detection model
    async loadFaceDetection() {
        try {
            console.log('Loading face detection model...');
            
            this.refs.model = await faceLandmarksDetection.createDetector(
                faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
                {
                    runtime: 'tfjs',
                    refineLandmarks: true,
                    maxFaces: 1
                }
            );
            
            console.log('Face detection model loaded successfully');
        } catch (error) {
            console.error('Model loading error:', error);
            alert('Failed to load AI model. Please refresh the page.');
        }
    },

    // Start detection loop
    startDetection() {
        if (!this.refs.model || this.state.detectionActive) {
            return;
        }

        this.state.detectionActive = true;
        console.log('Starting gesture detection...');

        const detect = async () => {
            if (!this.state.detectionActive) {
                return;
            }

            try {
                const predictions = await this.refs.model.estimateFaces(this.refs.video);
                
                if (predictions && predictions.length > 0) {
                    const face = predictions[0];
                    
                    // Get eye landmarks
                    const leftEye = face.keypoints.filter(k => 
                        k.name && (k.name.includes('leftEye') || k.name.includes('Left eye'))
                    );
                    const rightEye = face.keypoints.filter(k => 
                        k.name && (k.name.includes('rightEye') || k.name.includes('Right eye'))
                    );

                    if (leftEye.length > 0 && rightEye.length > 0) {
                        // Calculate eye aspect ratios
                        const leftEAR = this.calculateEyeAspectRatio(leftEye);
                        const rightEAR = this.calculateEyeAspectRatio(rightEye);
                        const avgEAR = (leftEAR + rightEAR) / 2;

                        // Blink detection
                        const BLINK_THRESHOLD = 0.25;
                        
                        if (avgEAR < BLINK_THRESHOLD && !this.refs.isBlinking) {
                            this.refs.isBlinking = true;
                            this.refs.lastBlinkTime = Date.now();
                        } else if (avgEAR > BLINK_THRESHOLD && this.refs.isBlinking) {
                            const blinkDuration = (Date.now() - this.refs.lastBlinkTime) / 1000;
                            this.refs.isBlinking = false;

                            // Long blink detection (0.5s to 2s)
                            if (blinkDuration > 0.5 && blinkDuration < 2.5) {
                                this.handleLongBlink(blinkDuration);
                            }
                        }
                    }
                }

                // Update FPS
                this.updateFPS();

            } catch (error) {
                console.error('Detection error:', error);
            }

            requestAnimationFrame(detect);
        };

        detect();
    },

    // Calculate eye aspect ratio
    calculateEyeAspectRatio(eyePoints) {
        if (!eyePoints || eyePoints.length < 4) {
            return 1;
        }

        // Get vertical and horizontal distances
        let verticalSum = 0;
        let horizontalDist = 0;

        if (eyePoints.length >= 6) {
            // Better EAR calculation with more points
            const p1 = eyePoints[0];
            const p2 = eyePoints[Math.floor(eyePoints.length / 3)];
            const p3 = eyePoints[Math.floor(eyePoints.length / 2)];
            const p4 = eyePoints[Math.floor(2 * eyePoints.length / 3)];
            const p5 = eyePoints[eyePoints.length - 1];

            verticalSum = Math.abs(p2.y - p4.y) + Math.abs(p3.y - p5.y);
            horizontalDist = Math.abs(p1.x - p5.x);
        } else {
            // Simplified calculation
            const p1 = eyePoints[0];
            const p2 = eyePoints[eyePoints.length - 1];
            const p3 = eyePoints[Math.floor(eyePoints.length / 2)];
            
            verticalSum = Math.abs(p3.y - p1.y);
            horizontalDist = Math.abs(p1.x - p2.x);
        }

        return horizontalDist > 0 ? verticalSum / (2 * horizontalDist) : 1;
    },

    // Handle long blink detection
    handleLongBlink(duration) {
        console.log('Long blink detected:', duration.toFixed(2), 's');
        
        // Update UI
        const blinkTimeElem = document.getElementById('blinkTime');
        if (blinkTimeElem) {
            blinkTimeElem.textContent = duration.toFixed(2) + 's';
        }

        // Show feedback
        this.showGestureFeedback();

        // Trigger default action based on mode
        if (this.state.currentMode === 'nonverbal') {
            // Auto-trigger last selected command or water
            setTimeout(() => {
                this.triggerCommand('water');
            }, 500);
        }
    },

    // Show gesture feedback
    showGestureFeedback() {
        const feedback = document.getElementById('gestureFeedback');
        if (feedback) {
            feedback.classList.add('show');
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 2000);
        }
    },

    // Update FPS counter
    updateFPS() {
        const now = Date.now();
        const delta = now - this.refs.lastFrameTime;
        
        if (delta > 0) {
            const fps = Math.round(1000 / delta);
            this.refs.fpsCounter = fps;
            
            const fpsElem = document.getElementById('fps');
            if (fpsElem) {
                fpsElem.textContent = fps;
            }
        }
        
        this.refs.lastFrameTime = now;
    },

    // Trigger command
    triggerCommand(command) {
        const messages = {
            'water': 'I need water',
            'food': 'I need food',
            'medicine': 'I need medicine'
        };

        const message = messages[command] || command;
        
        // Update output message
        const outputElem = document.getElementById('outputMessage');
        if (outputElem) {
            outputElem.textContent = `"${message}"`;
        }

        // Speak if voice enabled
        if (this.state.voiceEnabled) {
            this.speak(message);
        }

        console.log('Command triggered:', command, '-', message);
    },

    // Text to speech
    speak(text) {
        try {
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // Get available voices
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Try to find a good English voice
                const englishVoice = voices.find(voice => 
                    voice.lang.startsWith('en') && voice.name.includes('Female')
                ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
                
                utterance.voice = englishVoice;
            }

            speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Speech error:', error);
        }
    },

    // Trigger emergency
    triggerEmergency() {
        this.showPage('emergency-screen');
        
        if (this.state.voiceEnabled) {
            this.speak('Emergency! Help needed! Emergency!');
        }

        console.log('EMERGENCY TRIGGERED');
    },

    // Cancel emergency
    cancelEmergency() {
        speechSynthesis.cancel();
        this.showPage('main-screen');
        console.log('Emergency cancelled');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Also initialize voices (needed for some browsers)
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded:', speechSynthesis.getVoices().length);
    };
}

console.log('AuraLink AI loaded successfully');
