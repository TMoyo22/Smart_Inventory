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



// Fetch and display products
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

function fetchProducts() {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(products => displayProducts(products))
        .catch(error => {
            console.error('Error fetching products:', error);
            const productsContainer = document.getElementById('products-container');
            productsContainer.textContent = 'Failed to load products';
        });
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = ''; // Clear the container

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card');
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.id}</p>
            <p>Category: ${product.category}</p>
            <p>Expiration Date: ${new Date(product.expiration_date).toLocaleDateString()}</p>
            <p>Alert Status: ${product.alert_status}</p>
        `;
        productsContainer.appendChild(productElement); // Append each product card
    });
}
