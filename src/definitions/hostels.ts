import { CampusType } from './curiculum';
import { StudentDetailsType } from './students';

export interface HostelsType {
  id: number;
  name: string;
  gender: string;
  capacity: number;
  rooms: number;
  room_cost: string;
  campus: CampusType;
  created_on: string;
  updated_on: string;
}

export interface HostelRoomsType {
  id: number;
  hostel: HostelsType;
  created_on: string;
  updated_on: string;
  room_number: string;
  room_capacity: number;
  students_assigned: number;
  fully_occupied: boolean;
  occupancy: string;
  status: string;
}

export interface BookingType {
  id: number;
  hostel_room: HostelRoomsType;
  created_on: string;
  updated_on: string;
  status: string;
  student: StudentDetailsType;
}

export interface OccupantType {
  id: number;
  hostel_room: HostelsType;
  created_on: string;
  updated_on: string;
  status: string;
  student: StudentDetailsType;
}
