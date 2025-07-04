<?php
declare(strict_types=1);
namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;

class MediawikiService {
    
    private const WIKIPEDIA_API_ENDPOINT = 'https://ja.wikipedia.org/w/api.php';
    private const TIMEOUT_SECONDS = 10;
    
    /**
     * Get random Japanese Wikipedia page titles.
     *
     * @param int $pageNumbers Number of pages to retrieve
     * @return array Array of page titles
     * @throws Exception
     */
    public function getRandomJaWikiPagesTitles(int $pageNumbers): array {
        $result = $this->fetchRandomJaPagesDataFromMediaAPI($pageNumbers);
        
        if (!isset($result['query']['random'])) {
            throw new Exception('Invalid API response format');
        }
        
        $titles = [];
        foreach ($result['query']['random'] as $page) {
            $titles[] = $page['title'];
        }
        
        return $titles;
    }

    /**
     * Fetch random Japanese Wikipedia pages from MediaWiki API.
     *
     * @param int $pageNumbers Number of pages to retrieve
     * @return array API response data
     * @throws Exception
     */
    private function fetchRandomJaPagesDataFromMediaAPI(int $pageNumbers): array {
        /*
            get_random.php

            MediaWiki API Demos
            Demo of `Random` module: Get request to list 5 random pages.

            MIT License
        */
        $params = [
            "action" => "query",
            "format" => "json",
            "list" => "random",
            "rnlimit" => (string) $pageNumbers,
            "rnnamespace" => "0",
        ];

        $url = self::WIKIPEDIA_API_ENDPOINT . "?" . http_build_query( $params );

        $ch = curl_init( $url );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch, CURLOPT_TIMEOUT, self::TIMEOUT_SECONDS ); // Set timeout value in seconds
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, self::TIMEOUT_SECONDS); // Set connect timeout value in seconds
        curl_setopt($ch, CURLOPT_USERAGENT, 'Wikipedia Golf App/1.0');
        $output = curl_exec( $ch );

        if ($output === false) {
            $error = curl_error($ch);
            curl_close($ch);
            Log::error('MediaWiki API request failed', ['error' => $error]);
            throw new Exception('Failed to fetch data from the API: ' . $error);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close( $ch );

        if ($httpCode === 0) {
            Log::error('MediaWiki API request timed out');
            throw new Exception('Request to the API timed out.');
        }

        if ($httpCode !== 200) {
            Log::error('MediaWiki API returned non-200 status', ['status' => $httpCode]);
            throw new Exception('API returned status code: ' . $httpCode);
        }

        $result = json_decode( $output, true );

        if ($result === null) {
            Log::error('Failed to decode MediaWiki API response', ['json_error' => json_last_error_msg()]);
            throw new Exception('Failed to decode API response: ' . json_last_error_msg());
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


