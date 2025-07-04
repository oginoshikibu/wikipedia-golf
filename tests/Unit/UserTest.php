<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('test@example.com', $user->email);
        $this->assertTrue($user->exists);
    }

    public function test_user_has_fillable_attributes()
    {
        $user = new User();
        $fillable = $user->getFillable();
        
        $this->assertContains('name', $fillable);
        $this->assertContains('email', $fillable);
        $this->assertContains('password', $fillable);
    }

    public function test_user_has_hidden_attributes()
    {
        $user = new User();
        $hidden = $user->getHidden();
        
        $this->assertContains('password', $hidden);
        $this->assertContains('remember_token', $hidden);
    }

    public function test_user_has_casts()
    {
        $user = new User();
        $casts = $user->getCasts();
        
        $this->assertArrayHasKey('email_verified_at', $casts);
        $this->assertArrayHasKey('password', $casts);
        $this->assertEquals('datetime', $casts['email_verified_at']);
        $this->assertEquals('hashed', $casts['password']);
    }

    public function test_user_password_is_hashed()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $this->assertTrue(\Hash::check('password123', $user->password));
        $this->assertNotEquals('password123', $user->password);
    }

    public function test_user_name_is_required()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);
    }

    public function test_user_email_is_required()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'name' => 'Test User',
            'password' => 'password123'
        ]);
    }

    public function test_user_email_must_be_unique()
    {
        User::create([
            'name' => 'Test User 1',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'name' => 'Test User 2',
            'email' => 'test@example.com',
            'password' => 'password456'
        ]);
    }

    public function test_user_can_be_updated()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $user->update([
            'name' => 'Updated User',
            'email' => 'updated@example.com'
        ]);

        $this->assertEquals('Updated User', $user->name);
        $this->assertEquals('updated@example.com', $user->email);
    }

    public function test_user_can_be_deleted()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $userId = $user->id;
        $user->delete();

        $this->assertNull(User::find($userId));
    }
}