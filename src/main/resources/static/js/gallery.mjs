// Select all images within the ".image-container" div
const galleryImages = document.querySelectorAll(".image-container img");
const lightboxOverlay = document.getElementById("lightbox-overlay");
const lightboxImage = document.getElementById("lightbox-image");
const closeButton = document.getElementById("close-button");

// Function to open the lightbox
const openLightbox = (imageUrl) =>{
    lightboxImage.src = imageUrl;
    lightboxOverlay.classList.remove("hidden"); // Show the modal
    document.body.style.overflow = "hidden"; // Persists <main> html positioning
}

// Function to close the lightbox
const closeLightbox = () =>{
    lightboxOverlay.classList.add("hidden"); // Hide the modal
    document.body.style.overflow = ""; // Restore body scrolling
    lightboxImage.alt = "";
    lightboxImage.src = ""; // Clear the image source when closing

    setTimeout(() => {
        lightboxOverlay.style.display = "";
        lightboxImage.alt = "Enlarged image of Caleb and Mary.";
    }, 300);
}

document.addEventListener("DOMContentLoaded", function() {
    // Loop through each gallery image and add a click listener
    galleryImages.forEach(image => {
        image.addEventListener("click", function(){
            const imageUrl = this.src;
            openLightbox(imageUrl);
        });
    });
    // Event listener to close the lightbox when the "X" button is clicked
    closeButton.addEventListener("click", closeLightbox);
    // Event listener to close the lightbox when the overlay itself is clicked
    lightboxOverlay.addEventListener("click", function(event) {
        if (event.target === lightboxOverlay) {
            closeLightbox();
        }
    });
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && !lightboxOverlay.classList.contains("hidden")) {
            closeLightbox();
        }
    });
});


    // --- Pagination and Sliding Logic ---
const galleryPager = document.getElementById('gallery-pager');
const totalImages = parseInt(galleryPager.dataset.totalImages || '0', 10);
const pageSize = 9; // Match backend's DEFAULT_PAGE_SIZE
const maxPages = Math.ceil(totalImages / pageSize);
let currentPage = 1; // Start at page 1
const imageContainer = document.querySelector('.image-container');
const previousPageBtn = document.getElementById('previousPgBtn');
const nextPageBtn = document.getElementById('nextPgBtn');
let currentPageNumberDisplay = document.getElementById('currentPageNumber'); // The h1 element
const pageNumberContainer = document.getElementById('pageNumberContainer'); // The div containing h1

