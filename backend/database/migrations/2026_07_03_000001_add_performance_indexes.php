<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->index(['branch_id', 'created_at']);
            $table->index('created_at');
        });

        Schema::table('product_stocks', function (Blueprint $table) {
            $table->index(['branch_id', 'stock']);
            $table->index(['product_id', 'branch_id']);
        });

        Schema::table('transfer_stocks', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('from_branch_id');
            $table->index('to_branch_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('expiry');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex(['branch_id', 'created_at']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('product_stocks', function (Blueprint $table) {
            $table->dropIndex(['branch_id', 'stock']);
            $table->dropIndex(['product_id', 'branch_id']);
        });

        Schema::table('transfer_stocks', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['from_branch_id']);
            $table->dropIndex(['to_branch_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['expiry']);
            $table->dropIndex(['category']);
        });
    }
};
