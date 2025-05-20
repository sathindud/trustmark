import axios from "axios";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  types: string;
}

function CategoryComponent() {
  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/home/categories");
      setCategories(response.data);
    } catch (error) {}
  };

  return (
    <div className=" ">
      <h1 className="font-bold text-2xl font-roboto">
        What are you looking for?
      </h1>
      <div className="mt-5 flex flex-wrap gap-4">
        {categories &&
          categories.map((category: any) => (
            <div
              key={category.id}
              className="min-w-fit py-3 px-5 border-1 border-gray-400  rounded-3xl cursor-pointer"
              onClick={() => {
                window.location.href = `/search?keyword=${category.types}`;
              }}
            >
              <p>{category.types}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
export default CategoryComponent;
