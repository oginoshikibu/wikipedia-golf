<?php
declare(strict_types=1);

class MediawikiService {
    

    public function getRandomJaPagesTitles(int $pageNumbers): array {
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
            "rnlimit" => (string) $pageNumbers
        ];

        $url = $endPoint . "?" . http_build_query( $params );

        $ch = curl_init( $url );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        $output = curl_exec( $ch );
        curl_close( $ch );

        $result = json_decode( $output, true );

        // Return the response
        return $result;
    }
}


