# Accessible Shopping App

A web application designed to assist visually impaired users in identifying supermarket products through barcode scanning, voice commands, and accessibility-focused features.

## Demo 
https://www.linkedin.com/posts/mohamad-seyda-98874a33b_webdevelopment-accessibility-visualimpairmentsupport-activity-7273527284756606976-W8T-?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFVckPgBtzfxYjID_-RjitIqY4MSClgjRSM

## Key Features
- **Barcode Scanning**: Use your device camera or upload an image to scan product barcodes.
- **Text-to-Speech**: Audio feedback for product details and interface interactions.
- **Wishlist Management**: Save products for later reference with remove functionality.
- **Accessibility Modes**: 
  - High Contrast (multiple themes)
  - Dark Mode
- **Voice Commands**: Control app functions hands-free (e.g., "Start camera", "Toggle contrast").
- **Nutritional Data**: Visual charts showing nutritional information.
- **Manual Barcode Entry**: Type barcode numbers directly when scanning isn't possible.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/moseyda/accessible.git

2. Open index.html in a modern browser (Chrome/Firefox recommended).

For camera functionality:

- Use a local development server (e.g., Live Server, Live Preview)

- HTTPS connection required for camera access in production

## Dependencies
The app uses these external libraries (automatically loaded via CDN):
<!-- In index.html -->
<script src="https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>


## Usage
**Product Scanning**:

- Click "Open Camera" for live scanning

- Upload barcode image (PNG/JPG)

- Manually enter barcode numbers

**Accessibility Tools**:

- Toggle buttons for High Contrast/Dark Mode

**Voice commands supported**:

- "Start camera"

- "Upload image"

- "Toggle contrast"

- "Add to wishlist"

**Wishlist**:

- Add products from scanned results

- Remove items using the delete button


**Accessibility Features**:

- ARIA labels for screen readers

- Semantic HTML structure

- Keyboard-navigable interface

- Responsive design for various devices

- Audio feedback for all major actions

## Contributing
Contributions are welcome! Please ensure:

Follow WCAG 2.1 accessibility guidelines

Maintain color contrast ratios

Include ARIA attributes for interactive elements

Test with screen readers (NVDA/JAWS/VoiceOver)



## Troubleshooting
**Camera not working**:

- Ensure HTTPS/localhost is in order

- Check browser permissions

**Barcode not detected**:

- Ensure good lighting

- Try manual entry

*Not all barcodes are recognised by the API due to limitations (e.g. Lack of data).*

**Voice commands unresponsive**:

- Check microphone permissions

- Use Chrome/Firefox
