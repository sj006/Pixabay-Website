  // Function to create the typing and deleting effect made by SJ
  function typeAndDelete(container, words, index) {
    wordCount=words.length
    if (index >= wordCount) index = index%wordCount; 

    const typingSpeed = 50; // Speed of typing in milliseconds
    const deletingSpeed = 30; // Speed of deleting in milliseconds
    const pauseDuration = 1000; // Pause duration between typing and deleting

    let word = words[index];
    let i = 0;
    let isDeleting = false;

   

    function type() {
        if (!isDeleting) {
            if (i < word.length) {
                container.textContent += word[i];
                i++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(() => {
                    isDeleting = true;
                    i = word.length;
                    type();
                }, pauseDuration);
            }
        } else {
            if (i > 0) {
                container.textContent = container.textContent.slice(0, -1);
                i--;
                setTimeout(type, deletingSpeed);
            } else {
                isDeleting = false;
                index++;
                setTimeout(() => typeAndDelete(container, words, index, wordCount), pauseDuration);
            }
        }
    }

    type();
}

// Example words to type and delete
const words = [
    "Endless royalty-free images at your fingertips!",
    "Discover a treasure trove of stunning stock images!",
    "Search effortlessly for high-quality, royalty-free visuals!",
    "Unlock a world of premium stock photos for any project!",
    "Find captivating images to elevate your creative projects!",
    "Explore our vast collection of stunning, free images!",
    "Your source for unique and vibrant stock photography!",
    "Search and download beautiful royalty-free images today!",
    "Access an extensive library of free images for any need!",
    "Transform your projects with breathtaking royalty-free visuals!"];

const c = document.getElementById('typing-container');
typeAndDelete(c, words, 0); 