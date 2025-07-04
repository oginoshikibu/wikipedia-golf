<?php

namespace Tests\Unit;

use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionTest extends TestCase
{
    use RefreshDatabase;

    public function test_question_can_be_created()
    {
        $question = Question::create([
            'title' => 'Test Question',
            'content' => 'This is a test question content',
        ]);

        $this->assertInstanceOf(Question::class, $question);
        $this->assertTrue($question->exists);
        $this->assertNotNull($question->id);
    }

    public function test_question_has_timestamps()
    {
        $question = Question::create([
            'title' => 'Test Question',
            'content' => 'This is a test question content',
        ]);

        $this->assertNotNull($question->created_at);
        $this->assertNotNull($question->updated_at);
        $this->assertInstanceOf(\Carbon\Carbon::class, $question->created_at);
        $this->assertInstanceOf(\Carbon\Carbon::class, $question->updated_at);
    }

    public function test_question_can_be_updated()
    {
        $question = Question::create([
            'title' => 'Test Question',
            'content' => 'This is a test question content',
        ]);

        $originalUpdatedAt = $question->updated_at;
        
        // Sleep to ensure timestamp difference
        sleep(1);
        
        $question->update([
            'title' => 'Updated Question',
        ]);

        $this->assertEquals('Updated Question', $question->title);
        $this->assertNotEquals($originalUpdatedAt, $question->updated_at);
    }

    public function test_question_can_be_deleted()
    {
        $question = Question::create([
            'title' => 'Test Question',
            'content' => 'This is a test question content',
        ]);

        $questionId = $question->id;
        $question->delete();

        $this->assertNull(Question::find($questionId));
    }

    public function test_question_uses_has_factory_trait()
    {
        $this->assertTrue(method_exists(Question::class, 'factory'));
    }

    public function test_question_table_name()
    {
        $question = new Question();
        $this->assertEquals('questions', $question->getTable());
    }

    public function test_question_primary_key()
    {
        $question = new Question();
        $this->assertEquals('id', $question->getKeyName());
    }

    public function test_question_incrementing_key()
    {
        $question = new Question();
        $this->assertTrue($question->getIncrementing());
    }

    public function test_question_key_type()
    {
        $question = new Question();
        $this->assertEquals('int', $question->getKeyType());
    }

    public function test_question_collection_methods()
    {
        Question::create(['title' => 'Question 1', 'content' => 'Content 1']);
        Question::create(['title' => 'Question 2', 'content' => 'Content 2']);
        Question::create(['title' => 'Question 3', 'content' => 'Content 3']);

        $questions = Question::all();
        $this->assertCount(3, $questions);
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $questions);
    }
}