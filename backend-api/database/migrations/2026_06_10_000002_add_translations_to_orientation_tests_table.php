<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orientation_tests', function (Blueprint $table) {
            $table->string('title_fr')->nullable()->after('title');
            $table->string('title_ar')->nullable()->after('title_fr');
            $table->text('description_fr')->nullable()->after('description');
            $table->text('description_ar')->nullable()->after('description_fr');
        });
    }

    public function down(): void
    {
        Schema::table('orientation_tests', function (Blueprint $table) {
            $table->dropColumn(['title_fr', 'title_ar', 'description_fr', 'description_ar']);
        });
    }
};
