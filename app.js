const apiKey = '46120813-2e74f3b58928f263f01f24aa2';  
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const imageResults = document.getElementById('image-results');
const loader = document.getElementById('loader');
const loadingScreen = document.getElementById('loading-screen');  // Loading screen element
const container = document.querySelector('.container');  // Container for main content

let page = 1;  // Track current page
let query = '';  // Store the search query
let isLoading = false;  // Track whether data is being fetched

// Helper function to set a cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
}

// Helper function to get a cookie
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  const cookieName = name + "=";
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cookieName) === 0) {
      return JSON.parse(c.substring(cookieName.length, c.length));
    }
  }
  return [];
}

// Helper function to remove a cookie
function removeCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Get saved favorites from cookies
let favoriteImages = getCookie('favoriteImages') || [];



// Hide the loading screen after the content is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    container.style.opacity = 1;  // Show the content smoothly
  }, 2500);  // Delay to match the animation timing
});

// Search button click event
// Function to perform the search
function performSearch() {
   query = searchInput.value.trim();
  if (query) {
    page = 1;  // Reset page to 1 on new search
    imageResults.innerHTML = '';  // Clear previous results on a new search
    fetchImages(query, page);  // Fetch first page of images
  } else {
    alert('Please enter a search term');
  }
}

// Existing click event for the search button
searchButton.addEventListener('click', performSearch);

// New event listener for the "Enter" key in the search input
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    performSearch(); // Call the search function when Enter is pressed
  }
});
fetchImages("",1);

/// Fetch images from the Pixabay API with pagination
async function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&page=${page}&per_page=20`;
  
  // Show the loader while fetching data
  loader.classList.remove('hidden');
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Hide the loader once data is loaded
    loader.classList.add('hidden');

    if (data.hits.length > 0) {
      displayImages(data.hits);
    } else {
      if (page === 1) {
        imageResults.innerHTML = '<p>No results found. Try a different search term.</p>';
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    loader.classList.add('hidden');
    imageResults.innerHTML = '<p>An error occurred while fetching images. Please try again later.</p>';
  }
}

function displayImages(images) {
  images.forEach(image => {
    const imageItem = document.createElement('div');
    imageItem.classList.add('image-item');
    
    // Image element
    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    
    // Image description (tags)
    const desc = document.createElement('p');
    desc.textContent = image.tags;

    // Favorite button
    const starButton = document.createElement('button');
    starButton.classList.add('star-button');
    starButton.innerHTML = '&#9733;'; // Star icon
      // Check if the image is already favorited
      if (favoriteImages.includes(image.webformatURL)) {
        starButton.classList.add('favorited');
      }
    starButton.addEventListener('click', () => {
      if (favoriteImages.includes(image.webformatURL)) {
        // Remove from favorites
        favoriteImages = favoriteImages.filter(fav => fav !== image.webformatURL);
        starButton.classList.remove('favorited');
      } else {
        // Add to favorites
        favoriteImages.push(image.webformatURL);
        starButton.classList.add('favorited');
      }
      // Save the updated favorites to cookies
      setCookie('favoriteImages', favoriteImages, 5000);});

    // Download button
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-button');
    const downloadIcon = document.createElement('img');
    downloadIcon.src = './download.png'; // Replace with the path to your icon image
    downloadIcon.alt = 'Download';
    downloadIcon.style.width = '30px'; // Adjust size as needed
    downloadIcon.style.height = '30px'; // Adjust size as needed
    downloadButton.appendChild(downloadIcon); // Append the icon image to the button


    // Add click event to download the image
    downloadButton.addEventListener('click', function() {
      // Fetch the image as a blob
      fetch(image.largeImageURL)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.blob(); // Get the blob
        })
        .then(blob => {
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob); // Create a URL for the blob
          link.href = url; // Set the href to the blob URL
          link.download = image.largeImageURL.split('/').pop(); // Extract image file name
          document.body.appendChild(link);
          link.click(); // Programmatically click the link
          document.body.removeChild(link);
          URL.revokeObjectURL(url); // Clean up by revoking the object URL
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    });
    
    const shareButton = document.createElement('button');
shareButton.classList.add('share-button');
shareButton.innerHTML = ''; // Star icon
const shareIcon = document.createElement('img');
    shareIcon.src = './share.png'; // Replace with the path to your icon image
    shareIcon.alt = 'Share';
    shareIcon.style.width = '20px'; // Adjust size as needed
    shareIcon.style.height = '20px'; // Adjust size as needed
    shareButton.appendChild(shareIcon); // Append the icon image to the button
// Add click event to share the image
shareButton.addEventListener('click', function() {
  if (navigator.share) {
    navigator.share({
      title: 'Check out this image!',
      text: image.tags, // Description or tags of the image
      url: image.largeImageURL // URL of the image to share
    })
    .then(() => console.log('Image shared successfully!'))
    .catch(error => console.error('Error sharing:', error));
  } else {
    alert('Share not supported on this browser, please copy the link manually.');
  }
});


    // Append image, description, star button, and download button to the image item
    imageItem.appendChild(img);
    imageItem.appendChild(desc);
    imageItem.appendChild(starButton);
    imageItem.appendChild(downloadButton);
    imageItem.appendChild(shareButton); // Add the share button

    
    // Full-screen modal functionality
    img.addEventListener('click', () => openImageModal(image.largeImageURL));
    
    // Append image item to the image results container
    imageResults.appendChild(imageItem);
  });
}


// Open full-screen modal with selected image
function openImageModal(imageUrl) {
  const imageModal = document.getElementById('image-modal');
  const fullImage = document.getElementById('full-image');
  const exitButton = document.getElementById('exit-button');
  
  fullImage.src = imageUrl;
  imageModal.style.display = 'flex';
  
  exitButton.addEventListener('click', () => {
    imageModal.style.display = 'none';
  });
}

// Infinite scroll event listener to load more images
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    page++;  // Increment page for the next set of images
    fetchImages(query, page);  // Fetch the next set of images
    isLoading = true;  // Set loading flag to true to avoid multiple requests
  }
  
  setTimeout(() => {
    isLoading = false;  // Reset the loading flag after a short delay
  }, 1000);
});




