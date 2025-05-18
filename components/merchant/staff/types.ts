// Interfaces
export interface Schedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'waiter' | 'chef' | 'cashier' | 'manager';
  phone: string;
  schedule: Schedule;
  image?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  workStatus: 'working' | 'no-schedule' | 'on-leave';
}

// Initial staff data
export const initialStaff: Staff[] = [
  {
    id: '1',
    name: 'Lê Minh C',
    role: 'cashier',
    phone: '0912345678',
    schedule: {
      monday: '7:00-17:00',
      tuesday: '7:00-17:00',
      wednesday: 'Nghỉ',
      thursday: 'Nghỉ',
      friday: '7:00-17:00',
      saturday: '7:00-17:00',
      sunday: '7:00-17:00',
    },
    image: null,
    status: 'approved',
    workStatus: 'working',
  },
  {
    id: '2',
    name: 'Nguyễn Văn A',
    role: 'waiter',
    phone: '0123456789',
    schedule: {
      monday: '7:00-17:00',
      tuesday: '7:00-14:00',
      wednesday: '7:00-17:00',
      thursday: '7:00-17:00',
      friday: '7:00-17:00',
      saturday: 'Nghỉ',
      sunday: 'Nghỉ',
    },
    image: null,
    status: 'approved',
    workStatus: 'no-schedule',
  },
  {
    id: '3',
    name: 'Trần Thị B',
    role: 'chef',
    phone: '0987654321',
    schedule: {
      monday: 'Nghỉ',
      tuesday: 'Nghỉ',
      wednesday: '7:00-17:00',
      thursday: '7:00-17:00',
      friday: '7:00-17:00',
      saturday: '7:00-17:00',
      sunday: '7:00-17:00',
    },
    image: 'https://via.placeholder.com/100x100',
    status: 'approved',
    workStatus: 'working',
  },
  {
    id: '4',
    name: 'Phạm Quốc D',
    role: 'manager',
    phone: '0932143657',
    schedule: {
      monday: '7:00-17:00',
      tuesday: '7:00-17:00',
      wednesday: '7:00-17:00',
      thursday: '7:00-17:00',
      friday: 'Nghỉ',
      saturday: 'Nghỉ',
      sunday: '7:00-17:00',
    },
    image: null,
    status: 'approved',
    workStatus: 'working',
  },
];

export const shiftOptions = ['7:00-17:00', 'Nghỉ'];

export const getCurrentDay = (): keyof Schedule => {
  const date = new Date();
  const days: (keyof Schedule)[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()];
};

export const summarizeSchedule = (schedule: Schedule): string => {
  const days = [
    { key: 'monday', label: 'T2' },
    { key: 'tuesday', label: 'T3' },
    { key: 'wednesday', label: 'T4' },
    { key: 'thursday', label: 'T5' },
    { key: 'friday', label: 'T6' },
    { key: 'saturday', label: 'T7' },
    { key: 'sunday', label: 'CN' },
  ];
  const groups: { days: string[]; time: string }[] = [];
  let currentGroup: string[] = [];
  let currentTime = '';
  days.forEach(({ key, label }) => {
    const time = schedule[key];
    if (time === currentTime) {
      currentGroup.push(label);
    } else {
      if (currentGroup.length > 0) {
        groups.push({ days: currentGroup, time: currentTime });
      }
      currentGroup = time && time !== 'Nghỉ' ? [label] : [];
      currentTime = time;
    }
  });
  if (currentGroup.length > 0) {
    groups.push({ days: currentGroup, time: currentTime });
  }
  const result = groups
    .filter((group) => group.time && group.time !== 'Nghỉ')
    .map((group) => `${group.days.join(', ')}: ${group.time}`)
    .join('; ');
  return result || 'Không có lịch';
};