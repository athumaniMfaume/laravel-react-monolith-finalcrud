<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Auth::user()->posts()->latest();
        if ($request->has('search') && $request->search != null) {
            $query->whereAny(['title', 'content'], 'like', '%'.$request->search.'%');
        }


        $posts = $query->paginate(5);
        return Inertia::render('posts/Index', compact('posts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('posts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'status' => ['required', 'string'],
            'category' => ['required', 'string'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg, jpg, png, gif, svg'],
        ]);

        $file = $request->file('image');
        $filepath = $file->store('posts','public');

        Post::create([
            'user_id'=>Auth::user()->id,
            'title'=>$request->title,
            'content'=>$request->content,
            'slug'=> Str::slug($request->title),
            'status'=>$request->status,
            'category'=>$request->category,
            'image'=>$filepath,
        ]);

        return redirect()->route('posts.index')->with('message','post added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return Inertia::render('posts/Edit',[
            'postData'=>$post,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'status' => ['required', 'string'],
            'category' => ['required', 'string'],
            'image' => ['nullable', 'image', 'max:2048', 'mimes:jpeg, jpg, png, gif, svg'],
        ]);

        $filepath = $post->image;

        if ($request->has('image') && $request->image != null) {
            $file = $request->file('image');
            $filepath = $file->store('posts','public');
            Storage::disk('public')->delete($post->image);

        }

        $post->update([
            'user_id'=>Auth::user()->id,
            'title'=>$request->title,
            'content'=>$request->content,
            'slug'=> Str::slug($request->title),
            'status'=>$request->status,
            'category'=>$request->category,
            'image'=>$filepath,
        ]);

        return redirect()->route('posts.index')->with('message','post updated successfully');


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return redirect()->route('posts.index')->with('message','post deleted successfully');

    }
}
