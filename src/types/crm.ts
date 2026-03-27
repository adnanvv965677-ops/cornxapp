export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive" | "lead";
  totalSpent: number;
  lastContact: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: "planning" | "in-progress" | "review" | "completed";
  progress: number;
  deadline: string;
  budget: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  dueDate: string;
  issuedDate: string;
}

export interface Task {
  id: string;
  title: string;
  projectName: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "done";
  dueDate: string;
}
