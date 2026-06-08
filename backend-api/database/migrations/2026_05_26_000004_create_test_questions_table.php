<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('test_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->constrained('orientation_tests')->cascadeOnDelete();
            $table->text('question');
            $table->string('type')->default('single_choice');
            $table->json('options')->nullable();
            $table->unsignedSmallInteger('points')->default(0);
            $table->timestamps();

            $table->index('test_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_questions');
    }
};
