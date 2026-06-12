<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            [
            'name' => 'Zouhair El Mazi',
            'email' => 'zouhairmazi@gmail.com',
            'password' =>'Zouhair12345',
            'role' => 'admin',
            'status' => 'active'
            ],

            [
                'name' => 'Aymane El asri',
                'email' => 'Aymaneboss6@gmail.com',
                'password' => 'Aymane1234',
                'role' => 'admin',
                'status' => 'active',
            ],
            [
            'name' => 'Aziz Bouzrour',
            'email' => 'abdobzrr234@gmail.com',

            'password' => 'Aziz12345',
            'role' => 'admin',
            'status' => 'active',
            ],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => trim($admin['email'])],
                [
                    'name' => trim($admin['name']),
                    'password' => Hash::make($admin['password']),
                    'role' => $admin['role'],
                    'status' => $admin['status'],
                ]
            );
        }
    }
}
