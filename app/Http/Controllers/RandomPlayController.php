<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\MediawikiService;

class RandomPlayController extends Controller
{
    //

    public function index()
    {
        
        return Inertia::render('Play');
    }
}
