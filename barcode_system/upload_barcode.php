<?php
$servername = "localhost";
$username = "root"; // XAMPP default username
$password = ""; // XAMPP default password
$dbname = "smart_stock_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if barcode is provided
if (isset($_GET['barcode'])) {
    $barcode = $conn->real_escape_string($_GET['barcode']); // Escape barcode for SQL

    // Fetch product details using Go-UPC API
    $product_details = fetchProductDetailsFromGoUPC($barcode);

    if ($product_details) {
        $product_name = $product_details['name'];
        
        // Determine product perishability based on the barcode
        $product_category = categorizeProductByBarcode($barcode);

        // Calculate expiration date based on perishability
        $expiration_date = null; // Default to null
        if (strpos($product_category, "Perishable") !== false) {
            $expiration_date = calculateExpirationDate(10, 14); // 10-14 days for perishables
        } else {
            $expiration_date = calculateExpirationDate(730, 1095); // 2 years for non-perishables
        }

        // Insert product details into the database
        $sql = "INSERT INTO products (barcode, product_name, product_category, expiration_date)
                VALUES ('$barcode', '$product_name', '$product_category', '$expiration_date')";

        if ($conn->query($sql) === TRUE) {
            echo "Product record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "No product details found for barcode: $barcode";
    }
} else {
    echo "No barcode provided.";
}

$conn->close();

// Function to fetch product details from Go-UPC API
function fetchProductDetailsFromGoUPC($barcode) {
    $api_key = "a30ac13ab0dcea9b99490ccde6479883a9a4e5eb6400decd4d83c3c9b5b123d8"; // Replace with your Go-UPC API key
    $api_url = "https://go-upc.com/api/v1/code/$barcode?key=$api_key";

    // Initialize cURL session
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        echo 'Curl error: ' . curl_error($ch); // Debugging line for cURL errors
    }
    curl_close($ch);

    // Decode the response
    $data = json_decode($response, true);

    // Debugging: Print the raw API response
    echo "API Response: " . $response . "<br>"; // Debugging line to see the raw response

    // Check if the API response contains product information
    if (isset($data['product'])) {
        return $data['product']; // Return the entire product array
    } else {
        // Debugging: Check the entire response for errors
        echo "Error fetching product details: " . json_encode($data) . "<br>"; // Output the whole response
        return null;
    }
}

// Function to categorize products based on barcode
function categorizeProductByBarcode($barcode) {
    // Extract product code from barcode (assuming EAN-13 format)
    $product_code = substr($barcode, 6, 5); // Extract digits 7 to 11

    // Categorize product based on product code
    if ($product_code == "86422" || $product_code == "84621" || $product_code == "0803" ||
        $product_code == "0904" || $product_code == "0905" || $product_code == "0906" ||
        $product_code == "0907" || $product_code == "0908" || $product_code == "0909" ||
        $product_code == "0910" || $product_code == "0401" || $product_code == "0404" ||
        $product_code == "0406" || $product_code == "0702" || $product_code == "0705" ||
        $product_code == "0707" || $product_code == "0708" || $product_code == "0709" ||
        $product_code == "0710" || $product_code == "0711" || $product_code == "0712" ||
        $product_code == "0703" || $product_code == "0704" || $product_code == "0402" ||
        $product_code == "0403") {
        return "Perishable";
    }
    return "Non-perishable"; // Default if no match
}

// Function to calculate the expiration date
function calculateExpirationDate($minDays, $maxDays) {
    $current_date = new DateTime();
    // Generate a random interval between minDays and maxDays
    $interval = new DateInterval('P' . rand($minDays, $maxDays) . 'D'); 
    $current_date->add($interval);
    return $current_date->format('Y-m-d');
}
?>
