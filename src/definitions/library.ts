import { UserType } from './students';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
}

export interface Member {
  id: number;
  user: UserType;
  role: string;
}

export interface IssueRecord {
  id: number;
  book: Book;
  copy_number?: string;
  member: Member;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  issued_by?: string;
  is_overdue: boolean;
  days_overdue: number;
  created_on: string;
  updated_on: string;
}

export interface BookType {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publication_date: string;
  copies_available: number;
  total_copies: number;
  unit_price: string;
  created_on: string;
  updated_on: string;
  issue_records: IssueRecord[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
}

export interface Member {
  id: number;
  user: UserType;
  role: string;
}

export interface Bookes_borrowed {
  id: number;
  book: Book;
  copy_number: string;
  member: Member;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  issued_by: UserType;
  is_overdue: boolean;
  days_overdue: number;
  created_on: string;
  updated_on: string;
}

export interface MemberType {
  id: number;
  user: UserType;
  role: string;
  date_joined: string;
  active: boolean;
  status_text: string;
  created_on: string;
  updated_on: string;
  bookes_borrowed: Bookes_borrowed[];
}

export interface IssuedBookType {
  id: number;
  book: Book;
  copy_number: string;
  member: Member;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  issued_by: UserType;
  is_overdue: boolean;
  days_overdue: number;
  created_on: string;
  updated_on: string;
}

export interface FIneType {
  id: number;
  borrow_transaction: IssuedBookType;
  fine_per_day: string;
  calculated_fine: string;
  paid: boolean;
  status_text: string;
  created_on: string;
  updated_on: string;
}
