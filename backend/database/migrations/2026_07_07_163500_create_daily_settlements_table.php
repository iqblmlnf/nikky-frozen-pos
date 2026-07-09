<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->date('date');
            $table->foreignId('closed_by_user_id')->constrained('users')->onDelete('cascade');
            $table->bigInteger('total_sales')->default(0);
            $table->bigInteger('total_expenses')->default(0);
            $table->string('status')->default('closed');
            $table->timestamps();

            // make branch+date unique
            $table->unique(['branch_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_settlements');
    }
};
