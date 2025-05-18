import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Schedule, Staff, getCurrentDay, summarizeSchedule } from '@/components/merchant/staff/types';

interface StaffListProps {
  staffList: Staff[];
  filterDay: keyof Schedule | 'all';
  isLoading: boolean;
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>;
  setSelectedStaff: (staff: Staff | null) => void;
  setShowEditStaffModal: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setTableRenderKey: (value: number) => void;
}

const StaffList: React.FC<StaffListProps> = ({
  staffList,
  filterDay,
  isLoading,
  setStaffList,
  setSelectedStaff,
  setShowEditStaffModal,
  setIsLoading,
  setTableRenderKey,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const filteredStaff = useMemo(() => {
    const result =
      filterDay === 'all'
        ? staffList
        : staffList.filter((staff) => staff.schedule[filterDay as keyof Schedule] !== 'Nghỉ');
    console.log('Computed filteredStaff:', result);
    return result;
  }, [staffList, filterDay]);

  const screenWidth = Dimensions.get('window').width;
  const tableWidth = screenWidth * 0.98;

  const openEditModal = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowEditStaffModal(true);
  };

  const toggleLeaveStatus = (staff: Staff) => {
    const currentDay = getCurrentDay();
    if (
      staff.status !== 'approved' ||
      !staff.schedule[currentDay] ||
      staff.schedule[currentDay] === 'Nghỉ'
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const newWorkStatus =
        staff.workStatus === 'on-leave'
          ? staff.schedule[currentDay] && staff.schedule[currentDay] !== 'Nghỉ'
            ? 'working'
            : 'no-schedule'
          : 'on-leave';
      const updatedStaff = { ...staff, workStatus: newWorkStatus };
      setStaffList((prev) => prev.map((s) => (s.id === staff.id ? updatedStaff : s)));
    } catch (error) {
      console.error('Error toggling leave status:', error);
      Alert.alert('Lỗi', 'Không thể thay đổi trạng thái. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = (staff: Staff) => {
    console.log(`Delete button pressed for ${staff.name} (ID: ${staff.id})`);
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const confirmDeleteStaff = () => {
    if (!staffToDelete) return;
    console.log('Delete confirmed for:', staffToDelete.id);
    setIsLoading(true);
    try {
      setStaffList((prev) => {
        const updatedList = prev.filter((s) => s.id !== staffToDelete.id);
        console.log(`Deleted staff: ${staffToDelete.name} (ID: ${staffToDelete.id})`);
        console.log('Updated staffList:', updatedList);
        return updatedList;
      });
      setTableRenderKey((prev) => prev + 1);
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (error) {
      console.error('Error deleting staff:', error);
    } finally {
      setTimeout(() => {
        console.log('Clearing isLoading after delete');
        setIsLoading(false);
      }, 100);
    }
  };

  const renderStaffItem = ({ item: staff }: { item: Staff }) => {
    const currentDay = getCurrentDay();
    const workStatus =
      staff.workStatus === 'on-leave'
        ? 'on-leave'
        : staff.schedule[currentDay] && staff.schedule[currentDay] !== 'Nghỉ'
        ? 'working'
        : 'no-schedule';
    const canToggleStatus =
      staff.status === 'approved' &&
      staff.schedule[currentDay] &&
      staff.schedule[currentDay] !== 'Nghỉ';
    return (
      <View
        key={staff.id}
        className={`flex-row ${
          staff.status === 'pending' ? 'bg-yellow-50' : 'bg-white'
        } border-b border-gray-200 items-center`}
      >
        <Text className="w-20 p-3 text-gray-600 text-center">{staff.id}</Text>
        <Text className="w-36 p-3 text-gray-600 text-center">{staff.name}</Text>
        <View className="w-20 p-3 flex items-center justify-center">
          <Image
            source={{ uri: staff.image || 'https://via.placeholder.com/40x40' }}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
        </View>
        <Text className="w-28 p-3 text-gray-600 text-center">
          {staff.role === 'waiter'
            ? 'Phục vụ'
            : staff.role === 'chef'
            ? 'Đầu bếp'
            : staff.role === 'cashier'
            ? 'Thu ngân'
            : 'Quản lý'}
        </Text>
        <Text className="w-36 p-3 text-gray-600 text-center">{staff.phone}</Text>
        <Text className="w-72 p-3 text-gray-600 text-center">{summarizeSchedule(staff.schedule)}</Text>
        <TouchableOpacity
          onPress={() => toggleLeaveStatus(staff)}
          disabled={!canToggleStatus || isLoading}
          className="w-36 p-3 flex-row justify-center"
          accessibilityLabel={`Thay đổi trạng thái cho ${staff.name}`}
        >
          <Text
            className={`text-center ${
              workStatus === 'working'
                ? 'text-green-600'
                : workStatus === 'on-leave'
                ? 'text-blue-600'
                : 'text-red-600'
            } ${canToggleStatus && !isLoading ? 'underline' : ''}`}
          >
            {workStatus === 'working'
              ? 'Đang làm'
              : workStatus === 'on-leave'
              ? 'Nghỉ có phép'
              : 'Không có lịch'}
          </Text>
        </TouchableOpacity>
        <View className="w-56 p-3 flex-row justify-center">
          <TouchableOpacity
            onPress={() => openEditModal(staff)}
            className="bg-[#00b14f] px-2 py-1 rounded mr-1"
            disabled={isLoading}
            accessibilityLabel={`Chỉnh sửa nhân viên ${staff.name}`}
          >
            <Text className="text-white text-xs">Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteStaff(staff)}
            className="bg-red-500 px-2 py-1 rounded mr-1"
            disabled={isLoading}
            accessibilityLabel={`Xóa nhân viên ${staff.name}`}
          >
            <Text className="text-white text-xs">Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width: tableWidth }}>
          <View className="flex-row bg-gray-100 border-b border-gray-300">
            <Text className="w-20 p-3 font-semibold text-gray-700 text-center">ID</Text>
            <Text className="w-36 p-3 font-semibold text-gray-700 text-center">Tên</Text>
            <Text className="w-20 p-3 font-semibold text-gray-700 text-center">Ảnh</Text>
            <Text className="w-28 p-3 font-semibold text-gray-700 text-center">Vai trò</Text>
            <Text className="w-36 p-3 font-semibold text-gray-700 text-center">Số điện thoại</Text>
            <Text className="w-72 p-3 font-semibold text-gray-700 text-center">Lịch làm việc</Text>
            <Text className="w-36 p-3 font-semibold text-gray-700 text-center">Trạng thái</Text>
            <Text className="w-56 p-3 font-semibold text-gray-700 text-center">Hành động</Text>
          </View>
          <FlatList
            data={filteredStaff}
            renderItem={renderStaffItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            getItemLayout={(data, index) => ({
              length: 56,
              offset: 56 * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
          {filteredStaff.length === 0 && (
            <Text className="p-4 text-gray-600 text-center">
              Không có nhân viên làm việc vào ngày{' '}
              {filterDay === 'all'
                ? 'hiện tại'
                : filterDay === 'monday'
                ? 'Thứ Hai'
                : filterDay === 'tuesday'
                ? 'Thứ Ba'
                : filterDay === 'wednesday'
                ? 'Thứ Tư'
                : filterDay === 'thursday'
                ? 'Thứ Năm'
                : filterDay === 'friday'
                ? 'Thứ Sáu'
                : filterDay === 'saturday'
                ? 'Thứ Bảy'
                : 'Chủ Nhật'}
              .
            </Text>
          )}
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={showDeleteModal}
        animationType="fade"
        onRequestClose={() => {
          setShowDeleteModal(false);
          setStaffToDelete(null);
        }}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback
            onPress={() => {
              setShowDeleteModal(false);
              setStaffToDelete(null);
            }}
          >
            <View className="flex-1 justify-center items-center">
              <TouchableWithoutFeedback>
                <View className="bg-white rounded-lg p-5 w-80">
                  <Text className="text-lg font-semibold text-gray-800 mb-3">
                    Xác nhận xóa nhân viên
                  </Text>
                  <Text className="text-gray-600 mb-5">
                    Bạn có chắc muốn xóa nhân viên{' '}
                    <Text className="font-medium">{staffToDelete?.name}</Text>?
                  </Text>
                  <View className="flex-row justify-end gap-3">
                    <TouchableOpacity
                      onPress={() => {
                        setShowDeleteModal(false);
                        setStaffToDelete(null);
                      }}
                      className="bg-gray-500 px-4 py-2 rounded-lg"
                      disabled={isLoading}
                    >
                      <Text className="text-white font-medium">Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={confirmDeleteStaff}
                      className={`px-4 py-2 rounded-lg ${isLoading ? 'bg-red-400' : 'bg-red-600'}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text className="text-white font-medium">Xác nhận</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </>
  );
};

export default StaffList;