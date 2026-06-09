<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('test_questions', function (Blueprint $table) {
            $table->text('question_fr')->nullable()->after('question');
            $table->text('question_ar')->nullable()->after('question_fr');
            $table->json('options_fr')->nullable()->after('options');
            $table->json('options_ar')->nullable()->after('options_fr');
        });
    }

    public function down(): void
    {
        Schema::table('test_questions', function (Blueprint $table) {
            $table->dropColumn(['question_fr', 'question_ar', 'options_fr', 'options_ar']);
        });
    }
};
