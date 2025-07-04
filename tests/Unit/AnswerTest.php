<?php

namespace Tests\Unit;

use App\Models\Answer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnswerTest extends TestCase
{
    use RefreshDatabase;

    public function test_answer_can_be_created()
    {
        $answer = Answer::create([
            'content' => 'This is a test answer content',
            'question_id' => 1,
        ]);

        $this->assertInstanceOf(Answer::class, $answer);
        $this->assertTrue($answer->exists);
        $this->assertNotNull($answer->id);
    }

    public function test_answer_has_timestamps()
    {
        $answer = Answer::create([
            'content' => 'This is a test answer content',
            'question_id' => 1,
        ]);

        $this->assertNotNull($answer->created_at);
        $this->assertNotNull($answer->updated_at);
        $this->assertInstanceOf(\Carbon\Carbon::class, $answer->created_at);
        $this->assertInstanceOf(\Carbon\Carbon::class, $answer->updated_at);
    }

    public function test_answer_can_be_updated()
    {
        $answer = Answer::create([
            'content' => 'This is a test answer content',
            'question_id' => 1,
        ]);

        $originalUpdatedAt = $answer->updated_at;
        
        // Sleep to ensure timestamp difference
        sleep(1);
        
        $answer->update([
            'content' => 'Updated answer content',
        ]);

        $this->assertEquals('Updated answer content', $answer->content);
        $this->assertNotEquals($originalUpdatedAt, $answer->updated_at);
    }

    public function test_answer_can_be_deleted()
    {
        $answer = Answer::create([
            'content' => 'This is a test answer content',
            'question_id' => 1,
        ]);

        $answerId = $answer->id;
        $answer->delete();

        $this->assertNull(Answer::find($answerId));
    }

    public function test_answer_uses_has_factory_trait()
    {
        $this->assertTrue(method_exists(Answer::class, 'factory'));
    }

    public function test_answer_table_name()
    {
        $answer = new Answer();
        $this->assertEquals('answers', $answer->getTable());
    }

    public function test_answer_primary_key()
    {
        $answer = new Answer();
        $this->assertEquals('id', $answer->getKeyName());
    }

    public function test_answer_incrementing_key()
    {
        $answer = new Answer();
        $this->assertTrue($answer->getIncrementing());
    }

    public function test_answer_key_type()
    {
        $answer = new Answer();
        $this->assertEquals('int', $answer->getKeyType());
    }

    public function test_answer_collection_methods()
    {
        Answer::create(['content' => 'Answer 1', 'question_id' => 1]);
        Answer::create(['content' => 'Answer 2', 'question_id' => 1]);
        Answer::create(['content' => 'Answer 3', 'question_id' => 2]);

        $answers = Answer::all();
        $this->assertCount(3, $answers);
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $answers);
    }

    public function test_answer_where_queries()
    {
        Answer::create(['content' => 'Answer 1', 'question_id' => 1]);
        Answer::create(['content' => 'Answer 2', 'question_id' => 1]);
        Answer::create(['content' => 'Answer 3', 'question_id' => 2]);

        $questionOneAnswers = Answer::where('question_id', 1)->get();
        $this->assertCount(2, $questionOneAnswers);

        $questionTwoAnswers = Answer::where('question_id', 2)->get();
        $this->assertCount(1, $questionTwoAnswers);
    }
}