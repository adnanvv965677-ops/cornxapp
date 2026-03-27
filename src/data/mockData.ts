import { Client, Project, Invoice, Task } from "@/types/crm";

export const mockClients: Client[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah@techvault.io", company: "TechVault", status: "active", totalSpent: 24500, lastContact: "2026-03-25" },
  { id: "2", name: "James Chen", email: "james@novadigital.com", company: "Nova Digital", status: "active", totalSpent: 18200, lastContact: "2026-03-22" },
  { id: "3", name: "Emma Rodriguez", email: "emma@brightwing.co", company: "Brightwing Co", status: "lead", totalSpent: 0, lastContact: "2026-03-20" },
  { id: "4", name: "David Park", email: "david@luminlabs.io", company: "Lumin Labs", status: "active", totalSpent: 42800, lastContact: "2026-03-18" },
  { id: "5", name: "Olivia Foster", email: "olivia@crestline.com", company: "Crestline", status: "inactive", totalSpent: 8900, lastContact: "2026-02-10" },
  { id: "6", name: "Marcus Webb", email: "marcus@pulseagency.com", company: "Pulse Agency", status: "active", totalSpent: 31400, lastContact: "2026-03-26" },
];

export const mockProjects: Project[] = [
  { id: "1", name: "Website Redesign", clientId: "1", clientName: "TechVault", status: "in-progress", progress: 65, deadline: "2026-04-15", budget: 12000 },
  { id: "2", name: "Mobile App MVP", clientId: "2", clientName: "Nova Digital", status: "in-progress", progress: 40, deadline: "2026-05-01", budget: 28000 },
  { id: "3", name: "Brand Identity", clientId: "4", clientName: "Lumin Labs", status: "review", progress: 90, deadline: "2026-03-30", budget: 8500 },
  { id: "4", name: "SEO Campaign", clientId: "6", clientName: "Pulse Agency", status: "planning", progress: 10, deadline: "2026-04-20", budget: 5000 },
  { id: "5", name: "E-commerce Platform", clientId: "4", clientName: "Lumin Labs", status: "completed", progress: 100, deadline: "2026-03-01", budget: 35000 },
];

export const mockInvoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-001", clientName: "TechVault", amount: 6000, status: "paid", dueDate: "2026-03-15", issuedDate: "2026-03-01" },
  { id: "2", invoiceNumber: "INV-002", clientName: "Nova Digital", amount: 14000, status: "pending", dueDate: "2026-04-01", issuedDate: "2026-03-15" },
  { id: "3", invoiceNumber: "INV-003", clientName: "Lumin Labs", amount: 8500, status: "paid", dueDate: "2026-03-20", issuedDate: "2026-03-05" },
  { id: "4", invoiceNumber: "INV-004", clientName: "Pulse Agency", amount: 2500, status: "overdue", dueDate: "2026-03-10", issuedDate: "2026-02-25" },
  { id: "5", invoiceNumber: "INV-005", clientName: "Crestline", amount: 4200, status: "draft", dueDate: "2026-04-15", issuedDate: "2026-03-27" },
  { id: "6", invoiceNumber: "INV-006", clientName: "TechVault", amount: 6000, status: "paid", dueDate: "2026-02-15", issuedDate: "2026-02-01" },
];

export const mockTasks: Task[] = [
  { id: "1", title: "Design homepage wireframes", projectName: "Website Redesign", assignee: "You", priority: "high", status: "in-progress", dueDate: "2026-03-28" },
  { id: "2", title: "Set up CI/CD pipeline", projectName: "Mobile App MVP", assignee: "You", priority: "medium", status: "todo", dueDate: "2026-03-30" },
  { id: "3", title: "Client feedback review", projectName: "Brand Identity", assignee: "You", priority: "high", status: "todo", dueDate: "2026-03-28" },
  { id: "4", title: "Keyword research", projectName: "SEO Campaign", assignee: "You", priority: "low", status: "todo", dueDate: "2026-04-05" },
  { id: "5", title: "Finalize color palette", projectName: "Brand Identity", assignee: "You", priority: "medium", status: "done", dueDate: "2026-03-25" },
  { id: "6", title: "API integration", projectName: "Mobile App MVP", assignee: "You", priority: "high", status: "in-progress", dueDate: "2026-04-02" },
  { id: "7", title: "Content migration", projectName: "Website Redesign", assignee: "You", priority: "medium", status: "todo", dueDate: "2026-04-10" },
];
