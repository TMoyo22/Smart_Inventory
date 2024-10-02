// Select the sidebar and the toggle button
const sidebar = document.getElementById('sidebar');
const toggleButton = document.getElementById('menu-toggle');
const mainContent = document.getElementById('main-content');

// Function to toggle sidebar minimization
function toggleSidebar() {
    sidebar.classList.toggle('minimized');
    mainContent.classList.toggle('shifted'); // Optional: add a class to main-content if needed
}

// Add event listener to the toggle button
toggleButton.addEventListener('click', toggleSidebar);

// Select the logout button
document.getElementById('logout').addEventListener('click', function() {
    // Redirect to the login page
    window.location.href = 'login.html';
});

// Chart.js integration for the product categories chart
const chartData = {
    labels: ["Perishable", "Non-Perishables"],
    data: [60, 40],
};

const myChart = document.querySelector(".my-chart");

new Chart(myChart, {
    type: "doughnut",
    data: {
        labels: chartData.labels,
        datasets: [{
            label: "Category Size",
            data: chartData.data
        }]
    },
    options: {
        borderRadius: 15,
        hoverBorderWidth: 0,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Fetch products on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupNotificationIcon();
});

// Fetch products from the server
function fetchProducts() {
    fetch('http://localhost:3001/api/products') // Ensure this URL matches your server setup
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(products => {
            displayProducts(products); // Pass products to display function
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            const productsContainer = document.getElementById('products-container');
            productsContainer.textContent = 'Failed to load products';
        });
}

// Display products in the UI
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = ''; // Clear the container

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('accordion-container');
        productElement.innerHTML = `
            <button class="accordion-button">${product.product_name}
                <span>+</span>
            </button>
            <div class="accordion-panel">
                <p><strong>Barcode:</strong> ${product.barcode}</p>
                <p><strong>Category:</strong> ${product.product_category}</p>
                <p><strong>Expiration Date:</strong> ${product.expiration_date ? new Date(product.expiration_date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Alert Status:</strong> ${product.alert_status}</p>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });

    // Add accordion functionality
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
                this.querySelector('span').textContent = '+';
            } else {
                panel.style.display = 'block';
                this.querySelector('span').textContent = '-';
            }
        });
    });
}

// Animate count up for statistics
function animateCountUp() {
    const counters = document.querySelectorAll('.count');

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count'); // Target number
            const current = +counter.innerText; // Current displayed number

            const increment = target / 100; // Adjust the increment speed here

            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(updateCount, 30); // Adjust the speed of animation (lower for faster)
            } else {
                counter.innerText = target; // Ensure the counter ends at the target value

                // Add the 'pop' animation class to the card after counting is done
                const card = counter.closest('.card');
                card.classList.add('pop-animation');
            }
        };
        updateCount();
    });
}

// Run the count-up animation when the page loads
document.addEventListener('DOMContentLoaded', animateCountUp);

// Fetch product counts when the page loads
const fetchProductCounts = async () => {
    try {
        const response = await fetch('/api/product-status-counts');
        const data = await response.json();
        
        // Update total products count
        document.querySelector('.total-products .count').textContent = data.totalProducts;

        // Update new products count
        document.querySelector('.new-products .count').textContent = data.newProducts;

        // Update expiring soon products count
        document.querySelector('.expiring-soon .count').textContent = data.expiringSoon;

    } catch (error) {
        console.error('Error fetching product counts:', error);
    }
};

// Call the function when the script loads
fetchProductCounts();
