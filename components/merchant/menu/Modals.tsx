import React, { useState } from 'react'
import EditDishModal from './modal/EditDishModal'
import AddDishModal from './modal/AddDishModal'
import EditCategoryModal from './modal/EditCategoryModal'
import AddCategoryModal from './modal/AddCategoryModal'
import LinkOptionGroupModal from './modal/LinkOptionGroupModal'
import EditOptionGroupModal from './modal/EditOptionGroupModal'

// Define interfaces
interface Option {
  name: string;
  price: string;
}

interface OptionGroup {
  groupName: string;
  options: Option[];
}

interface Dish {
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
  optionGroups: OptionGroup[];
  category: string;
}

interface Category {
  name: string;
  count: number;
  dishes: Dish[];
}

interface ModalProps {
  showEditModal: boolean;
  setShowEditModal: (value: boolean) => void;
  showEditCategoryModal: boolean;
  setShowEditCategoryModal: (value: boolean) => void;
  showEditOptionGroupModal: boolean;
  setShowEditOptionGroupModal: (value: boolean) => void;
  showAddDishModal: boolean;
  setShowAddDishModal: (value: boolean) => void;
  showAddCategoryModal: boolean;
  setShowAddCategoryModal: (value: boolean) => void;
  selectedDish: { categoryIndex: number; dishIndex: number } | null;
  setSelectedDish: (value: { categoryIndex: number; dishIndex: number } | null) => void;
  selectedCategory: number | null;
  setSelectedCategory: (value: number | null) => void;
  selectedOptionGroup: number | null;
  setSelectedOptionGroup: (value: number | null) => void;
  editDishData: Dish;
  setEditDishData: (value: Dish) => void;
  editCategoryName: string;
  setEditCategoryName: (value: string) => void;
  editOptionGroupData: OptionGroup;
  setEditOptionGroupData: (value: OptionGroup) => void;
  addDishData: Dish;
  setAddDishData: (value: Dish) => void;
  addCategoryName: string;
  setAddCategoryName: (value: string) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  optionGroups: OptionGroup[];
  setOptionGroups: React.Dispatch<React.SetStateAction<OptionGroup[]>>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  permissionDenied: boolean;
  setPermissionDenied: (value: boolean) => void;
}

const Modals: React.FC<ModalProps> = (props) => {
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [selectedCategoryForLink, setSelectedCategoryForLink] = useState<string>('');

  return (
    <>
      <EditDishModal {...props} showLinkModal={showLinkModal} setShowLinkModal={setShowLinkModal} />
      <AddDishModal {...props} />
      <EditCategoryModal {...props} />
      <AddCategoryModal {...props} />
      <LinkOptionGroupModal
        {...props}
        showLinkModal={showLinkModal}
        setShowLinkModal={setShowLinkModal}
        selectedCategoryForLink={selectedCategoryForLink}
        setSelectedCategoryForLink={setSelectedCategoryForLink}
      />
      <EditOptionGroupModal {...props} />
    </>
  );
};

export default Modals;