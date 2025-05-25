import React, { useState } from 'react';

import './CategorySelector.css'; // Assuming you have some CSS for styling

export interface Category {
  id: number;
  types: string;
}

interface CategorySelectorProps {
  allCategories: Category[];
  onCategoriesChange: (selectedCategories: Category[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ allCategories, onCategoriesChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(allCategories);

  const handleAddCategory = (category: Category) => {
    const newSelected = [...selectedCategories, category];
    setSelectedCategories(newSelected);
    
    const newAvailable = availableCategories.filter(c => c.id !== category.id);
    setAvailableCategories(newAvailable);
    
    onCategoriesChange(newSelected);
  };

  const handleRemoveCategory = (category: Category) => {
    const newSelected = selectedCategories.filter(c => c.id !== category.id);
    setSelectedCategories(newSelected);
    
    const newAvailable = [...availableCategories, category];
    setAvailableCategories(newAvailable);
    
    onCategoriesChange(newSelected);
  };

  return (
    <div className="category-selector">
      <div className="selected-categories">
        <h3>Selected Categories</h3>
        {selectedCategories.length === 0 ? (
          <p>No categories selected yet</p>
        ) : (
          <ul>
            {selectedCategories.map(category => (
              <li key={category.id}>
                {category.types}
                <button onClick={() => handleRemoveCategory(category)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="available-categories">
        <h3>Available Categories</h3>
        {availableCategories.length === 0 ? (
          <p>All categories selected</p>
        ) : (
          <ul>
            {availableCategories.map(category => (
              <li key={category.id}>
                {category.types}
                <button onClick={() => handleAddCategory(category)}>Add</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;