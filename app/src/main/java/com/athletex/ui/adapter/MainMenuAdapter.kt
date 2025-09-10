package com.athletex.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.athletex.databinding.ItemMainMenuBinding
import com.athletex.ui.model.MenuItem

class MainMenuAdapter(
    private val menuItems: List<MenuItem>,
    private val onItemClick: (MenuItem) -> Unit
) : RecyclerView.Adapter<MainMenuAdapter.MenuViewHolder>() {

    inner class MenuViewHolder(private val binding: ItemMainMenuBinding) : 
        RecyclerView.ViewHolder(binding.root) {
        
        fun bind(menuItem: MenuItem) {
            binding.menuTitle.text = menuItem.title
            binding.menuDescription.text = menuItem.description
            binding.menuIcon.setImageResource(menuItem.iconRes)
            
            binding.root.setOnClickListener {
                onItemClick(menuItem)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MenuViewHolder {
        val binding = ItemMainMenuBinding.inflate(
            LayoutInflater.from(parent.context), 
            parent, 
            false
        )
        return MenuViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MenuViewHolder, position: Int) {
        holder.bind(menuItems[position])
    }

    override fun getItemCount(): Int = menuItems.size
}
