package com.athletex.ui.performance

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.athletex.databinding.ActivityPerformanceBinding

class PerformanceActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityPerformanceBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPerformanceBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // TODO: Implement performance functionality
    }
}
