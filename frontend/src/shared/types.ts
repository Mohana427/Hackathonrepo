export interface Asset {
  id: number;
  name: string;
  tag: string;
  is_bookable: boolean;
  status: 'available' | 'allocated' | 'reserved' | 'under_maintenance' | 'lost' | 'retired' | 'disposed';
}

export interface Employee {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

// Allocation & Transfer
export interface Allocation {
  id: number;
  asset_id: number;
  employee_id: number | null;
  department_id: number | null;
  allocated_date: string;
  expected_return_date: string | null;
  actual_return_date: string | null;
  status: 'active' | 'returned';
  condition_check_in_notes: string | null;
}

export interface TransferRequest {
  id: number;
  allocation_id: number;
  requested_by: number;
  requested_to_employee_id: number | null;
  requested_to_department_id: number | null;
  status: 'requested' | 'approved' | 'rejected';
  approved_by: number | null;
  created_at: string;
}

export interface OverdueAllocation {
  asset_tag: string;
  holder_name: string;
  days_overdue: number;
}

// Booking
export interface Booking {
  id: number;
  asset_id: number;
  booked_by: number;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
}

export interface BookingConflictError {
  detail: string;
  conflicting_range: string;
}

// Maintenance
export interface MaintenanceRequest {
  id: number;
  asset_id: number;
  raised_by: number;
  issue_description: string;
  priority: 'low' | 'medium' | 'high';
  photo_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'technician_assigned' | 'in_progress' | 'resolved';
  technician_name: string | null;
  approved_by: number | null;
  created_at: string;
  resolved_at: string | null;
}
