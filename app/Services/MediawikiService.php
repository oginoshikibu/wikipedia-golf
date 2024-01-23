<?php
declare(strict_types=1);
namespace App\Services;

class MediawikiService {
    

    public function getRandomJaWikiPagesTitles(int $pageNumbers): array {
        $result = $this->fetchRandomJaPagesDataFromMediaAPI($pageNumbers);
        $titles = array();
        foreach( $result["query"]["random"] as $k => $v ) {
            array_push($titles, $v["title"]);
        }
        return $titles;
    }

    // Function to fetch data from the API
    public function fetchRandomJaPagesDataFromMediaAPI(int $pageNumbers) {
        /*
            get_random.php

            MediaWiki API Demos
            Demo of `Random` module: Get request to list 5 random pages.

            MIT License
        */
        $endPoint = "https://ja.wikipedia.org/w/api.php";
        $params = [
            "action" => "query",
            "format" => "json",
            "list" => "random",
            "rnlimit" => (string) $pageNumbers,
            "rnnamespace" => "0",
        ];

        $url = $endPoint . "?" . http_build_query( $params );

        $ch = curl_init( $url );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch, CURLOPT_TIMEOUT, 10 ); // Set timeout value in seconds
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); // Set connect timeout value in seconds
        $output = curl_exec( $ch );

        if ($output === false) {
            throw new \Exception('Failed to fetch data from the API: ' . curl_error($ch));
        }

        if (curl_getinfo($ch, CURLINFO_HTTP_CODE) === 0) {
            throw new \Exception('Request to the API timed out.');
        }

        curl_close( $ch );

        $result = json_decode( $output, true );

        if ($result === null) {
            throw new \Exception('Failed to decode API response: ' . json_last_error_msg());
        }

        return $result;
    }
}

if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    // test code 
    $time_start = microtime(true);
    $mediawikiService = new MediawikiService();
    $titles = $mediawikiService->getRandomJaWikiPagesTitles(5);
    $time_end = microtime(true);
    var_dump($titles);
    var_dump($time_end - $time_start);
}


