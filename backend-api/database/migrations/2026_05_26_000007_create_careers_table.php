<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('careers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('career_categories')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('salary_range')->nullable();
            $table->json('required_skills')->nullable();
            $table->text('future_scope')->nullable();
            $table->string('image')->nullable();

            // Moroccan context fields
            $table->text('moroccan_context')->nullable();
            $table->json('study_paths')->nullable();
            $table->json('recommended_schools')->nullable();
            $table->string('demand_level', 30)->nullable();

            $table->timestamps();

            $table->index('category_id');
            $table->index('title');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('careers');
    }
};
