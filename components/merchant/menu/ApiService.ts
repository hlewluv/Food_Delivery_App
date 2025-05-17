// Các API để xử lý danh mục (categories)
export const fetchCategories = async () => {
  try {
    // Trong trường hợp thực tế, bạn sẽ gọi API từ server
    // Dữ liệu mẫu cho các danh mục
    return [
      {
        name: 'Đặc sản/Món khó',
        count: 2,
        dishes: [
          {
            name: 'LẬP XƯỞNG TƯƠI',
            description: 'Chính sự mới mẻ',
            price: '115,000đ',
            available: true,
            image:
              'https://cdn.tgdd.vn/2021/06/CookProduct/com-la-gi-cach-bao-quan-com-tuoi-mua-com-lang-vong-o-dau-ngon-thumb-chu-nhat-1200x676.jpg',
            optionGroups: [],
          },
          {
            name: 'MÓN THỨ 2',
            description: 'Mô tả món thứ 2',
            price: '95,000đ',
            available: true,
            image:
              'https://cdn.tgdd.vn/2021/06/CookProduct/com-la-gi-cach-bao-quan-com-tuoi-mua-com-lang-vong-o-dau-ngon-thumb-chu-nhat-1200x676.jpg',
            optionGroups: [],
          },
        ],
      },
      {
        name: 'Ăn Vặt',
        count: 2,
        dishes: [
          {
            name: 'KHOAI TÂY CHIÊN',
            description: 'Giòn rụm',
            price: '25,000đ',
            available: true,
            image:
              'https://cdn.tgdd.vn/2021/06/CookProduct/com-la-gi-cach-bao-quan-com-tuoi-mua-com-lang-vong-o-dau-ngon-thumb-chu-nhat-1200x676.jpg',
            optionGroups: [],
          },
          {
            name: 'BÁNH MÌ QUE',
            description: 'Nóng giòn',
            price: '15,000đ',
            available: true,
            image:
              'https://cdn.tgdd.vn/2021/06/CookProduct/com-la-gi-cach-bao-quan-com-tuoi-mua-com-lang-vong-o-dau-ngon-thumb-chu-nhat-1200x676.jpg',
            optionGroups: [],
          },
        ],
      },
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const addCategory = async (categoryName: string) => {
  try {
    // Kiểm tra xem danh mục đã tồn tại hay chưa
    const categories = await fetchCategories();
    const existingCategory = categories.find(cat => cat.name === categoryName);
    
    if (existingCategory) {
      throw new Error('Danh mục đã tồn tại');
    }
    
    // Tạo danh mục mới
    const newCategory = {
      name: categoryName,
      count: 0,
      dishes: [],
    };
    
    // Thêm vào danh sách
    categories.push(newCategory);
    
    // Trong thực tế, bạn sẽ gửi POST request tới server để lưu danh mục mới
    
    return {
      success: true,
      categories,
    };
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error(error.message || 'Failed to add category');
  }
};

export const updateCategory = async (categoryIndex, newCategoryName) => {
  try {
    // Lấy danh sách danh mục hiện tại
    const categories = await fetchCategories();
    
    // Kiểm tra xem danh mục có tồn tại không
    if (categoryIndex < 0 || categoryIndex >= categories.length) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Kiểm tra xem tên danh mục mới đã tồn tại hay chưa
    const existingCategory = categories.find(cat => cat.name === newCategoryName && categories.indexOf(cat) !== categoryIndex);
    if (existingCategory) {
      throw new Error('Tên danh mục đã tồn tại');
    }
    
    // Cập nhật tên danh mục
    categories[categoryIndex].name = newCategoryName;
    
    // Trong thực tế, bạn sẽ gửi PUT request tới server để cập nhật danh mục
    
    return {
      success: true,
      categories,
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error(error.message || 'Failed to update category');
  }
};

export const deleteCategory = async (categoryIndex) => {
  try {
    // Lấy danh sách danh mục hiện tại
    const categories = await fetchCategories();
    
    // Kiểm tra xem danh mục có tồn tại không
    if (categoryIndex < 0 || categoryIndex >= categories.length) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Xóa danh mục
    categories.splice(categoryIndex, 1);
    
    // Trong thực tế, bạn sẽ gửi DELETE request tới server để xóa danh mục
    
    return {
      success: true,
      categories,
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};

// Các API để xử lý món ăn (dishes)
export const addDish = async (newDish) => {
  try {
    // Chuẩn bị dữ liệu món ăn
    const formattedDish = {
      name: newDish.name,
      description: newDish.description || '',
      price: `${newDish.price}đ`,
      available: true,
      image: newDish.image || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
      optionGroups: newDish.optionGroups || [],
    };

    // Lấy danh sách danh mục hiện tại
    const categories = await fetchCategories();
    
    // Tìm danh mục để thêm món ăn vào
    let category = categories.find(cat => cat.name === newDish.category);
    
    // Nếu danh mục không tồn tại, tạo mới
    if (!category) {
      category = {
        name: newDish.category,
        count: 0,
        dishes: [],
      };
      categories.push(category);
    }

    // Thêm món ăn vào danh mục
    category.dishes.push(formattedDish);
    
    // Cập nhật số lượng món ăn trong danh mục
    category.count = category.dishes.length;

    // Trong thực tế, bạn sẽ gửi POST request tới server để lưu món ăn mới

    return {
      success: true,
      categories,
      dish: formattedDish,
    };
  } catch (error) {
    console.error('Error adding dish:', error);
    throw new Error('Failed to add dish');
  }
};

export const updateDish = async (categoryIndex, dishIndex, updatedDishData) => {
  try {
    // Lấy danh sách danh mục hiện tại
    const categories = await fetchCategories();
    
    // Kiểm tra xem danh mục có tồn tại không
    if (categoryIndex < 0 || categoryIndex >= categories.length) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Kiểm tra xem món ăn có tồn tại không
    const category = categories[categoryIndex];
    if (dishIndex < 0 || dishIndex >= category.dishes.length) {
      throw new Error('Không tìm thấy món ăn');
    }
    
    // Cập nhật thông tin món ăn
    categories[categoryIndex].dishes[dishIndex] = {
      ...categories[categoryIndex].dishes[dishIndex],
      ...updatedDishData,
    };
    
    // Trong thực tế, bạn sẽ gửi PUT request tới server để cập nhật món ăn
    
    return {
      success: true,
      categories,
      dish: categories[categoryIndex].dishes[dishIndex],
    };
  } catch (error) {
    console.error('Error updating dish:', error);
    throw new Error('Failed to update dish');
  }
};

export const deleteDish = async (categoryIndex, dishIndex) => {
  try {
    // Lấy danh sách danh mục hiện tại
    const categories = await fetchCategories();
    
    // Kiểm tra xem danh mục có tồn tại không
    if (categoryIndex < 0 || categoryIndex >= categories.length) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Kiểm tra xem món ăn có tồn tại không
    const category = categories[categoryIndex];
    if (dishIndex < 0 || dishIndex >= category.dishes.length) {
      throw new Error('Không tìm thấy món ăn');
    }
    
    // Xóa món ăn
    category.dishes.splice(dishIndex, 1);
    
    // Cập nhật số lượng món ăn trong danh mục
    category.count = category.dishes.length;
    
    // Trong thực tế, bạn sẽ gửi DELETE request tới server để xóa món ăn
    
    return {
      success: true,
      categories,
    };
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Failed to delete dish');
  }
};

export const toggleDishAvailability = async (categoryIndex, dishIndex) => {
  try {
    // Lấy danh sách danh mục hiện tại
    const categories = await fetchCategories();
    
    // Kiểm tra xem danh mục có tồn tại không
    if (categoryIndex < 0 || categoryIndex >= categories.length) {
      throw new Error('Không tìm thấy danh mục');
    }
    
    // Kiểm tra xem món ăn có tồn tại không
    const category = categories[categoryIndex];
    if (dishIndex < 0 || dishIndex >= category.dishes.length) {
      throw new Error('Không tìm thấy món ăn');
    }
    
    // Đảo trạng thái available
    const dish = category.dishes[dishIndex];
    dish.available = !dish.available;
    
    // Trong thực tế, bạn sẽ gửi PUT request tới server để cập nhật trạng thái món ăn
    
    return {
      success: true,
      categories,
      dish,
    };
  } catch (error) {
    console.error('Error toggling dish availability:', error);
    throw new Error('Failed to toggle dish availability');
  }
};

// Các API để xử lý nhóm tùy chọn (option groups)
export const fetchOptionGroups = async () => {
  try {
    // Trong trường hợp thực tế, bạn sẽ gọi API từ server
    // Dữ liệu mẫu cho các nhóm tùy chọn
    return [
      {
        groupName: 'Yu con',
        options: [
          { name: 'nam anh', price: '10000' },
          { name: 'aiu', price: '50000' },
        ],
      },
    ];
  } catch (error) {
    console.error('Error fetching option groups:', error);
    throw new Error('Failed to fetch option groups');
  }
};

export const addOptionGroup = async (optionGroupData) => {
  try {
    // Lấy danh sách nhóm tùy chọn hiện tại
    const optionGroups = await fetchOptionGroups();
    
    // Kiểm tra xem nhóm tùy chọn đã tồn tại hay chưa
    const existingGroup = optionGroups.find(group => group.groupName === optionGroupData.groupName);
    if (existingGroup) {
      throw new Error('Nhóm tùy chọn đã tồn tại');
    }
    
    // Lọc các tùy chọn không hợp lệ (không có tên hoặc giá)
    const formattedOptions = optionGroupData.options.filter(opt => opt.name && opt.price);
    
    // Tạo nhóm tùy chọn mới
    const newOptionGroup = {
      groupName: optionGroupData.groupName,
      options: formattedOptions,
    };
    
    // Thêm vào danh sách
    optionGroups.push(newOptionGroup);
    
    // Trong thực tế, bạn sẽ gửi POST request tới server để lưu nhóm tùy chọn mới
    
    return {
      success: true,
      optionGroups,
    };
  } catch (error) {
    console.error('Error adding option group:', error);
    throw new Error(error.message || 'Failed to add option group');
  }
};

export const updateOptionGroup = async (groupIndex, updatedGroupData) => {
  try {
    // Lấy danh sách nhóm tùy chọn hiện tại
    const optionGroups = await fetchOptionGroups();
    
    // Kiểm tra xem nhóm tùy chọn có tồn tại không
    if (groupIndex < 0 || groupIndex >= optionGroups.length) {
      throw new Error('Không tìm thấy nhóm tùy chọn');
    }
    
    // Kiểm tra xem tên nhóm tùy chọn mới đã tồn tại hay chưa
    const existingGroup = optionGroups.find(
      group => group.groupName === updatedGroupData.groupName && optionGroups.indexOf(group) !== groupIndex
    );
    if (existingGroup) {
      throw new Error('Tên nhóm tùy chọn đã tồn tại');
    }
    
    // Lọc các tùy chọn không hợp lệ (không có tên hoặc giá)
    const formattedOptions = updatedGroupData.options.filter(opt => opt.name && opt.price);
    
    // Cập nhật thông tin nhóm tùy chọn
    optionGroups[groupIndex] = {
      groupName: updatedGroupData.groupName,
      options: formattedOptions,
    };
    
    // Trong thực tế, bạn sẽ gửi PUT request tới server để cập nhật nhóm tùy chọn
    
    return {
      success: true,
      optionGroups,
    };
  } catch (error) {
    console.error('Error updating option group:', error);
    throw new Error(error.message || 'Failed to update option group');
  }
};

export const deleteOptionGroup = async (groupIndex) => {
  try {
    // Lấy danh sách nhóm tùy chọn hiện tại
    const optionGroups = await fetchOptionGroups();
    
    // Kiểm tra xem nhóm tùy chọn có tồn tại không
    if (groupIndex < 0 || groupIndex >= optionGroups.length) {
      throw new Error('Không tìm thấy nhóm tùy chọn');
    }
    
    // Xóa nhóm tùy chọn
    optionGroups.splice(groupIndex, 1);
    
    // Trong thực tế, bạn sẽ gửi DELETE request tới server để xóa nhóm tùy chọn
    
    return {
      success: true,
      optionGroups,
    };
  } catch (error) {
    console.error('Error deleting option group:', error);
    throw new Error('Failed to delete option group');
  }
};