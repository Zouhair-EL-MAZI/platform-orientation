<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tracks a single user completing a test session.
     * Allows retakes (the row is updated via updateOrCreate).
     * Decouples "did user finish test?" from individual TestAnswer rows.
     */
    public function up(): void
    {
        Schema::create('test_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('test_id')->constrained('orientation_tests')->cascadeOnDelete();
            $table->unsignedSmallInteger('total_score')->default(0);
            $table->json('score_breakdown')->nullable(); // {question_id: score, ...}
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // One submission record per user+test (upserted on retake)
            $table->unique(['user_id', 'test_id']);
            $table->index('completed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_submissions');
    }
};