// Function to load images for a given page
async function loadImagesForPage(page) {
    const url = `/images?page=${page}&size=${pageSize}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.error) {
            console.error("Backend Error:", data.error);
            alert("Error loading images: " + data.error);
            return false; // Indicate failure
        }

        // Clear current images
        imageContainer.innerHTML = '';

        if (data.images && data.images.length > 0) {
            data.images.forEach(imageUrl => {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = "Image of Caleb and Mary.";

                imgElement.addEventListener("click", function() {
                    openLightbox(this.src);
                });
                imageContainer.appendChild(imgElement);
            });
        } else {
            console.log("No images for this page.");
        }
        return true; // Indicate success
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load images. Please try again.");
        return false; // Indicate failure
    }
}

// Function to update pager state (buttons and page number)
function updatePager(newPage, isPrevious = false) {
    if(isPrevious){
        // Handle page number animation
        // 1. Mark current number to slide out
        currentPageNumberDisplay.classList.add('slide-out-right');

        // 2. After current number starts sliding, prepare the new number
        // We use a short setTimeout to allow the browser to register the 'slide-out-left' class
        // and start its transition before we create the new element.

        setTimeout(() => {
            // Remove the old number (or its content)
            const parent = currentPageNumberDisplay.parentNode;
            if (parent){
                parent.removeChild(currentPageNumberDisplay);
            }
            // currentPageNumberDisplay.remove(); // Remove the old h1

            // Create a new h1 element for the new page number
            const newPageNumberDisplay = document.createElement('h1');
            newPageNumberDisplay.id = 'currentPageNumber';
            newPageNumberDisplay.classList.add('page-number', 'slide-in-left'); // Start off-screen
            newPageNumberDisplay.textContent = newPage;

            pageNumberContainer.appendChild(newPageNumberDisplay);

            // Trigger the slide-in animation after a very small delay
            // This is crucial to make the transition work, as it needs to transition
            // from the 'slide-in-right' state to the 'slide-center' state.
            setTimeout(() => {
                newPageNumberDisplay.classList.remove('slide-in-left');
                newPageNumberDisplay.classList.add('slide-center'); // Move to center
                // We will remove slide-center after the animation finishes
                // to keep it clean, but for simple slides, it might not be strictly needed.
                // However, if you plan to re-use the same element, it's good practice.
            }, 10); // A very short delay (e.g., 10ms) is often enough for browsers to apply the initial state

            // Update current page variable
            currentPage = newPage;
            console.log(currentPage)
            // currentPageNumberDisplay = document.getElementById('currentPageNumber'); // The h1 element
            currentPageNumberDisplay = newPageNumberDisplay;

            // Update button states
            previousPageBtn.style.opacity = (currentPage === 1) ? "0" : "1";
            previousPageBtn.style.userSelect = (currentPage === 1) ? "none" : "";
            previousPageBtn.style.pointerEvents = (currentPage === 1) ? "none" : "auto";
            nextPageBtn.style.opacity = (currentPage === maxPages) ? "0" : "1";
            nextPageBtn.style.userSelect = (currentPage === maxPages) ? "none" : "";
            nextPageBtn.style.pointerEvents = (currentPage === maxPages) ? "none" : "auto";
        }, 300); // This delay should match the CSS transition duration (0.3s)
    } else {
        // Handle page number animation
        // 1. Mark current number to slide out
        currentPageNumberDisplay.classList.add('slide-out-left');

        // 2. After current number starts sliding, prepare the new number
        // We use a short setTimeout to allow the browser to register the 'slide-out-left' class
        // and start its transition before we create the new element.

        setTimeout(() => {
            // Remove the old number (or its content)
            const parent = currentPageNumberDisplay.parentNode;
            if (parent){
                parent.removeChild(currentPageNumberDisplay);
            }
            // currentPageNumberDisplay.remove(); // Remove the old h1

            // Create a new h1 element for the new page number
            const newPageNumberDisplay = document.createElement('h1');
            newPageNumberDisplay.id = 'currentPageNumber';
            newPageNumberDisplay.classList.add('page-number', 'slide-in-right'); // Start off-screen
            newPageNumberDisplay.textContent = newPage;

            pageNumberContainer.appendChild(newPageNumberDisplay);

            // Trigger the slide-in animation after a very small delay
            // This is crucial to make the transition work, as it needs to transition
            // from the 'slide-in-right' state to the 'slide-center' state.
            setTimeout(() => {
                newPageNumberDisplay.classList.remove('slide-in-right');
                newPageNumberDisplay.classList.add('slide-center'); // Move to center
                // We will remove slide-center after the animation finishes
                // to keep it clean, but for simple slides, it might not be strictly needed.
                // However, if you plan to re-use the same element, it's good practice.
            }, 10); // A very short delay (e.g., 10ms) is often enough for browsers to apply the initial state

            // Update current page variable
            currentPage = newPage;
            console.log(currentPage)
            // currentPageNumberDisplay = document.getElementById('currentPageNumber'); // The h1 element
            currentPageNumberDisplay = newPageNumberDisplay;

            // Update button states
            previousPageBtn.style.opacity = (currentPage === 1) ? "0" : "1";
            previousPageBtn.style.userSelect = (currentPage === 1) ? "none" : "";
            previousPageBtn.style.pointerEvents = (currentPage === 1) ? "none" : "auto";
            nextPageBtn.style.opacity = (currentPage === maxPages) ? "0" : "1";
            nextPageBtn.style.userSelect = (currentPage === maxPages) ? "none" : "";
            nextPageBtn.style.pointerEvents = (currentPage === maxPages) ? "none" : "auto";
        }, 300); // This delay should match the CSS transition duration (0.3s)
    }
}


// Event listeners for navigation buttons
previousPageBtn.addEventListener('click', async () => {
    if (currentPage > 1) {
        const success = await loadImagesForPage(currentPage - 1);
        if (success) {
            updatePager((currentPage - 1), true);
        }
    }
});

nextPageBtn.addEventListener('click', async () => {
    if (currentPage < maxPages) {
        const success = await loadImagesForPage(currentPage + 1);
        if (success) {
            updatePager(currentPage + 1);
        }
    }
});

// Initial load and pager setup
if (totalImages > 0) {
    loadImagesForPage(currentPage).then(success => {
        if (success) {
            updatePager(currentPage); // Set initial button visibility and ensure page number is correct
        }
    });
} else {
    // If no images, hide pager or show a message
    if (previousPageBtn) previousPageBtn.style.display = 'none';
    if (nextPageBtn) nextPageBtn.style.display = 'none';
    if (currentPageNumberDisplay) currentPageNumberDisplay.style.display = 'none';
}