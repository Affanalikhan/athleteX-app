package com.athletex.ui.assessment

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.athletex.databinding.ActivityAssessmentBinding

class AssessmentActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityAssessmentBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAssessmentBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // TODO: Implement assessment functionality
    }
}
