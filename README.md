# AuraLink AI - Empowering Silence Through Vision

A web-based assistive communication interface that uses AI-powered gesture detection to help non-verbal individuals communicate through facial gestures and blinks.

## 🌟 Features

- **Real-time Gesture Detection** - Uses TensorFlow.js and MediaPipe for accurate facial gesture recognition
- **Blink Detection** - Detects long blinks (0.5-2.5 seconds) to trigger commands
- **Voice Output** - Text-to-speech conversion for audible communication
- **Multiple Communication Modes**:
  - Non-Verbal (full gesture set)
  - Limited (eye tracking only)
  - Simple (easy pictograms)
  - Support (caregiver setup)
- **Emergency Alert System** - Quick access emergency triggering with caregiver notifications
- **Privacy First** - All processing happens in the browser, no data uploaded
- **No Hardware Required** - Works with any device camera
- **Responsive Design** - Mobile and desktop compatible

## 🚀 Quick Start

### Option 1: GitHub Pages Deployment

1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/" (root) folder
5. Save and wait for deployment
6. Visit: `https://[your-username].github.io/[repo-name]/`

### Option 2: Local Development

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/auralink-ai.git
cd auralink-ai
```

2. Serve the files using any static server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open browser to `http://localhost:8000`

### Option 3: Direct File Access

Simply open `index.html` in a modern web browser. 

**Note:** Camera access requires HTTPS in production. Use GitHub Pages or a proper web server for full functionality.

## 📁 File Structure

```
auralink-ai/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling
├── app.js          # Application logic and AI integration
└── README.md       # This file
```

## 🎯 How to Use

1. **Landing Page** - Click "Get Started"
2. **Quick Setup** - Enter your display name (optional) and enable voice output
3. **Select Mode** - Choose your preferred communication mode
4. **Communication Screen** - Allow camera access when prompted
5. **Use Gestures** - Long blink (0.5-2s) to trigger commands
6. **Tap Cards** - Or manually tap Water, Food, Medicine, or Emergency

## 🛠️ Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera access permission
- Internet connection (for loading TensorFlow.js libraries)
- Microphone permission (for voice output)

## 🔧 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |

## 📱 Features by Page

### 1. Landing Page
- Animated vision circle
- Trust indicators (Privacy-First, No Hardware, Browser-Based)

### 2. Quick Setup
- Display name input
- Language selection (English)
- Voice output toggle

### 3. Mode Selection
- 4 communication modes with emojis
- Visual selection feedback
- Security indicators

### 4. Main Communication Screen
- Live camera feed with gesture detection
- Real-time blink monitoring
- 4 command cards (Water, Food, Medicine, Emergency)
- Voice output panel
- FPS counter and stats

### 5. Emergency Screen
- High-visibility red alert
- SOS notification status
- Silent panic mode option
- Cancel with 3-second hold

### 6. Settings
- AI sensitivity controls
- Low light mode
- Voice profile customization
- Privacy notice

## 🔐 Privacy & Security

- **100% Browser-Based Processing** - No server uploads
- **Local AI Model** - TensorFlow.js runs entirely on device
- **No Data Storage** - Nothing saved or transmitted
- **Camera Access** - Only used for real-time detection
- **HTTPS Recommended** - For secure camera access

## 🎨 Design Philosophy

- **Dignity-First** - Non-medical, respectful tone
- **High Contrast** - Accessible for visual impairments
- **Large Touch Targets** - Easy interaction
- **Calm Aesthetics** - Reduces anxiety and panic
- **Dark Theme** - Reduces eye strain

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- TensorFlow.js team for face detection models
- MediaPipe for facial landmark detection
- Web Speech API for voice synthesis

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for accessibility and inclusion**

*Empowering Silence Through Vision*
