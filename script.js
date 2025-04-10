// Load the image and create an Image object
function loadImage(file, callback) {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function(e) {
        img.onload = function() {
            callback(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Function to compare the two images
function compareSignatures() {
    const referenceFile = document.getElementById('referenceSignature').files[0];
    const testFile = document.getElementById('testSignature').files[0];
    
    if (!referenceFile || !testFile) {
        alert("Please upload both signatures.");
        return;
    }

    loadImage(referenceFile, function(referenceImage) {
        loadImage(testFile, function(testImage) {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            
            // Resize canvas to match the reference image dimensions
            canvas.width = referenceImage.width;
            canvas.height = referenceImage.height;
            
            // Draw reference image on canvas and get pixel data
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(referenceImage, 0, 0);
            const referenceData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            
            // Draw test image on canvas and get pixel data
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(testImage, 0, 0);
            const testData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            
            // Compare the two images' pixel data
            const similarity = comparePixelData(referenceData, testData);
            
            // Set a threshold for similarity
            const threshold = 0.9;
            const resultText = similarity > threshold ? 'Signatures match!' : 'Signatures do not match!';
            document.getElementById('result').innerText = resultText;
        });
    });
}

// Function to compare pixel data from two images
function comparePixelData(refData, testData) {
    let matchingPixels = 0;
    
    // Loop through the pixel data
    for (let i = 0; i < refData.length; i += 4) {
        const r1 = refData[i], g1 = refData[i + 1], b1 = refData[i + 2];
        const r2 = testData[i], g2 = testData[i + 1], b2 = testData[i + 2];

        // Calculate the difference between RGB values
        const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
        
        // Count the pixels that match (lesser difference)
        if (diff < 50) {
            matchingPixels++;
        }
    }
    
    // Return the similarity percentage
    return matchingPixels / (refData.length / 4);
}