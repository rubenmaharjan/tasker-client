export interface Project {
    id: number;
    name: string;
    start_date: string;
    duration: number;
    duration_type: string;
    active: boolean;
    deliverables: Deliverable[];
}
export interface DeliverableList {
  project_id:number;
  deliverables: Deliverable[];
}
export interface Deliverable{
  id?:number
  deliverable: string;
  sub_deliverables?: SubDeliverable[];
}
export interface SubDeliverable{
  id?:number
  sub_deliverable: string;
}
