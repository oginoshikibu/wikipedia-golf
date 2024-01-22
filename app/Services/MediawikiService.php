<?php

class MediawikiService {
    // Function to fetch data from the API
    public function fetchRandomJaPagesDataFromMediaAPI($pageNumbers) {
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

        // foreach( $result["query"]["random"] as $k => $v ) {
        //     echo( $v["title"] . "\n" );
        // }
        
        // Return the response
        return $result;
    }
}


