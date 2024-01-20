<?php

class MediawikiService {
    // Function to fetch data from the API
    public function fetchDataFromAPI($url) {
        // Initialize cURL
        $curl = curl_init();

        // Set the cURL options
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        // Execute the cURL request
        $response = curl_exec($curl);

        // Close cURL
        curl_close($curl);

        // Return the response
        return $response;
    }
}
