// Toggle High Contrast Mode (and disable dark mode if active)
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    if (document.body.classList.contains('high-contrast')) {
        document.body.classList.remove('dark-mode');
    }
}

// Toggle Dark Mode (and disable high contrast if active)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('high-contrast');
    }
}


// Function to provide audio feedback using Speech Synthesis
function provideAudioInstructions(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; 
        utterance.pitch = 1; 
        utterance.rate = 1;  
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Speech synthesis not supported in this browser.');
    }
}


// Voice command integration
function startVoiceCommands() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        const command = event.results[0][0].transcript.toLowerCase();
        provideAudioInstructions(`You said: ${command}`);
        
        if (command.includes('start camera')) {
            openCamera();
        } else if (command.includes('upload image')) {
            document.getElementById('barcodeInput').click();
        } else if (command.includes('toggle contrast')) {
            toggleHighContrast();
        } else if (command.includes('dark mode')) {
            toggleDarkMode();
        } else if (command.includes('add to wishlist')) {
            addToWishlist();
        } else {
            provideAudioInstructions('Unknown command.');
        }
    };

    recognition.start();
    provideAudioInstructions('Voice command mode activated. Say a command to proceed.');
}

// Wishlist functionality
const wishlist = [];

function addToWishlist() {
    const productInfo = document.getElementById('productInfo').innerText;
    if (!productInfo || productInfo.includes('Scan a barcode')) {
        provideAudioInstructions('No product details available to add to the wishlist.');
        return;
    }

    wishlist.push(productInfo);
    updateWishlistUI();
    provideAudioInstructions('Product added to the wishlist.');
}

function updateWishlistUI() {
    const wishlistContainer = document.getElementById('wishlist');
    wishlistContainer.innerHTML = wishlist.map((item, index) => `
        <div class="wishlist-item">
            <p>${item}</p>
            <button class="btn btn-danger btn-sm" onclick="removeFromWishlist(${index})">Remove</button>
        </div>
    `).join('');
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    updateWishlistUI();
    provideAudioInstructions('Product removed from the wishlist.');
}

// Simulate opening the camera with QuaggaJS barcode detection
function openCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                document.getElementById('productDetails').innerHTML = `
                    <div class="text-center">
                        <h4>Camera Feed</h4>
                        <div class="video-container">
                            <video autoplay muted playsinline style="width: 100%; max-width: 500px;"></video>
                            <div class="overlay-box"></div>
                        </div>
                    </div>`;

                document.querySelector('video').srcObject = stream;
                provideAudioInstructions('Please point the camera at the product barcode.');
                startBarcodeDetection(video);
            })
            .catch(function (error) {
                alert('Unable to access the camera. Please check your permissions or device settings.');
            });
    } else {
        alert('Camera is not supported on your device or browser.');
    }
}

// Start barcode detection using QuaggaJS
function startBarcodeDetection(video) {
    Quagga.init({
        inputStream: {
            type: 'LiveStream',
            target: video,
            constraints: {
                facingMode: 'environment'
            }
        },
        decoder: {
            readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'upc_reader']
        }
    }, function (err) {
        if (err) {
            console.error('QuaggaJS initialization failed:', err);
            alert('Unable to initialize barcode scanner.');
            return;
        }

        Quagga.start();
        provideAudioInstructions('Move the barcode into view and center it.');

        Quagga.onDetected(function (result) {
            const barcode = result.codeResult.code;
            provideAudioInstructions('Barcode detected: ' + barcode);
            fetchProductInfo(barcode);
        });
    });
}


// Fetch product info from Open Food Facts API
function fetchProductInfo(barcode) {
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.product) {
                const product = data.product;
                const name = product.product_name || 'Product name not found';
                const ingredients = product.ingredients_text || 'Ingredients not available';
                const packaging = product.packaging || 'Packaging info not available';
                const price = product.price || 'Price not available';
                const description = product.product_description || 'Description not available';

                const productDetails = `
                    <p>Product Name: ${name}</p>
                    <p>Ingredients: ${ingredients}</p>
                    <p>Packaging: ${packaging}</p>
                    <p>Price: £${price}</p>
                    <p>Description: ${description}</p>
                `;

                document.getElementById('productInfo').innerHTML = productDetails;

                const productInfoText = `
                    The product is ${name}. 
                    Ingredients: ${ingredients}. 
                    Packaging: ${packaging}. 
                    Price: £${price}. 
                    Description: ${description}.
                `;
                provideAudioInstructions(productInfoText);
            } else {
                alert('Product not found.');
                provideAudioInstructions('Product not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching product info:', error);
            alert('Error fetching product information.');
            provideAudioInstructions('Error fetching product information.');
        });
}

// Interactive nutritional data visualisation
function renderNutritionalChart(data) {
    const ctx = document.getElementById('nutritionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Calories', 'Fat', 'Sugar', 'Protein'],
            datasets: [{
                label: 'Nutritional Value',
                data: [data.calories, data.fat, data.sugar, data.protein],
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            }
        }
    });
}

document.getElementById('barcodeInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;

            const img = document.createElement('img');
            img.src = imageData;
            document.getElementById('productInfo').innerHTML = `
                <p>Processing barcode image...</p>
            `;
            document.getElementById('productInfo').appendChild(img);

            Quagga.decodeSingle({
                src: imageData,
                decoder: {
                    readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'upc_reader']
                }
            }, function (result) {
                if (result && result.codeResult) {
                    const barcode = result.codeResult.code;
                    document.getElementById('productInfo').innerHTML = `
                        <img src="${imageData}" alt="Uploaded Barcode" style="max-width: 100%; height: auto;">
                        <p>Barcode detected: ${barcode}</p>`;
                    provideAudioInstructions('Barcode detected: ' + barcode);
                    fetchProductInfo(barcode);
                } else {
                    document.getElementById('productInfo').innerHTML = `
                        <p>No barcode detected. Please try again with a clearer image.</p>`;
                    provideAudioInstructions('No barcode detected. Please try again.');
                }
            });
        };
        reader.readAsDataURL(file);
    }
});

// Search for a product by manually entered barcode
function searchByManualBarcode() {
    const manualBarcode = document.getElementById('manualBarcode').value.trim();

    if (manualBarcode) {
        const isValidBarcode = /^[0-9]+$/.test(manualBarcode);

        if (isValidBarcode) {
            fetchProductInfo(manualBarcode); // Search the product using the barcode
        } else {
            provideAudioInstructions('Please enter a valid barcode number.');
            alert('Please enter a valid numeric barcode.');
        }
    } else {
        provideAudioInstructions('Please enter a barcode number.');
        alert('Please enter a barcode number.');
    }
}

