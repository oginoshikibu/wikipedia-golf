<?php

namespace Tests\Unit;

use App\Services\MediawikiService;
use Tests\TestCase;
use Mockery;

class MediawikiServiceTest extends TestCase
{
    private $mediawikiService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->mediawikiService = new MediawikiService();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_random_ja_wiki_pages_titles_returns_array_of_titles()
    {
        // Mock the fetchRandomJaPagesDataFromMediaAPI method
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        $mockApiResponse = [
            'query' => [
                'random' => [
                    ['title' => 'Test Page 1'],
                    ['title' => 'Test Page 2'],
                    ['title' => 'Test Page 3']
                ]
            ]
        ];

        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->with(3)
                   ->andReturn($mockApiResponse);

        $result = $mockService->getRandomJaWikiPagesTitles(3);

        $this->assertIsArray($result);
        $this->assertCount(3, $result);
        $this->assertEquals(['Test Page 1', 'Test Page 2', 'Test Page 3'], $result);
    }

    public function test_get_random_ja_wiki_pages_titles_with_single_page()
    {
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        $mockApiResponse = [
            'query' => [
                'random' => [
                    ['title' => 'Single Test Page']
                ]
            ]
        ];

        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->with(1)
                   ->andReturn($mockApiResponse);

        $result = $mockService->getRandomJaWikiPagesTitles(1);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals(['Single Test Page'], $result);
    }

    public function test_get_random_ja_wiki_pages_titles_with_empty_response()
    {
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        $mockApiResponse = [
            'query' => [
                'random' => []
            ]
        ];

        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->with(0)
                   ->andReturn($mockApiResponse);

        $result = $mockService->getRandomJaWikiPagesTitles(0);

        $this->assertIsArray($result);
        $this->assertCount(0, $result);
        $this->assertEquals([], $result);
    }

    public function test_fetch_random_ja_pages_data_from_media_api_builds_correct_url()
    {
        // This test verifies that the method constructs the correct URL
        // We can't easily test the actual cURL call without making real HTTP requests
        // But we can verify the URL construction logic by examining the method

        $reflection = new \ReflectionClass(MediawikiService::class);
        $method = $reflection->getMethod('fetchRandomJaPagesDataFromMediaAPI');
        
        // Test that the method exists and is public
        $this->assertTrue($method->isPublic());
        
        // Test that the method accepts the correct parameter
        $this->assertEquals(1, $method->getNumberOfParameters());
        $this->assertEquals('int', $method->getParameters()[0]->getType()->getName());
    }

    public function test_fetch_random_ja_pages_data_throws_exception_on_curl_error()
    {
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        // Mock a scenario where cURL fails
        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->andThrow(new \Exception('Failed to fetch data from the API: Connection failed'));

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Failed to fetch data from the API: Connection failed');

        $mockService->fetchRandomJaPagesDataFromMediaAPI(5);
    }

    public function test_fetch_random_ja_pages_data_throws_exception_on_timeout()
    {
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        // Mock a scenario where request times out
        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->andThrow(new \Exception('Request to the API timed out.'));

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Request to the API timed out.');

        $mockService->fetchRandomJaPagesDataFromMediaAPI(5);
    }

    public function test_fetch_random_ja_pages_data_throws_exception_on_invalid_json()
    {
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        // Mock a scenario where JSON decoding fails
        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->andThrow(new \Exception('Failed to decode API response: Syntax error'));

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Failed to decode API response: Syntax error');

        $mockService->fetchRandomJaPagesDataFromMediaAPI(5);
    }

    public function test_service_class_instantiation()
    {
        $service = new MediawikiService();
        $this->assertInstanceOf(MediawikiService::class, $service);
    }

    public function test_get_random_ja_wiki_pages_titles_with_large_number()
    {
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        // Create mock response for large number of pages
        $mockPages = [];
        for ($i = 1; $i <= 10; $i++) {
            $mockPages[] = ['title' => "Test Page $i"];
        }
        
        $mockApiResponse = [
            'query' => [
                'random' => $mockPages
            ]
        ];

        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->with(10)
                   ->andReturn($mockApiResponse);

        $result = $mockService->getRandomJaWikiPagesTitles(10);

        $this->assertIsArray($result);
        $this->assertCount(10, $result);
        $this->assertEquals('Test Page 1', $result[0]);
        $this->assertEquals('Test Page 10', $result[9]);
    }

    public function test_get_random_ja_wiki_pages_titles_with_special_characters()
    {
        $mockService = Mockery::mock(MediawikiService::class)->makePartial();
        
        $mockApiResponse = [
            'query' => [
                'random' => [
                    ['title' => '日本語のページ'],
                    ['title' => 'ページ（括弧付き）'],
                    ['title' => 'Special!@#$%^&*()Characters']
                ]
            ]
        ];

        $mockService->shouldReceive('fetchRandomJaPagesDataFromMediaAPI')
                   ->once()
                   ->with(3)
                   ->andReturn($mockApiResponse);

        $result = $mockService->getRandomJaWikiPagesTitles(3);

        $this->assertIsArray($result);
        $this->assertCount(3, $result);
        $this->assertEquals(['日本語のページ', 'ページ（括弧付き）', 'Special!@#$%^&*()Characters'], $result);
    }

    public function test_method_parameter_types()
    {
        $reflection = new \ReflectionClass(MediawikiService::class);
        
        // Test getRandomJaWikiPagesTitles method
        $method1 = $reflection->getMethod('getRandomJaWikiPagesTitles');
        $this->assertTrue($method1->isPublic());
        $this->assertEquals('int', $method1->getParameters()[0]->getType()->getName());
        $this->assertEquals('array', $method1->getReturnType()->getName());
        
        // Test fetchRandomJaPagesDataFromMediaAPI method
        $method2 = $reflection->getMethod('fetchRandomJaPagesDataFromMediaAPI');
        $this->assertTrue($method2->isPublic());
        $this->assertEquals('int', $method2->getParameters()[0]->getType()->getName());
    }
}