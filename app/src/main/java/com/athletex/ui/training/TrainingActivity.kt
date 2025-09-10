package com.athletex.ui.training

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.athletex.databinding.ActivityTrainingBinding

class TrainingActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityTrainingBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTrainingBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // TODO: Implement training functionality
    }
}
